// Chỉ dùng server createClient → hỗ trợ SSR/SEO tốt
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { ArticleWithTags } from "@/public/lib/types";


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

export const getArticleBySlug = cache(async (slug: string): Promise<ArticleWithTags> => {
    const supabase = await createClient();
    const { data: article, error } = await supabase
        .from("articles")
        .select(ARTICLE_SELECT)
        .eq("status", "published")
        .eq("slug", slug)
        .single();

    if (error) throw error;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        await supabase.rpc("increase_article_view", { article_id: article.id });
    }

    return mapArticle(article);
});

// Lấy danh sách `article` theo `username` 
export const getArticlesByUsername = cache(async (username: string): Promise<ArticleWithTags[]> => {
    const supabase = await createClient();
    let query = supabase
        .from("articles")
        .select(ARTICLE_SELECT)
        .eq("status", "published")
        .eq("user.username", username);

    const { data: articles, error } = await query
        .order("created_at", { ascending: false })
        .limit(15);

    if (error) throw error;
    return articles.map(mapArticle);
});

export const getArticles = cache(async (keyword?: string): Promise<ArticleWithTags[]> => {
    const supabase = await createClient();
    let query = supabase
        .from("articles")
        .select(ARTICLE_SELECT)
        .eq("status", "published");

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
        // .gte("created_at", oneWeekAgo.toISOString()) // trong 7 ngày
        .order("views", { ascending: false }) // sort theo view
        .limit(3);

    if (error) throw error;
    return articles.map(mapArticle);
})