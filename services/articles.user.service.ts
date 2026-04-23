// Chỉ dùng server createClient → hỗ trợ SSR/SEO tốt
import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createClient as createPublishClient } from "@/lib/supabase/client";
import { ArticleWithTags } from "@/public/lib/types";
import { cache } from "react";


export const revalidate = 60;

// Helper tái sử dụng để map raw data → ArticleWithTags
function mapArticle(a: any): ArticleWithTags {
    return {
        ...a,
        username: a.user?.username ?? "",
        user_id: String(a.user?.id),
        display_name: a.user?.display_name ?? "",
        avatar_url: a.user?.avatar_url ?? "",
        tags: a.article_tags?.map((x: any) => ({
            created_at: "",
            id: x.tag.id,
            name: x.tag.name,
        })) ?? [],
    };
}

const ARTICLE_SELECT = `
    *,
    user:users (id, username, display_name, avatar_url),
    article_tags (tag:tags (id, name))
`;

export async function getArticleBySlug(slug: string) {
    return getCachedArticleBySlug( slug); 
}

export async function getCachedArticleBySlug(slug: string) {
    const cached = unstable_cache(
        async (): Promise<ArticleWithTags | null> => {
            const supabase = await createPublishClient();
            const { data: article, error } = await supabase
                .from("articles")
                .select(ARTICLE_SELECT)
                .eq("status", "published")
                .eq("slug", slug)
                .maybeSingle();

            if (error) throw error;
            if (!article) return null;

            return mapArticle(article);
        },
        ["article-by-slug", slug],   
        {
            revalidate: 60,
            tags: [`article-${slug}`], 
        }
    )(); 
    return cached;
}

export async function increaseView(articleId: number) {
    const supabase = await createClient();
    await supabase.rpc("increase_article_view", {
        article_id: articleId,
    });
}

// Lấy danh sách `article` theo `username` 
export const getArticlesByUsername = cache(async (username: string, viewerId?: string): Promise<ArticleWithTags[]> => {
    const supabase = await createClient();
    
    // Lấy id theo username  
    const { data: user, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("username", username)
        .maybeSingle();

    if (userError) throw userError;
    if (!user) return [];

    // Query articles theo user_id
    let query = supabase
        .from("articles")
        .select(ARTICLE_SELECT)
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(15);

    // Chỉ lấy bài viết `publish` nếu không phải chính chủ 
    const isOwner = viewerId && viewerId === user.id;
    if(!isOwner) {
        query = query.eq("status", "published");
    }

    const { data: articles, error } = await query;

    if (error) throw error;
    return articles.map(mapArticle);
});

export const getArticles = cache(async (keyword?: string): Promise<ArticleWithTags[]> => {
    const supabase = await createClient();
    let query = supabase
        .from("articles")
        .select(ARTICLE_SELECT)
        .eq("status", "published")
        .is("deleted_at", null);

    if (keyword) query = query.ilike("title", `%${keyword}%`);

    const { data: articles, error } = await query
        .order("created_at", { ascending: false })
        .limit(15);

    if (error) throw error;
    return articles.map(mapArticle);
});


export const getFeaturedArticles = cache(async () : Promise<ArticleWithTags[]> => {
    const supabase = await createClient();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 30);

    const { data: articles, error } = await supabase
        .from("articles")
        .select(ARTICLE_SELECT)
        .eq("status", "published")
        .is("deleted_at", null)
        //.gte("created_at", oneWeekAgo.toISOString()) // trong 7 ngày
        .order("views", { ascending: false }) // sort theo view
        .limit(3);

    if (error) throw error;
    return articles.map(mapArticle);
})