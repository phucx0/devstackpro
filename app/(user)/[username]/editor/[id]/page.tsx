"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Save } from "lucide-react";
import { useAuth } from "@/public/providers/AuthProvider";
import { Tag, UpdateArticleRequest } from "@/public/lib/types";
import { useParams } from "next/navigation";
import MarkdownRenderer from "@/public/components/MarkdownRenderer";
import Loading from "@/public/components/Loading";
import TagSelector from "@/public/components/admin/TagSelector";
import MarkdownTextarea from "@/public/components/MarkdownTextarea";
import {
  getArticleAction,
  updateArticleAction,
} from "@/server/articles/author.actions";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/useFileUpload";
import ImageUpload from "@/public/components/user/ImageUpload";

function NoirInput({
  label,
  required,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-widest text-(--noir-muted) mb-2">
        {label} {required && <span className="text-(--noir-accent)">*</span>}
      </label>

      <input
        {...props}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full rounded-md bg-var-(--noir-card) border text-[14px] text-(--noir-white) px-3 py-2 outline-none transition
          ${focused ? "border-(--noir-accent)" : "border-(--noir-border)"}
        `}
      />
    </div>
  );
}

export default function UpdateArticlePage() {
  const { id } = useParams();
  const { profile, loading } = useAuth();

  const [_loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<Pick<Tag, "id" | "name">[]>(
    [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [originalArticle, setOriginalArticle] =
    useState<UpdateArticleRequest>();
  const [updatedArticle, setUpdatedArticle] = useState<UpdateArticleRequest>();
  const { uploadFile } = useFileUpload();

  const isChanged = useMemo(() => {
    if (!originalArticle || !updatedArticle) return false;
    return (
      originalArticle.title !== updatedArticle.title ||
      originalArticle.content_md !== updatedArticle.content_md ||
      originalArticle.slug !== updatedArticle.slug ||
      originalArticle.description !== updatedArticle.description ||
      originalArticle.status !== updatedArticle.status ||
      originalArticle.thumbnail !== updatedArticle.thumbnail
    );
  }, [originalArticle, updatedArticle]);
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_URL_IMAGE!;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setUpdatedArticle((prev) => {
      if (!prev) return prev;

      const next: any = { ...prev, [name]: value };

      if (name === "title") {
        next.slug = value
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[đĐ]/g, "d")
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim();
      }
      return next;
    });
  };
  const handleRemoveThumbnail = () => {
    setUpdatedArticle((prev) =>
      prev
        ? {
            ...prev,
            thumbnail: undefined,
          }
        : prev,
    );
  };

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
        setUpdatedArticle((prev) =>
          prev
            ? {
                ...prev,
                thumbnail: fileKey,
              }
            : prev,
        );
        return;
      }
      toast.error("Upload thumbnail failed");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Upload error: ", error.message);
    }
  };

  const handleSubmit = async () => {
    if (!updatedArticle || !isChanged) return;

    setIsSubmitting(true);
    try {
      const result = await updateArticleAction(updatedArticle);
      if (result) {
        setOriginalArticle(updatedArticle);
        toast.success("Cập nhật thành công!");
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (id) {
      (async () => {
        setLoading(true);
        const result = await getArticleAction(Number(id));
        if (result) {
          const _article: UpdateArticleRequest = {
            id: result.id,
            title: result.title,
            slug: result.slug,
            content_md: result.content_md || undefined,
            description: result.description || undefined,
            status: result.status || "draft",
            tags: result.tags || [],
            thumbnail: result.thumbnail || undefined,
          };

          setOriginalArticle(_article);
          setUpdatedArticle({ ..._article });
          setSelectedTags(result.tags || null);
        }
        setLoading(false);
      })();
    }
  }, [id, loading]);

  if (_loading) return <Loading />;

  if (!updatedArticle || !originalArticle) {
    return (
      <div className="text-center py-20 font-mono text-[11px] uppercase tracking-widest text-(--noir-muted)">
        Không có dữ liệu
      </div>
    );
  }

  return (
    <div className="px-4 w-full font-body">
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[rgba(8,8,8,0.95)] border-b border-(--noir-border) mb-7">
        <div className="flex items-center justify-between h-14 px-1">
          <div className="flex items-center gap-3">
            <div className="w-[3px] h-[26px] bg-(--noir-accent) rounded" />
            <h1 className="font-display text-xl font-bold text-(--noir-white)">
              Update Article
            </h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview((p) => !p)}
              className={`flex items-center gap-2 px-3 py-2 text-[10px] uppercase tracking-widest font-mono border rounded transition cursor-pointer 
                ${showPreview ? "text-(--noir-accent)" : "text-(--noir-muted)"}  ${showPreview ? "border-(--noir-accent)" : "border-(--noir-border)"}
              `}
            >
              {showPreview ? <EyeOff size={12} /> : <Eye size={12} />}
              {showPreview ? "Hide Preview" : "Preview"}
            </button>

            <button
              onClick={handleSubmit}
              disabled={!isChanged}
              className="flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-widest font-mono rounded bg-(--noir-accent) text-black disabled:opacity-40"
            >
              <Save size={12} />
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </header>

      {/* GRID */}
      <main className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-5">
        {/* LEFT */}
        <div className="flex flex-col gap-4">
          <div className="p-6 rounded-sm border border-(--noir-border) bg-(--noir-surface) flex flex-col gap-4">
            <NoirInput
              label="Title"
              name="title"
              value={updatedArticle.title ?? ""}
              onChange={handleInputChange}
              required
            />

            <NoirInput
              label="Slug"
              name="slug"
              value={updatedArticle.slug ?? ""}
              onChange={handleInputChange}
            />

            <NoirInput
              label="Description"
              name="description"
              value={updatedArticle.description ?? ""}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="p-6 rounded-sm border border-(--noir-border) bg-(--noir-surface)">
            <label className="block font-mono text-[10px] uppercase tracking-widest text-(--noir-muted) mb-2">
              Content <span className="text-(--noir-accent)">*</span>
            </label>

            <MarkdownTextarea
              content={updatedArticle.content_md ?? ""}
              onChange={(text) =>
                setUpdatedArticle((p) => (p ? { ...p, content_md: text } : p))
              }
            />
          </div>

          {/* PREVIEW */}
          {showPreview && (
            <div className="p-6 rounded-sm border border-(--noir-accent) bg-(--noir-surface)">
              <h3 className="font-display text-2xl text-white mb-2">
                {updatedArticle.title}
              </h3>

              <p className="text-[10px] font-mono text-(--noir-muted) mb-4">
                /{updatedArticle.slug}
              </p>

              {updatedArticle.thumbnail && (
                <img
                  src={IMAGE_BASE_URL + updatedArticle.thumbnail}
                  className="w-full h-[200px] object-cover rounded mb-4 border border-(--noir-border)"
                />
              )}

              <MarkdownRenderer content={updatedArticle.content_md ?? ""} />
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">
          <div className="p-6 rounded-sm border border-(--noir-border) bg-(--noir-surface)">
            <label className="block font-mono text-[10px] uppercase text-(--noir-muted) mb-2">
              Status
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { value: "draft", icon: <EyeOff size={14} />, label: "Nháp" },
                {
                  value: "published",
                  icon: <Eye size={14} />,
                  label: "Xuất bản",
                },
              ].map((opt) => {
                const active = updatedArticle.status === opt.value;
                return (
                  <label
                    key={opt.value}
                    className={`flex items-center justify-start gap-2.5 px-3.5 py-2.5 rounded-sm border-[0.5px] cursor-pointer transition-all duration-200
                      ${
                        active
                          ? "border-(--noir-accent) bg-(--noir-accent-bg)"
                          : "border-(--noir-border) bg-transparent"
                      } 
                    `}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={opt.value}
                      checked={active}
                      onChange={handleInputChange}
                      style={{ display: "none" }}
                    />
                    <span
                      className={
                        active ? "text-(--noir-accent)" : "text-(--noir-muted)"
                      }
                    >
                      {opt.icon}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        letterSpacing: "0.08em",
                        color: active
                          ? "var(--noir-accent)"
                          : "var(--noir-muted)",
                      }}
                    >
                      {opt.label}
                    </span>
                    {active && (
                      <div
                        style={{
                          marginLeft: "auto",
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "var(--noir-accent)",
                        }}
                      />
                    )}
                  </label>
                );
              })}
            </div>
          </div>
          <div className="p-6 rounded-sm border border-(--noir-border) bg-(--noir-surface)">
            <label className="block font-mono text-[10px] uppercase text-(--noir-muted) mb-2">
              Tags
            </label>
            <TagSelector
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          </div>

          {/* Upload Thumbnail Image */}
          <ImageUpload
            label="Thumbnail"
            thumbnailUrl={updatedArticle.thumbnail || null}
            onChange={handleUpload}
            onRemove={handleRemoveThumbnail}
          />
        </div>
      </main>
    </div>
  );
}
