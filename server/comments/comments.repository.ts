// comments.repository.ts
import { createClient } from "@/lib/supabase/server";

const COMMENT_SELECT = `
    id,
    user_id,
    parent_id,
    article_id,
    content,
    created_at,
    user:users!user_id (id, username, display_name, avatar_url),
    reply_count:comments!parent_id(count)
`;

/**
 * Lấy danh sách comment gốc (không có parent) theo bài viết
 *
 * @param articleId - ID bài viết
 * @returns Danh sách comment raw từ database
 * @throws Error nếu query thất bại
 */
export async function findParentComments(articleId: number) {
    const db = await createClient();
    const { data, error } = await db
        .from("comments")
        .select(COMMENT_SELECT)
        .eq("article_id", articleId)
        .is("deleted_at", null)
        .is("parent_id", null)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
}

/**
 * Lấy danh sách reply theo parent comment
 *
 * @param parentId - ID comment cha
 * @returns Danh sách reply raw từ database
 * @throws Error nếu query thất bại
 */
export async function findReplies(parentId: number) {
    const db = await createClient();
    const { data, error } = await db
        .from("comments")
        .select(COMMENT_SELECT)
        .eq("parent_id", parentId)
        .is("deleted_at", null)
        .order("created_at", { ascending: true });

    if (error) throw error;
    return data ?? [];
}

/**
 * Kiểm tra parent comment tồn tại và chưa bị xóa
 *
 * @param parentId - ID comment cha
 * @returns Comment nếu tồn tại, null nếu không
 */
export async function findParentComment(parentId: number) {
    const db = await createClient();
    const { data } = await db
        .from("comments")
        .select("id, deleted_at")
        .eq("id", parentId)
        .single();

    return data;
}

/**
 * Tạo comment mới
 *
 * @param params.articleId - ID bài viết
 * @param params.content - Nội dung comment
 * @param params.parentId - ID comment cha (nếu là reply)
 * @param params.userId - ID user tạo comment
 * @returns Comment vừa tạo
 * @throws Error nếu insert thất bại
 */
export async function insertComment(params: {
    articleId: number;
    content: string;
    parentId: number | null;
    userId: string;
}) {
    const db = await createClient();
    const { articleId, content, parentId, userId } = params;

    const { data, error } = await db
        .from("comments")
        .insert({
            article_id: articleId,
            content,
            parent_id: parentId,
            user_id: userId,
        })
        .select("id, user_id, parent_id, article_id, content, created_at")
        .single();

    if (error) throw error;
    return data;
}

/**
 * Soft delete comment theo id và user_id (tránh xóa của người khác)
 *
 * @param commentId - ID comment
 * @param userId - ID user thực hiện xóa
 * @throws Error nếu update thất bại
 */
export async function softDeleteComment(commentId: string, userId: string) {
    const db = await createClient();
    const { error } = await db
        .from("comments")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", commentId)
        .eq("user_id", userId);

    if (error) throw error;
}