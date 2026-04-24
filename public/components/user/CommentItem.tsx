"use client";
import { CommentPublish } from "@/public/lib/types";
import { useAuth } from "@/public/providers/AuthProvider";
import {
  createCommentAction,
  deleteCommentAction,
  getRepliesAction,
} from "@/server/article-comments/article-comments.actions";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ReplyEditor } from "./ReplyEditor";
import { ThreeDotMenu } from "./CommentMenu";
import { toast } from "sonner";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_URL_IMAGE!;

function deleteInTree(
  comments: CommentPublish[],
  id: string,
): CommentPublish[] {
  return comments
    .filter((c) => String(c.id) !== id)
    .map((c) => ({ ...c, replies: deleteInTree(c.replies, id) }));
}

export function CommentItem({
  comment,
  depth = 0,
  onReply,
  onDelete,
}: {
  comment: CommentPublish;
  depth?: number;
  onReply: (parentId: string, text: string) => void;
  onDelete: (id: string) => void;
}) {
  const [replying, setReplying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(true);
  const [replies, setReplies] = useState<CommentPublish[]>([]);
  const { profile } = useAuth();

  // Fix: check cả replies.length để hiện reply mới tạo ngay
  const hasReplies = comment.reply_count > 0 || replies.length > 0;

  const handleReply = async (parentId: string, text: string) => {
    try {
      if (String(comment.id) === parentId) {
        const newReply = await createCommentAction({
          articleId: comment.article_id,
          content: text,
          parentId: Number(parentId),
        });
        setReplies((prev) => [...prev, newReply]);
        setCollapsed(false); // mở ra để thấy reply mới
      } else {
        onReply(parentId, text);
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteCommentAction(id);
    setReplies((prev) => deleteInTree(prev, id));
  };

  useEffect(() => {
    if (!collapsed && replies.length === 0) {
      setLoading(true);
      getRepliesAction(comment.id)
        .then(setReplies)
        .finally(() => setLoading(false));
    }
  }, [collapsed]);

  return (
    <div className="relative">
      {/* Thread line */}
      {hasReplies && !collapsed && (
        <button
          onClick={() => setCollapsed(true)}
          className="absolute left-4 top-10 bottom-0 w-0.75 bg-(--noir-border) hover:bg-(--noir-accent) transition-colors cursor-pointer"
          title="Collapse thread"
        >
          <span className="sr-only">Collapse thread</span>
        </button>
      )}

      <div className="flex gap-3">
        {/* Avatar */}
        <div className="shrink-0">
          <div className="relative h-8 w-8 rounded-full overflow-hidden border border-(--noir-border)">
            <Image
              src={IMAGE_BASE_URL + comment.user.avatar_url}
              alt={comment.user.username}
              className="object-cover"
              fill
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/${comment.user.username}`}
              className="text-sm font-semibold text-(--noir-white) hover:text-(--noir-accent) transition-colors"
            >
              {comment.user.display_name}
            </Link>
            <span className="text-[11px] text-(--noir-muted)">
              {comment.created_at}
            </span>

            {/* Expand replies */}
            {hasReplies && collapsed && (
              <button
                onClick={() => setCollapsed(false)}
                className="text-[11px] text-(--noir-accent) hover:underline ml-1 cursor-pointer"
              >
                [{comment.reply_count || replies.length} repl
                {(comment.reply_count || replies.length) > 1 ? "ies" : "y"}]
              </button>
            )}

            <div className="ml-auto">
              <ThreeDotMenu
                isOwner={comment.user_id === profile?.id}
                onDelete={() => onDelete(String(comment.id))}
              />
            </div>
          </div>

          {/* Content */}
          <p className="text-sm text-gray-300 mt-1 leading-relaxed">
            {comment.content}
          </p>

          {/* Actions */}
          {profile && (
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              <button
                onClick={() => setReplying((p) => !p)}
                className="flex items-center gap-1.5 text-xs text-(--noir-muted) hover:text-(--noir-white) transition-colors px-2 py-1 rounded hover:bg-white/5"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M14 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3v3l4-3h5a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
                </svg>
                Reply
              </button>
            </div>
          )}
          {/* Reply editor */}
          {replying && (
            <ReplyEditor
              onSubmit={(text) => {
                handleReply(String(comment.id), text);
                setReplying(false);
              }}
              onCancel={() => setReplying(false)}
            />
          )}

          {/* Nested replies */}
          {hasReplies && !collapsed && (
            <div className="mt-3 flex flex-col gap-3 pl-4">
              {loading ? (
                <p className="text-sm text-(--noir-muted)">Loading...</p>
              ) : replies.length === 0 ? (
                <p className="text-sm text-(--noir-muted)">
                  Not found replies.
                </p>
              ) : (
                replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    depth={depth + 1}
                    onReply={handleReply}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
