import { createClient } from "@/lib/supabase/server";
import { createClient as createPublishClient } from "@/lib/supabase/client";
import { ArticlePublish } from "@/public/lib/types";
import * as ArticleRepo from "@/server/articles/articles.repository"
import { getAuthUser } from "@/server/users/auth.service";
import { unstable_cache } from "next/cache";
import { getLikedSet, mapArticle } from "@/server/articles/articles.helpers";

export async function increaseView(articleId: number) {
    const supabase = await createClient();
    await supabase.rpc("increase_article_view", {
        article_id: articleId,
    });
}

const getCachedArticles = unstable_cache(
  async () => {
    const db = await createPublishClient();
    return ArticleRepo.getArticles({ limit: 15, db });
  },
  ["articles-list"],
  { revalidate: 60, tags: ["articles"] }
);

/**
 * Lấy danh sách 15 bài viết, nếu user tồn tại sẽ thêm trạng thái like
 * @param cursor 
 * @returns trả về 15 bài viết 
 */
export async function getArticles(cursor?: string): Promise<ArticlePublish[]> {
    const db = await createPublishClient();
    const raw = cursor
        ? (await ArticleRepo.getArticles({ limit: 15, cursor, db }))
        : await getCachedArticles();

    const user = await getAuthUser();
    // const likedSet = user
    //     ? await getLikedSet(raw.map(a => a.id), user.id)
    //     : new Set<number>();

    const likedSet = new Set<number>();

    return raw.map(a => ({ ...mapArticle(a), is_liked: likedSet.has(a.id) }));
} 


/**
 * Lấy danh sách bài viết theo username đã publish
 * 
 * @param username 
 * @param limit 
 * @returns 
 */
export async function getArticlesByUsername(username: string, limit: number): Promise<ArticlePublish[]> {
    if(!username) throw new Error("Username is required");
    const raw = await ArticleRepo.getArticlesByUsername({username, limit});  
    
    const user = await getAuthUser();
    const likedSet = user
        ? await getLikedSet(raw.map(a => a.id), user.id)
        : new Set<number>();

    return raw.map(a => ({ ...mapArticle(a), is_liked: likedSet.has(a.id) }));
}


/**
 * Lấy danh sách bài viết của chính user kèm Draft  
 * 
 * @param userId 
 * @param limit - số lượng bài viết đã trả về 
 * @returns Danh sách bài viết (publish | draft)
 */
export async function getMyArticles(userId: string, limit: number): Promise<ArticlePublish[]> {
    const raw = await ArticleRepo.getArticlesByUserId({userId: userId, limit, includeDraft: true});  
    const likedSet = await getLikedSet(raw.map(a => a.id), userId)
    return raw.map(a => ({ ...mapArticle(a), is_liked: likedSet.has(a.id) }));
}


function getCachedArticle(slug: string) {
    return unstable_cache(
        () => ArticleRepo.getArticleBySlug(slug),
        [`article-${slug}`],
        { revalidate: 3600, tags: [`article-${slug}`] }
    )();
}

/**
 * Lấy chi tiết bài viết theo slug đã published 
 * @param slug 
 * @returns chi tiết bài viết nếu có, ngược lại trả về null 
 */
export async function getArticleBySlug(slug: string): Promise<ArticlePublish | null>  {
    if(!slug) throw new Error("slug is required");
    const article = await getCachedArticle(slug);
    if (!article) return null;
    return mapArticle(article);
}


/**
 * Lấy danh sách bài viết của người mà user theo dõi 
 * @param userId 
 * @param limit 
 * @returns danh sách bài viết | [] 
 */
export async function getFollowingFeed(userId: string, limit: number = 10) {
    if(!userId) throw new Error("userId is required");
    if (limit < 0 || limit > 50) throw new Error("Limit must be between 0 and 50");
    const raw = await ArticleRepo.getFollowingFeed({
        followerId: userId,
        limit
    });

    const likedSet = await getLikedSet(raw.map(a => a.id), userId)
    return raw.map(a => ({ ...mapArticle(a), is_liked: likedSet.has(a.id) }));
}