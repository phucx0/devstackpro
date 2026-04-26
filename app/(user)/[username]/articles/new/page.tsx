"use client";
import { useState, useEffect } from "react";
import { Upload, X, Eye, EyeOff, Save, Sparkles, Loader2 } from "lucide-react";
import { CreateArticleRequest, Tag } from "@/public/lib/types";
import MarkdownRenderer from "@/public/components/MarkdownRenderer";
import TagSelector from "@/public/components/admin/TagSelector";
import MarkdownTextarea from "@/public/components/MarkdownTextarea";
import { insertArticleAction } from "@/server/articles/articles.private.action";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useAuth } from "@/public/providers/AuthProvider";
import { useRouter } from "next/navigation";
import ImageUpload from "@/public/components/user/ImageUpload";

/* ─── NoirInput ─── */
function NoirInput({
  label,
  required,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-(--noir-muted) mb-2">
        {label}
        {required && <span className="text-(--noir-accent) ml-0.5">*</span>}
      </label>
      <input
        {...props}
        className="w-full bg-(--noir-card) border border-(--noir-border) rounded-md
          text-(--noir-white) font-body text-sm px-3.5 py-[11px] outline-none
          transition-colors duration-200 box-border focus:border-(--noir-accent)"
      />
    </div>
  );
}

/* ─── AI Generate Modal ─── */
function AIGenerateModal({
  open,
  onClose,
  onGenerate,
}: {
  open: boolean;
  onClose: () => void;
  onGenerate: (prompt: string) => void;
}) {
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const examples = [
    "Viết bài về xu hướng AI trong năm 2025",
    "Bài viết về cách tối ưu hiệu suất Next.js",
    "Phân tích thị trường công nghệ Việt Nam Q1 2025",
  ];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-(--noir-surface) border border-(--noir-border) rounded-xl p-7 w-full max-w-[520px] mx-4 shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-(--noir-accent-bg) border border-(--noir-accent) flex items-center justify-center shrink-0">
            <Sparkles size={16} className="text-(--noir-accent)" />
          </div>
          <div>
            <p className="font-display font-bold text-base text-(--noir-white) tracking-tight">
              AI Generate
            </p>
            <p className="font-mono text-[9px] text-(--noir-muted) tracking-[0.1em] uppercase">
              Powered by Grok
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-(--noir-muted) hover:text-(--noir-white) transition-colors p-1 cursor-pointer bg-transparent border-none"
          >
            <X size={16} />
          </button>
        </div>

        {/* Textarea */}
        <div className="mb-3.5">
          <label className="block font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-(--noir-muted) mb-2">
            Mô tả bài viết bạn muốn tạo
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="VD: Hãy tạo 1 bài viết đầy đủ về xu hướng AI năm 2025..."
            rows={4}
            className="w-full bg-(--noir-card) border border-(--noir-border) rounded-md
              text-(--noir-white) font-body text-sm px-3.5 py-[11px] outline-none
              transition-colors duration-200 resize-y leading-relaxed focus:border-(--noir-accent)"
          />
        </div>

        {/* Quick prompts */}
        <div className="mb-5">
          <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-(--noir-muted) mb-1.5">
            Gợi ý nhanh
          </p>
          <div className="flex flex-wrap gap-1.5">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => setPrompt(ex)}
                className="font-mono text-[9px] tracking-[0.06em] text-(--noir-muted)
                  bg-(--noir-card) border border-(--noir-border) rounded px-2.5 py-1.5
                  cursor-pointer transition-all duration-150
                  hover:border-(--noir-accent) hover:text-(--noir-accent)"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="font-mono text-[10px] tracking-[0.1em] uppercase text-(--noir-muted)
              bg-transparent border border-(--noir-border) px-4 py-2 rounded cursor-pointer
              hover:text-(--noir-white) hover:border-(--noir-border-md) transition-colors"
          >
            Huỷ
          </button>
          <button
            onClick={() => {
              if (prompt.trim()) {
                onGenerate(prompt.trim());
                onClose();
                setPrompt("");
              }
            }}
            disabled={!prompt.trim()}
            className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] uppercase
              text-(--noir-black) px-4 py-2 rounded border-none transition-all duration-200
              enabled:bg-(--noir-accent) enabled:cursor-pointer
              disabled:bg-(--noir-border) disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Sparkles size={11} />
            Tạo bài viết
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ─── */
export default function CreateArticle({ onClose }: { onClose?: () => void }) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const { uploadFile } = useFileUpload();
  const [isGenerating, setIsGenerating] = useState(false);
  const { profile } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<CreateArticleRequest>({
    title: "",
    slug: "",
    description: "",
    content_md: "",
    thumbnail: "",
    status: "draft",
    tags: [],
  });

  /* Escape to close */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const toSlug = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "title") next.slug = toSlug(value);
      return next;
    });
  };

  //   const handleAIGenerate = async (userPrompt: string) => {
  //     setIsGenerating(true);
  //     setFormData((prev) => ({ ...prev, content_md: "" }));
  //     try {
  //       const response = await fetch("/api/ai-generate", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ prompt: userPrompt }),
  //       });
  //       if (!response.ok) {
  //         const err = await response.json().catch(() => ({}));
  //         throw new Error(err.error || "Không thể tạo bài viết");
  //       }
  //       const metaHeader = response.headers.get("X-Blog-Meta");
  //       let meta: any = null;
  //       if (metaHeader) {
  //         try {
  //           meta = JSON.parse(metaHeader);
  //         } catch {}
  //       }

  //       const reader = response.body?.getReader();
  //       const decoder = new TextDecoder();
  //       let content = "";
  //       if (reader) {
  //         while (true) {
  //           const { done, value } = await reader.read();
  //           if (done) break;
  //           content += decoder.decode(value, { stream: true });
  //           setFormData((prev) => ({ ...prev, content_md: content }));
  //         }
  //       }
  //       if (meta) {
  //         setFormData((prev) => ({
  //           ...prev,
  //           title: meta.title ?? prev.title,
  //           slug: toSlug(meta.title ?? prev.title),
  //           description: meta.description ?? prev.description,
  //           content_md: content,
  //         }));
  //       }
  //     } catch (err: any) {
  //       alert(err.message || "Có lỗi khi tạo bài viết.");
  //     } finally {
  //       setIsGenerating(false);
  //     }
  //   };

  // Upload Image to R2
  const handleUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.warning("Chỉ upload hình ảnh thôi!");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB
      toast.warning("File quá lớn! Tối đa 10MB.");
      return;
    }

    try {
      const { fileKey, success, error } = await uploadFile(file, "image");
      if (success) {
        toast.success("Upload thumbnail successfully");
        setFormData((prev) => ({
          ...prev,
          thumbnail: fileKey,
        }));
        return;
      }
      toast.error("Upload thumbnail failed");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Upload error: ", error.message);
    }
  };

  const handleSubmit = async (status?: "draft" | "published") => {
    const submitData = {
      ...formData,
      tags: selectedTags,
      ...(status ? { status } : {}),
    };
    if (!submitData.title) return toast.warning("Missing article title");
    if (!submitData.description)
      return toast.warning("Missing article descripton");
    if (!submitData.slug) return toast.warning("Missing article slug");
    if (!submitData.content_md) return toast.warning("Missing article content");
    if (!submitData.thumbnail) return toast.warning("Missing thumbnail");

    setIsSubmitting(true);
    try {
      const result = await insertArticleAction(submitData);
      if (result) {
        router.refresh();
        router.push(`/${profile?.username}`);
      }
    } catch (err) {
      // console.error(err);
      toast.error("Something error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const card =
    "bg-(--noir-surface) border border-(--noir-border) rounded-md p-6";

  return (
    <div className="w-full px-4">
      {/* <AIGenerateModal
        open={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerate={handleAIGenerate}
      /> */}

      {/* ── Header — sticky bên trong scroll container của parent ── */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-2xl border-b border-(--noir-border) -mx-4 px-4 mb-6">
        <div className="flex items-center justify-between h-12">
          {/* Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-0.5 h-5 bg-(--noir-accent) rounded-full" />
            <h2 className="font-display font-bold text-lg text-(--noir-white) tracking-tight m-0 leading-none">
              New Article
            </h2>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            {/* AI Generate */}
            {/* <button
              onClick={() => setShowAIModal(true)}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] uppercase
                bg-(--noir-accent-bg) border border-(--noir-accent) text-(--noir-accent)
                px-3 py-1.5 rounded transition-all duration-200
                enabled:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <Sparkles size={11} />
              )}
              AI Generate
            </button> */}

            <div className="w-px h-4 bg-(--noir-border)" />

            {/* Preview */}
            <button
              onClick={() => setShowPreview((p) => !p)}
              className={`inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] uppercase
                bg-transparent px-4 py-[7px] rounded border transition-all duration-200 cursor-pointer
                ${
                  showPreview
                    ? "text-(--noir-accent) border-(--noir-accent)"
                    : "text-(--noir-muted) border-(--noir-border) hover:text-(--noir-white) hover:border-(--noir-border-md)"
                }`}
            >
              {showPreview ? <EyeOff size={11} /> : <Eye size={11} />}
              Preview
            </button>

            {/* Save draft */}
            <button
              onClick={() => handleSubmit("draft")}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase text-(--noir-accent) border border-(--noir-accent) bg-transparent px-4 py-[7px] rounded transition-colors duration-200 enabled:cursor-pointer 
                disabled:opacity-50 disabled:cursor-not-allowed hover:bg-(--noir-accent) hover:text-(--noir-black)"
            >
              <Save size={11} />
              Draft
            </button>

            {/* Publish */}
            <button
              onClick={() => handleSubmit("published")}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] uppercase
                text-(--noir-black) bg-(--noir-accent) border-none
                px-4 py-[7px] rounded transition-opacity duration-200
                enabled:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <Eye size={11} />
              )}
              Publish
            </button>

            {/* Close */}
            {onClose && (
              <>
                <div className="w-px h-4 bg-(--noir-border)" />
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded
                    text-(--noir-muted) hover:text-(--noir-white)
                    border border-(--noir-border) hover:border-(--noir-border-md)
                    bg-transparent transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Body grid ── */}
      <div
        className="grid gap-5 pb-16"
        style={{ gridTemplateColumns: "7fr 3fr" }}
      >
        {/* Left */}
        <div className="flex flex-col gap-4">
          {/* AI generating banner */}
          {isGenerating && (
            <div className="flex items-center gap-3 bg-(--noir-accent-bg) border border-(--noir-accent) rounded-md px-5 py-4">
              <Loader2
                size={15}
                className="text-(--noir-accent) animate-spin shrink-0"
              />
              <div>
                <p className="font-mono text-[10px] tracking-[0.1em] text-(--noir-accent) uppercase">
                  Grok đang tạo bài viết…
                </p>
                <p className="font-mono text-[9px] text-(--noir-muted) mt-0.5">
                  Nội dung sẽ tự động điền vào các trường bên dưới
                </p>
              </div>
            </div>
          )}

          {/* Basic info */}
          <div className={`${card} flex flex-col gap-[18px]`}>
            <NoirInput
              label="Title"
              required
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter article title…"
            />
            <NoirInput
              label="Slug (URL)"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="auto-generated-slug"
            />
            <NoirInput
              label="Description"
              required
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter article description"
            />
          </div>

          {/* Markdown */}
          <div className={card}>
            <label className="block font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-(--noir-muted) mb-2">
              Content (Markdown)
              <span className="text-(--noir-accent) ml-0.5">*</span>
            </label>
            <MarkdownTextarea
              content={formData.content_md ?? ""}
              onChange={(text: string) =>
                setFormData((prev) => ({ ...prev, content_md: text }))
              }
            />
          </div>

          {/* Preview */}
          {showPreview && formData.title && (
            <div className={`${card} border-l-2 border-l-(--noir-accent)`}>
              <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-(--noir-accent) mb-4">
                Live Preview
              </p>
              <h3 className="font-display font-extrabold text-2xl text-(--noir-white) tracking-tight mb-1.5">
                {formData.title}
              </h3>
              <p className="font-mono text-[10px] text-(--noir-muted) mb-4 tracking-[0.05em]">
                /{formData.slug}
              </p>
              {formData.thumbnail && (
                <img
                  src={formData.thumbnail}
                  alt="Preview"
                  className="w-full h-[200px] object-cover rounded-md mb-5 border border-(--noir-border)"
                />
              )}
              {formData.content_md && (
                <div className="noir-markdown">
                  <MarkdownRenderer content={formData.content_md} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4">
          {/* Tags */}
          {/* <div className={card}>
            <TagSelector
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          </div> */}

          {/* Thumbnail */}
          <ImageUpload
            label="Thumbnail"
            thumbnailUrl={formData.thumbnail || null}
            onChange={handleUpload}
            onRemove={() =>
              setFormData((prev) => ({
                ...prev,
                thumbnail: "",
              }))
            }
          />
        </div>
      </div>
    </div>
  );
}
