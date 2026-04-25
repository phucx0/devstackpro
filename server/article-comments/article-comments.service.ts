import { createClient } from "@/lib/supabase/server";
import { getUser } from "../users/users.service";
import { CommentPublish, CommentUser, UserPublish } from "@/public/lib/types";

export async function getParentComments(articleId: number): Promise<CommentPublish[]> {
    const supabase = await createClient();

    if (!articleId) throw new Error("Missing field");

    const { data, error } = await supabase
        .from("comments")
        .select(`
            id,
            user_id,
            parent_id,
            article_id,
            content,
            created_at,
            user:users!user_id (id, username, display_name, avatar_url),
            reply_count:comments!parent_id(count)
        `)
        .eq("article_id", articleId)
        .is("deleted_at", null)
        .is("parent_id", null)
        .order("created_at", { ascending: false });

    if (error) throw error;

    return (data ?? []).map(c => ({
        ...c,
        reply_count: (c.reply_count as unknown as { count: number }[])[0]?.count ?? 0,
        replies: [],
        user: c.user as unknown as CommentUser, 
    }));
}

export async function getReplies(parentId: number): Promise<CommentPublish[]> {
    const supabase = await createClient();

    if (!parentId) throw new Error("Missing field");

    const { data, error } = await supabase
        .from("comments")
        .select(`
            id,
            user_id,
            parent_id,
            article_id,
            content,
            created_at,
            user:users!user_id (id, username, display_name, avatar_url),
            reply_count:comments!parent_id(count)
        `)
        .eq("parent_id", parentId)
        .is("deleted_at", null)
        .order("created_at", { ascending: true });

    if (error) throw error;

    return (data ?? []).map(r => ({
        ...r,
        reply_count: (r.reply_count as unknown as { count: number }[])[0]?.count ?? 0,
        replies: [],
        user: r.user as unknown as CommentUser
    }));
}

export async function createComment(params: {
    articleId: number;
    content: string;
    parentId?: number | null;
}): Promise<CommentPublish> {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) throw new Error("Unauthorized");

    const { articleId, content, parentId = null } = params;
    if (!articleId || !content) throw new Error("Missing field");

    // Kiểm tra parent comment chưa bị xóa
    if (parentId) {
        const { data: parent } = await supabase
            .from("comments")
            .select("id, deleted_at")
            .eq("id", parentId)
            .single();

        if (!parent || parent.deleted_at) throw new Error("Parent comment not found");
    }

    const { data, error } = await supabase
        .from("comments")
        .insert({
            article_id: articleId,
            content,
            parent_id: parentId,
            user_id: user.id,
        })
        .select(`id, user_id, parent_id, article_id, content, created_at`)
        .single();

    if (error) throw error;

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

export async function deleteComment(commentId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");
    if (!commentId) throw new Error("Missing field");

    const { error } = await supabase
        .from("comments")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", commentId)
        .eq("user_id", user.id)
        .select();

    if(error) throw error;
}