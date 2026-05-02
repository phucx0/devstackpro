"use client";

import { MoreHorizontal } from "lucide-react";
import { ArticlePublish } from "@/public/lib/types";
import DeleteArticleDialog from "@/public/components/user/DeletetArticleDialog";
import ArticleMenu from "@/public/components/user/ArticleCard/ArticleMenu";
import { useEffect } from "react";

interface CardOverlayProps {
  article: ArticlePublish;
  isOwner: boolean;
  menuOpen: boolean;
  showDeleteDialog: boolean;
  isDeleting: boolean;
  onMenuToggle: () => void;
  onMenuClose: () => void;
  onDeleteRequest: () => void;
  onDeleteConfirm: () => void;
  onDeleteDialogClose: () => void;
}

/** Nút 3-chấm + menu + dialog — nằm ngoài <Link> */
export function CardOverlay({
  article,
  isOwner,
  menuOpen,
  showDeleteDialog,
  isDeleting,
  onMenuToggle,
  onMenuClose,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteDialogClose,
}: CardOverlayProps) {
  const stopPropagation = (e: React.MouseEvent) => e.preventDefault();

  useEffect(() => {
    console.log(menuOpen);
  }, [menuOpen]);
  return (
    <div
      onMouseLeave={onMenuClose}
      className="absolute top-2.5 right-2.5 z-10"
      onClick={stopPropagation}
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (menuOpen) {
            onMenuClose(); // đóng trực tiếp thay vì toggle
          } else {
            onMenuToggle(); // mở
          }
        }}
        aria-label="Mở menu bài viết"
        className="
          w-7 h-7 flex items-center justify-center rounded-full
          bg-black/55 backdrop-blur-md border border-(--noir-border)
          text-(--noir-muted) hover:text-(--noir-white) hover:bg-black/75
          cursor-pointer transition-colors duration-150
          opacity-0 group-hover:opacity-100
        "
      >
        <MoreHorizontal size={14} />
      </button>

      {menuOpen && (
        <ArticleMenu
          article={article}
          isOwner={isOwner}
          onClose={onMenuClose}
          onDelete={onDeleteRequest}
        />
      )}

      {showDeleteDialog && (
        <DeleteArticleDialog
          articleTitle={article.title}
          onConfirm={onDeleteConfirm}
          onClose={onDeleteDialogClose}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
