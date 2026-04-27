"use server"
import { CommentPublish } from "@/public/lib/types";
import { createComment, deleteComment, getParentComments, getReplies } from "./comments.service";

// Check if user has liked the article 
export async function getParentCommentsAction(articleId: number){
    return getParentComments(articleId);
}

export async function getRepliesAction(parentId: number){
    return getReplies(parentId);
}

export async function createCommentAction(params: {
    articleId: number;
    content: string;
    parentId?: number | null;
}): Promise<CommentPublish> {
    const { articleId, content, parentId = null } = params;
    return createComment({
        articleId: articleId, 
        content: content,
        parentId: parentId
    })
}

export async function deleteCommentAction(commentId: string){
    return deleteComment(commentId);
}
