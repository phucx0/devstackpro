"use client";
import {
  Heart,
  Trash,
  Repeat,
  MessageCircle,
  Edit,
  MoreHorizontal,
  Bookmark,
  Flag,
} from "lucide-react";

import { ArticlePublish } from "@/public/lib/types";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DeleteArticleDialog from "./DeletetArticleDialog";
import { deleteArticleAction } from "@/server/articles/articles.private.action";
import { ToggleLikeArticleAction } from "@/server/article-likes/article-likes.action";

/* ─── Dropdown menu ─── */
function ArticleMenu({
  isOwner,
  onClose,
  article,
  onDelete,
}: {
  isOwner: boolean;
  onClose: () => void;
  article: ArticlePublish;
  onDelete: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const handleEdit = () => {
    router.push(`/${article.user.username}/editor/${article.id}`);
  };

  const ownerItems = [
    {
      icon: <Edit size={14} />,
      label: "Edit post",
      danger: false,
      onClick: handleEdit,
    },
    {
      icon: <Trash size={14} />,
      label: "Delete post",
      danger: true,
      onClick: onDelete,
    },
  ];

  const visitorItems = [
    {
      icon: <Bookmark size={14} />,
      label: "Save",
      danger: false,
      onClick: () => {},
    },
    {
      icon: <Flag size={14} />,
      label: "Report this post",
      danger: true,
      onClick: () => {},
    },
  ];

  const items = isOwner ? ownerItems : visitorItems;

  return (
    <div
      ref={ref}
      className="absolute top-7 right-0 z-50 min-w-[180px] overflow-hidden rounded-md
        bg-(--noir-surface) border border-(--noir-border) shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
    >
      {items.map(({ icon, label, danger, onClick }) => (
        <button
          key={label}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick();
            onClose();
          }}
          className={`flex items-center gap-2.5 w-full px-3.5 py-2.5
            bg-transparent border-none cursor-pointer text-left text-xs font-body
            transition-colors duration-100 hover:bg-white/[0.04]
            ${danger ? "text-[#E24B4A]" : "text-(--noir-muted)"}`}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
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

/* ─── Card ─── */
export default function ArticleCard({
  article,
  isOwner,
  index,
}: {
  article: ArticlePublish;
  isOwner: boolean;
  index: number;
}) {
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_URL_IMAGE ?? "";
  const [liked, setLiked] = useState(article.is_liked);
  const [reposted, setReposted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [likes, setLikes] = useState(article.likes_count);
  const [reposts, setReposts] = useState(Math.floor(Math.random() * 40 + 1));

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const thumbColor = ThumbColors[index % ThumbColors.length];
  const redirectUrl =
    article.status === "published"
      ? `/${article.user.username}/articles/${article.slug}`
      : `/${article.user.username}/editor/${article.id}`;

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteArticleAction(article.id);
    setIsDeleting(false);
    setShowDeleteDialog(false);
    router.refresh();
  };

  const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await ToggleLikeArticleAction(article.id);
    setLiked(result.liked);
    setLikes((n) => (result.liked ? n + 1 : n - 1));
  };

  return (
    /* Wrapper div để tách link ra khỏi các interactive element */
    <div className="relative group">
      {/* ── 3-dot menu — nằm NGOÀI Link ── */}
      <div
        className="absolute top-2.5 right-2.5 z-10"
        onClick={(e) => e.preventDefault()}
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMenuOpen((o) => !o);
          }}
          className="w-7 h-7 flex items-center justify-center rounded-full
            bg-black/55 backdrop-blur-md border border-(--noir-border)
            text-(--noir-muted) hover:text-(--noir-white) hover:bg-black/75
            cursor-pointer transition-colors duration-150
            opacity-0 group-hover:opacity-100"
        >
          <MoreHorizontal size={14} />
        </button>

        {menuOpen && (
          <ArticleMenu
            article={article}
            isOwner={isOwner}
            onClose={() => setMenuOpen(false)}
            onDelete={() => {
              setMenuOpen(false);
              setShowDeleteDialog(true);
            }}
          />
        )}

        {showDeleteDialog && (
          <DeleteArticleDialog
            articleTitle={article.title}
            onConfirm={handleDelete}
            onClose={() => setShowDeleteDialog(false)}
            isDeleting={isDeleting}
          />
        )}
      </div>

      {/* ── Link bao toàn bộ card ── */}
      <Link
        href={redirectUrl}
        className="block cursor-pointer overflow-hidden
          bg-(--noir-card) border border-(--noir-border)
          hover:border-(--noir-border-md) transition-colors duration-200"
      >
        {/* Thumbnail */}
        <div className="w-full aspect-video relative overflow-hidden">
          {article.thumbnail ? (
            <img
              src={IMAGE_BASE_URL + article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${thumbColor} 0%, rgba(255,255,255,0.03) 100%)`,
              }}
            >
              <span
                className="font-display text-[48px]"
                style={{ color: "rgba(255,255,255,0.06)" }}
              >
                {article.title[0]}
              </span>
            </div>
          )}

          {/* Tag badge */}
          {/* {article.tags && (
            <span
              className="absolute top-3 left-3
                bg-black/65 backdrop-blur-lg border border-(--noir-border)
                text-(--noir-accent) font-mono text-[10px] tracking-[0.08em] uppercase
                px-2 py-0.5 rounded"
            >
              tags
            </span>
          )} */}
        </div>

        {/* Body */}
        <div className="px-[18px] pt-4 pb-3.5">
          <h2
            className="font-display font-medium text-[15px] leading-[1.45]
              text-(--noir-white) mb-2 tracking-[-0.01em] line-clamp-1"
          >
            {article.title}
          </h2>

          {article.description && (
            <p
              className="text-[12.5px] text-(--noir-muted) leading-[1.65] mb-3.5
                line-clamp-2"
            >
              {article.description}
            </p>
          )}

          {/* Divider */}
          <div className="h-px bg-(--noir-border) mb-3" />

          {/* Actions — stopPropagation ở đây để tránh Link navigate khi click button */}
          <div
            className="flex items-center gap-1"
            onClick={(e) => e.preventDefault()}
          >
            {/* Like */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md
                border-none font-mono text-xs cursor-pointer transition-colors duration-150
                ${
                  liked
                    ? "bg-[#E24B4A]/10 text-[#E24B4A]"
                    : "bg-transparent text-(--noir-muted) hover:bg-white/[0.04]"
                }`}
            >
              <Heart size={14} />
              {likes}
            </button>

            {/* Comment */}
            <button
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md
                border-none bg-transparent font-mono text-xs
                text-(--noir-muted) hover:bg-white/[0.04]
                cursor-pointer transition-colors duration-150"
            >
              <MessageCircle size={14} />
            </button>

            {/* Repost */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setReposted((v) => !v);
                setReposts((n) => (reposted ? n - 1 : n + 1));
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md
                border-none font-mono text-xs cursor-pointer transition-colors duration-150
                ${
                  reposted
                    ? "bg-(--noir-accent)/10 text-(--noir-accent)"
                    : "bg-transparent text-(--noir-muted) hover:bg-white/[0.04]"
                }`}
            >
              <Repeat size={14} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
