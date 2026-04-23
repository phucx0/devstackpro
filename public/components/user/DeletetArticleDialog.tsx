"use client";
import { useEffect, useRef } from "react";
import { Trash2, X } from "lucide-react";

interface Props {
  articleTitle: string;
  onConfirm: () => void;
  onClose: () => void;
  isDeleting?: boolean;
}

export default function DeleteArticleDialog({
  articleTitle,
  onConfirm,
  onClose,
  isDeleting = false,
}: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  /* Focus nút Cancel khi mở (accessibility) */
  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  /* Escape to close */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  /* Lock scroll */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-(--noir-surface) border border-(--noir-border) rounded-lg w-full max-w-[400px] mx-4 shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#E24B4A]/10 border border-[#E24B4A]/30 flex items-center justify-center shrink-0">
              <Trash2 size={16} className="text-[#E24B4A]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[15px] text-(--noir-white) tracking-tight leading-none mb-0.5">
                Xóa bài viết
              </h3>
              <p className="font-mono text-[9px] text-(--noir-muted) tracking-[0.08em] uppercase">
                Hành động không thể hoàn tác
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-(--noir-muted) hover:text-(--noir-white) transition-colors
              p-1 bg-transparent border-none cursor-pointer mt-0.5"
          >
            <X size={15} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-(--noir-border)" />

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-[13px] text-(--noir-muted) leading-[1.7]">
            Bạn có chắc muốn xóa bài viết
          </p>
          <p className="text-[13px] text-(--noir-white) font-medium leading-[1.5] mt-1 line-clamp-2">
            "{articleTitle}"
          </p>
          <p className="text-[12px] text-(--noir-muted) leading-[1.7] mt-3">
            Bài viết sẽ bị xóa vĩnh viễn và không thể khôi phục lại.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-6 pb-6">
          <button
            ref={cancelRef}
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 font-mono text-[11px] tracking-[0.08em] uppercase
              text-(--noir-muted) border border-(--noir-border) bg-transparent
              py-2.5 rounded cursor-pointer transition-colors duration-150
              hover:text-(--noir-white) hover:border-(--noir-border-md)
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Huỷ
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 inline-flex items-center justify-center gap-2
              font-mono text-[11px] tracking-[0.08em] uppercase
              text-white bg-[#E24B4A] border-none
              py-2.5 rounded cursor-pointer transition-opacity duration-150
              hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang xóa…
              </>
            ) : (
              <>
                <Trash2 size={13} />
                Xóa bài viết
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
