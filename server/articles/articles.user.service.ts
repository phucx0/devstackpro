import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createClient as createPublishClient } from "@/lib/supabase/client";
import { ArticlePublish } from "@/public/lib/types";
import { cache } from "react";
import { getUser } from "../users/users.service";
// ==================================
// Service này sử dụng cho các user 
// ==================================


export const revalidate = 60;

// Helper tái sử dụng để map raw data → ArticlePublish
function mapArticle(a: any, likedSet: Set<number> = new Set()): ArticlePublish {
    return {
        ...a,
        user: {
            id:           a.user?.id           ?? "",
            username:     a.user?.username     ?? "",
            display_name: a.user?.display_name ?? "",
            avatar_url:   a.user?.avatar_url   ?? "",
            role:         a.user?.role         ?? "user",
        },
        tags: a.article_tags?.map((x: any) => ({
            id:   x.tag.id,
            name: x.tag.name,
        })) ?? [],
        likes_count: Number(a.likes_count?.[0]?.count ?? 0),
        is_liked: likedSet.has(a.id)
    };
}

const ARTICLE_SELECT = `
    *,
    user:users!articles_user_id_fkey (id, username, display_name, avatar_url),
    article_tags (tag:tags (id, name)),
    likes_count:article_likes (count)
`;

// Helper build select string
function buildSelect(userId?: string) {
    const isLikedSelect = userId
        ? `, is_liked:article_likes(user_id)`
        : "";
    return `${ARTICLE_SELECT}${isLikedSelect}`;
}

export async function getArticleBySlug(slug: string) {
    return getCachedArticleBySlug( slug); 
}

export async function getCachedArticleBySlug(slug: string) {
    const cached = unstable_cache(
        async (): Promise<ArticlePublish | null> => {
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
export const getArticlesByUsername = cache(async (username: string, viewerId?: string): Promise<ArticlePublish[]> => {
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
        .select(buildSelect(viewerId))
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
    return articles.map((a) => mapArticle(a));
});

export const getArticles = cache(async (): Promise<ArticlePublish[]> => {
    const supabase = await createClient();
    const authUser =  await getUser();
    
    // Query 1: articles + likes_count, không có is_liked
    const { data: articles, error } = await supabase
        .from("articles")
        .select(`
            *,
            user:users!articles_user_id_fkey (id, username, display_name, avatar_url),
            article_tags (tag:tags (id, name)),
            likes_count:article_likes (count)
        `)
        .eq("status", "published")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(15);

    if (error) throw error;

    // Query 2: chỉ chạy nếu có user, tối đa 15 rows
    let likedSet = new Set<number>();
    if (authUser) {
        const { data: likedRows } = await supabase
            .from("article_likes")
            .select("article_id")
            .eq("user_id", authUser.id)
            .in("article_id", articles.map(a => a.id));

        likedSet = new Set(likedRows?.map(r => r.article_id));
    }

    return articles.map((a) => mapArticle(a, likedSet));
});


export const getFeaturedArticles = cache(async () : Promise<ArticlePublish[]> => {
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
    return articles.map((a) => mapArticle(a));
})