import { createClient } from "@/lib/supabase/server";
import { createClient as createPublishClient } from "@/lib/supabase/client";
import { ArticleStatus, UpdateArticleRequest } from "@/public/lib/types";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Lấy danh sách bài viết đã publish
 * 
 * @param params - Tham số phân trang 
 * @param params.limit - Số lượng bài viết trả về
 * @param params.cursor - (optional) cursor để pagination 
 * 
 * @returns Danh sách article raw từ database 
 * 
 * @throws Error nếu query database thất bại 
 */
export async function getArticles(params : {limit: number, cursor?: string, db: SupabaseClient}) {
    const { limit , cursor, db } = params;
    let query = db
        .from("articles")
        .select(`
            *,
            user:users!articles_user_id_fkey (id, username, display_name, avatar_url),
            article_tags (tag:tags (id, name)),
            likes_count:article_likes (count)
        `)
        .eq("status", "published")
        .is("deleted_at", null)
    
    if (cursor) query = query.lt("created_at", cursor);

    const { data, error } = await query
        .order("created_at", { ascending: false })
        .limit(limit)
    if(error) throw error
    return data
}



/**
 * Lấy bài viết theo đã publish theo slug 
 *  
 * @param params.slug - slug của bài viết
 * 
 * @returns Bài viết tương ứng nếu tồn tại, ngược lại trả về null 
 * 
 * @throws Error nếu query database thất bại 
 */
export async function getArticleBySlug(slug: string) {
    const db = await createPublishClient();
    const { data, error } = await db
        .from("articles")
        .select(`
            *,
            user:users!articles_user_id_fkey (id, username, display_name, avatar_url),
            article_tags (tag:tags (id, name)),
            likes_count:article_likes (count)
        `)
        .eq("slug", slug)
        .eq("status", "published")
        .is("deleted_at", null)
        .maybeSingle()

    if(error) throw error
    return data
}



/**
 * Lấy danh sách bài viết đã publish theo username 
 * 
 * @param params - Tham số truy vấn 
 * @param params.username username của user 
 * @param params.limit Số lượng bài viết trả về 
 *  
 * @returns Danh sách bài viết theo username, ngược lại trả về null 
 * 
 * @throws Error nếu query database thất bại 
 */

export async function getArticlesByUsername(params: { username: string, limit: number }) {
    const db = await createClient();
    const { username, limit } = params;

    const { data, error } = await db
        .from("articles")
        .select(`
            *,
            user:users!articles_user_id_fkey!inner (id, username, display_name, avatar_url),
            article_tags (tag:tags (id, name)),
            likes_count:article_likes (count)
        `)
        .eq("user.username", username)
        .eq("status", "published")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(limit)

    if(error) throw error
    return data
}


/**
 * Lấy danh sách bài viết của người mà user đang theo dõi 
 * 
 * @param params.follower_id user_id của user
 * @param params.limit Số lượng bài viết trả về 
 * 
 * @returns Danh sách bài viết của người mà user đang theo dõi, ngược lại trả về null 
 * 
 * @throws  Error nếu query database thất bại 
 */
export async function getFollowingFeed(params: {
    followerId: string,
    limit: number,
    cursor?: string,
    cursorId?: number
}) {
    const db = await createClient();
    const { followerId, limit, cursor, cursorId } = params;

    const { data: ids, error: rpcError } = await db.rpc("get_following_feed", {
        fid: followerId,
        lim: limit,
        cursor: cursor ?? null,
        cursor_id: cursorId ?? null,
    });

    if (rpcError) throw rpcError;
    if (!ids?.length) return [];

    const { data, error } = await db
        .from("articles")
        .select(`
            *,
            user:users!articles_user_id_fkey (id, username, display_name, avatar_url),
            article_tags (tag:tags (id, name)),
            likes_count:article_likes (count)
        `)
        .in("id", ids)
        .order("created_at", { ascending: false })
        .order("id", { ascending: false });

    if (error) throw error;
    return data;
}



// ===================
// Author - Không cần Cache
// ===================

/**
 * Lấy bài viết theo đã publish theo slug 
 *  
 * @param params.slug - slug của bài viết
 * 
 * @returns Bài viết tương ứng nếu tồn tại, ngược lại trả về null 
 * 
 * @throws Error nếu query database thất bại 
 */
export async function getArticleById(params : {
    articleId: string,
    userId: string, 
}) {
    const db = await createClient();
    const { articleId, userId } = params;

    const { data, error } = await db
        .from("articles")
        .select(`
            *,
            user:users!articles_user_id_fkey (id, username, display_name, avatar_url),
            article_tags (tag:tags (id, name)),
            likes_count:article_likes (count)
        `)
        .eq("id", Number(articleId))
        .eq("user_id", userId)
        .is("deleted_at", null)
        .maybeSingle()

    if(error) throw error
    return data
}


/**
 * Lấy danh sách bài viết đã publish theo user_id 
 * 
 * @param params - Tham số truy vấn 
 * @param params.userId user_id của bài viết  
 * @param params.limit Số lượng bài viết trả về 
 *  
 * @returns Danh sách bài viết theo user_id, ngược lại trả về null 
 * 
 * @throws Error nếu query database thất bại 
 */

export async function getArticlesByUserId(params: { userId: string, limit: number, includeDraft?: boolean  }) {
    const db = await createClient();
    const { userId, limit, includeDraft } = params;
    let query = db
        .from("articles")
        .select(`
            *,
            user:users!articles_user_id_fkey (id, username, display_name, avatar_url),
            article_tags (tag:tags (id, name)),
            likes_count:article_likes (count)
        `)
        .eq("user_id", userId)
        .is("deleted_at", null)
    
    // Nếu không include sẽ trả về bài viết published  
    if(!includeDraft) query = query.eq("status", "published");

    const { data, error } = await query
        .order("created_at", { ascending: false })
        .limit(limit)

    if(error) throw error
    return data
}



/**
 * Cập nhật bài viết theo id và user_id
 *
 * @param params.article - Dữ liệu cập nhật
 * @param params.userId  - user_id của chủ bài viết (ownership check do service xử lý)
 * @param params.db      - Supabase client
 *
 * @returns Bài viết sau khi cập nhật
 *
 * @throws Error nếu query thất bại hoặc không tìm thấy bài viết
 */
export async function updateArticle(params: {
    article: UpdateArticleRequest;
    userId: string;
    db: SupabaseClient;
}) {
    const { article, userId, db } = params;

    const { data, error } = await db
        .from("articles")
        .update({
            title:       article.title,
            slug:        article.slug,
            description: article.description,
            content_md:  article.content_md,
            thumbnail:   article.thumbnail,
            status:      article.status,
            updated_at:  new Date().toISOString(),
        })
        .eq("id", article.id)
        .eq("user_id", userId)
        .select()
        .single();

    if (error) throw error;
    if (!data) throw new Error(`Không tìm thấy bài viết với id = ${article.id}`);

    return data;
}

/**
 * Soft delete bài viết theo id và user_id
 *
 * @param params.id     - id của bài viết cần xóa
 * @param params.userId - user_id của chủ bài viết (ownership check do service xử lý)
 * @param params.db     - Supabase client
 *
 * @throws Error nếu query thất bại
 */
export async function deleteArticle(params: {
    id: number;
    userId: string;
    db: SupabaseClient;
}) {
    const { id, userId, db } = params;

    const { error } = await db
        .from("articles")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id)
        .eq("user_id", userId);

    if (error) throw error;
}


/**
 * Tạo bài viết mới
 *
 * @param params.userId - ID của tác giả
 * @param params.title - Tiêu đề bài viết
 * @param params.slug - Slug URL của bài viết
 * @param params.description - Mô tả ngắn
 * @param params.content_md - Nội dung dạng Markdown
 * @param params.thumbnail - URL ảnh thumbnail
 * @param params.status - Trạng thái bài viết ("draft" | "published")
 *
 * @returns ID của bài viết vừa tạo
 *
 * @throws Error nếu insert thất bại
 */

export async function insertArticle(params: {
    userId: string;
    title: string;
    slug: string;
    description: string;
    content_md: string;
    thumbnail: string;
    status: ArticleStatus;
    db: SupabaseClient
}) {
    const now = new Date().toISOString();

    const { data, error } = await params.db
        .from("articles")
        .insert({
            user_id: params.userId,
            title: params.title,
            slug: params.slug,
            description: params.description,
            content_md: params.content_md,
            thumbnail: params.thumbnail,
            status: params.status,
            created_at: now,
            updated_at: now,
        })
        .select("id")
        .single();

    if (error) throw error;
    return data;
}