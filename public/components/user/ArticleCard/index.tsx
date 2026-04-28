"use client";

import Link from "next/link";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { useArticleCard } from "@/hooks/useArticleCard";
import { CardOverlay } from "./CardOverlay";
import { CardThumbnail } from "./CardThumbnail";
import { CardActions } from "./CardActions";
import { ArticlePublish } from "@/public/lib/types";
import { getAvatarUrl } from "@/lib/utils/image";
import { formatArticleTime } from "@/lib/utils/time";
import { useRouter } from "next/navigation";

interface ArticleCardProps {
  article: ArticlePublish;
  isOwner: boolean;
  index: number;
}

/* ─── Thumb palette ─── */
const ThumbColors = [
  "#0f1a0a",
  "#0a0f1a",
  "#1a0a0f",
  "#1a1500",
  "#0d1520",
  "#1a100a",
];

export default function ArticleCard({
  article,
  isOwner,
  index,
}: ArticleCardProps) {
  const {
    liked,
    likes,
    reposted,
    reposts,
    menuOpen,
    setMenuOpen,
    showDeleteDialog,
    setShowDeleteDialog,
    isDeleting,
    handleLike,
    handleRepost,
    handleDelete,
  } = useArticleCard(article);
  const router = useRouter();
  const thumbColor = ThumbColors[index % ThumbColors.length];
  const redirectUrl =
    article.status === "published"
      ? `/${article.user.username}/articles/${article.slug}`
      : `/${article.user.username}/editor/${article.id}`;
  return (
    <div className="relative group">
      <CardOverlay
        article={article}
        isOwner={isOwner}
        menuOpen={menuOpen}
        showDeleteDialog={showDeleteDialog}
        isDeleting={isDeleting}
        onMenuToggle={() => setMenuOpen((o) => !o)}
        onMenuClose={() => setMenuOpen(false)}
        onDeleteRequest={() => {
          setMenuOpen(false);
          setShowDeleteDialog(true);
        }}
        onDeleteConfirm={handleDelete}
        onDeleteDialogClose={() => setShowDeleteDialog(false)}
      />

      <div
        onClick={() => router.push(redirectUrl)}
        className={`block cursor-pointer overflow-hidden bg-(--noir-card) border border-(--noir-border) hover:border-(--noir-border-md) transition-colors duration-200`}
      >
        {/* Author */}
        <div className="flex items-center gap-2 mx-4 my-2">
          <Link
            href={`/${article.user.username}`}
            onClick={(e) => e.stopPropagation()}
            className="relative h-10 w-10 rounded-full border border-(--noir-border) overflow-hidden flex-shrink-0"
          >
            <Image
              fill
              src={getAvatarUrl(article.user.avatar_url ?? "")}
              alt={article.user.username ?? ""}
            />
          </Link>

          <Link
            href={`/${article.user.username}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 group/author"
          >
            <span className="text-sm group-hover/author:underline">
              {article.user.display_name}
            </span>
            <BadgeCheck size={16} />
          </Link>

          <time
            className="text-xs text-(--noir-muted)"
            dateTime={article.created_at ?? undefined}
            title={
              article.created_at
                ? new Date(article.created_at).toLocaleString()
                : ""
            }
          >
            {article.created_at ? formatArticleTime(article.created_at) : ""}
          </time>
        </div>

        <CardThumbnail
          thumbnail={article.thumbnail}
          title={article.title}
          thumbColor={thumbColor}
        />

        {/* Body */}
        <div className="px-[18px] pt-4 pb-3.5">
          <h2 className="font-display font-medium text-[15px] leading-[1.45] text-(--noir-white) mb-2 tracking-[-0.01em] line-clamp-1">
            {article.title}
          </h2>

          {article.description && (
            <p className="text-[12.5px] text-(--noir-muted) leading-[1.65] mb-3.5 line-clamp-2">
              {article.description}
            </p>
          )}

          {article.status === "published" && (
            <div>
              <div className="h-px bg-(--noir-border) mb-3" />
              <CardActions
                liked={liked}
                likes={likes}
                reposted={reposted}
                onLike={handleLike}
                onRepost={handleRepost}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
