import { createClient } from "@/lib/supabase/server";
import { ArticlePublish, Tag } from "@/public/lib/types";
import { RawArticle } from "@/types/article";

// Helper tái sử dụng để map raw data → ArticlePublish
export function mapArticle(a: RawArticle): ArticlePublish {
    if(!a.user) throw new Error("Article must have user");
    return {
        ...a,
        user: {
            id:           a.user?.id ?? "",
            username:     a.user?.username?? "",
            display_name: a.user?.display_name?? "",
            avatar_url:   a.user?.avatar_url?? "",
            role:         a.user?.role ?? "user",
        },
        tags: a.article_tags?.map((x: {tag: Tag}) => ({
            id:   x.tag.id,
            name: x.tag.name,
        })) ?? [],
        likes_count: a.likes_count?.[0]?.count ?? 0,
    };
}

/**
 * Lấy số bài viết user đã like theo articleIds 
 * 
 * @param articleIds - Danh sách id bài viết 
 * @param userId - user_id của user 
 * @returns Set article_id user đã like 
 */

export async function getLikedSet(articleIds: number[], userId: string): Promise<Set<number>> {
    const supabase = await createClient();
    const { data } = await supabase
        .from("article_likes")
        .select("article_id")
        .eq("user_id", userId)
        .in("article_id", articleIds);

    return new Set(data?.map(r => r.article_id));
}