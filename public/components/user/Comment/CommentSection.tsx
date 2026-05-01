"use client";
import { CommentPublish } from "@/public/lib/types";
import { useAuth } from "@/public/providers/AuthProvider";
import {
  createCommentAction,
  deleteCommentAction,
  getParentCommentsAction,
} from "@/server/comments/comments.actions";
import Image from "next/image";
import { useState, useEffect } from "react";
import { CommentItem } from "./CommentItem";
import { useRouter } from "next/navigation";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_URL_IMAGE!;

function deleteInTree(
  comments: CommentPublish[],
  id: string,
): CommentPublish[] {
  return comments
    .filter((c) => String(c.id) !== id)
    .map((c) => ({ ...c, replies: deleteInTree(c.replies, id) }));
}

type CommentSectionProps = {
  articleId: number;
  username: string;
  slug: string;
};

export default function CommentSection({
  articleId,
  username,
  slug,
}: CommentSectionProps) {
  const [comments, setComments] = useState<CommentPublish[]>([]);
  const [newComment, setNewComment] = useState("");
  const [sortBy, setSortBy] = useState<"top" | "new">("top");
  const { profile } = useAuth();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    await deleteCommentAction(id);
    setComments((prev) => deleteInTree(prev, id));
  };

  const handleSubmit = async () => {
    if (!newComment.trim() || !articleId) return;

    const comment = await createCommentAction({
      articleId,
      content: newComment.trim(),
    });

    setComments((prev) => [comment, ...prev]);
    setNewComment("");
  };

  const handleClick = () => {
    const path = `/${username}/articles/${slug}#comment-section`;

    router.push(`/sign-in?callbackUrl=${encodeURIComponent(path)}`);
  };

  useEffect(() => {
    if (!articleId) return;
    getParentCommentsAction(articleId).then(setComments);
  }, [articleId]);

  return (
    <div className="flex flex-col gap-6" id="comment-section">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-(--noir-white)">
          {comments.length} Comments
        </h2>
        <div className="flex items-center gap-1 text-xs text-(--noir-muted)">
          Sort by:
          {(["top", "new"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-2 py-1 rounded capitalize transition-colors ${
                sortBy === s
                  ? "text-(--noir-accent) font-semibold"
                  : "hover:text-(--noir-white)"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* New comment box */}
      {profile ? (
        <div>
          <div className="flex gap-3">
            <div className="shrink-0">
              <div className="relative h-8 w-8 rounded-full overflow-hidden border border-(--noir-border)">
                <Image
                  src={IMAGE_BASE_URL + profile?.avatar_url}
                  alt="you"
                  className="object-cover"
                  fill
                />
              </div>
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                    handleSubmit();
                }}
                disabled={!articleId}
                placeholder="What are your thoughts?"
                rows={3}
                className="w-full resize-none rounded-lg border border-(--noir-border) bg-white/[0.03] px-3 py-2.5 text-sm text-(--noir-white) placeholder:text-(--noir-muted) outline-none focus:border-white/20 transition-colors"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleSubmit}
                  disabled={!newComment.trim()}
                  className="text-sm px-4 py-1.5 rounded-lg bg-(--noir-accent) text-black font-semibold disabled:opacity-40 hover:brightness-110 transition-all"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.length === 0 && (
            <div className="text-center my-4">
              Be the first to start the conversation
            </div>
          )}
          <button
            onClick={handleClick}
            className="text-center font-bold text-[14px] text-(--noir-black) py-4 rounded bg-(--noir-accent) cursor-pointer"
          >
            Sign in to join the conversation
          </button>
        </div>
      )}

      {comments.length > 0 && (
        <div className="flex flex-col gap-5">
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              onReply={() => {}}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
