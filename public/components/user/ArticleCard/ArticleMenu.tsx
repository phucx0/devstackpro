"use client";
import { ArticlePublish } from "@/public/lib/types";
import { Bookmark, Edit, Flag, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function ArticleMenu({
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
