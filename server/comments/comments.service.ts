import * as CommentRepo from "@/server/comments/comments.repository";
import { getUser } from "@/server/users/users.service";
import { CommentPublish, CommentUser, RawComment } from "@/public/lib/types";

function mapComment(c: RawComment): CommentPublish {
    if (!c) throw new Error("mapComment received undefined comment");
    if (!c.user) throw new Error(`Comment ${c.id} has no user`);

    return {
        id: Number(c.id),
        article_id: Number(c.article_id),
        parent_id: Number(c.parent_id) || null,
        user_id: c.user_id,
        content: c.content,
        reply_count: (c.reply_count as { count: number }[])[0]?.count ?? 0,
        replies: [],
        user: {
            id:           c.user.id,
            username:     c.user.username,
            display_name: c.user.display_name,
            avatar_url:   c.user.avatar_url,
        },
        created_at: c.created_at
    };
}

/**
 * Lấy danh sách comment gốc theo bài viết
 *
 * @param articleId - ID bài viết
 */
export async function getParentComments(articleId: number): Promise<CommentPublish[]> {
    if (!articleId) throw new Error("Missing field");
    const raw = await CommentRepo.findParentComments(articleId);
    return raw.map(mapComment);
}

/**
 * Lấy danh sách reply theo parent comment
 *
 * @param parentId - ID comment cha
 */
export async function getReplies(parentId: number): Promise<CommentPublish[]> {
    if (!parentId) throw new Error("Missing field");
    const raw = await CommentRepo.findReplies(parentId);
    return raw.map(mapComment);
}

/**
 * Tạo comment hoặc reply
 *
 * @param params.articleId - ID bài viết
 * @param params.content - Nội dung comment
 * @param params.parentId - ID comment cha (nếu là reply)
 */
export async function createComment(params: {
    articleId: number;
    content: string;
    parentId?: number | null;
}): Promise<CommentPublish> {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const { articleId, content, parentId = null } = params;
    if (!articleId || !content) throw new Error("Missing field");

    if (parentId) {
        const parent = await CommentRepo.findParentComment(parentId);
        if (!parent || parent.deleted_at) throw new Error("Parent comment not found");
    }

    const data = await CommentRepo.insertComment({
        articleId,
        content,
        parentId,
        userId: user.id,
    });

    return {
        ...data,
        reply_count: 0,
        replies: [],
        user: {
            id: user.id,
            username: user.username,
            display_name: user.display_name,
            avatar_url: user.avatar_url,
        } as CommentUser,
    };
}

/**
 * Xóa mềm comment
 *
 * @param commentId - ID comment cần xóa
 */
export async function deleteComment(commentId: string): Promise<void> {
    if (!commentId) throw new Error("Missing field");

    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    await CommentRepo.softDeleteComment(commentId, user.id);
}