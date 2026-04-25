import { createClient } from "@/lib/supabase/server";
import { getUser } from "../users/users.service";
import { ArticlePublish } from "@/public/lib/types";

const ARTICLE_SELECT = `
    *,
    user:users!articles_user_id_fkey (id, username, display_name, avatar_url),
    article_tags (tag:tags (id, name)),
    likes_count:article_likes (count)
`;

function mapArticle(a: any, currentUserId?: string): ArticlePublish {
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
        is_liked: currentUserId
            ? !!(a.is_liked?.some((like: any) => like.user_id === currentUserId))
            : false,
    };
}

export async function searchArticles(keyword?: string): Promise<ArticlePublish[]> {
    const supabase = await createClient();
    const authUser =  await getUser();
    
    const { data: articles, error } = await supabase
        .from("articles")
        .select(ARTICLE_SELECT)
        .eq("status", "published")
        .ilike("title", `%${keyword}%`)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(15);

    if (error) throw error;
    return articles.map((a) => mapArticle(a, authUser?.id));
};