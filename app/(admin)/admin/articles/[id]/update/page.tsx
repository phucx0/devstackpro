"use client";
import { useEffect, useState } from "react";
import { Upload, X, Eye, EyeOff, Save } from "lucide-react";
import { articleAPI } from "@/public/lib/api";
import { useUser } from "@/public/providers/UserProvider";
import { ArticleWithTags, Tag, UpdateArticleRequest } from "@/public/lib/types";
import { redirect, useParams } from "next/navigation";
import MarkdownRenderer from "@/public/components/MarkdownRenderer";
import Loading from "@/public/components/Loading";
import TagSelector from "@/public/components/admin/TagSelector";
import MarkdownTextarea from "@/public/components/MarkdownTextarea";

/* ─── Shared style tokens ─── */
const S = {
  card: {
    background: "var(--noir-surface)",
    border: "0.5px solid var(--noir-border)",
    borderRadius: 6,
    padding: "24px",
  } as React.CSSProperties,
  label: {
    display: "block",
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "var(--noir-muted)",
    marginBottom: 8,
  } as React.CSSProperties,
  required: {
    color: "var(--noir-accent)",
    marginLeft: 3,
  } as React.CSSProperties,
};

type PreviewImage = { id?: number; url: string; name: string };

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
      <label style={S.label}>
        {label}
        {required && <span style={S.required}>*</span>}
      </label>
      <input
        {...props}
        style={{
          width: "100%",
          background: "var(--noir-card)",
          borderRadius: 6,
          border: `0.5px solid ${focused ? "var(--noir-accent)" : "var(--noir-border)"}`,
          color: "var(--noir-white)",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          padding: "11px 14px",
          outline: "none",
          transition: "border-color 0.2s",
          boxSizing: "border-box",
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

export default function UpdateArticlePage() {
  const { id } = useParams();
  const { token, loading } = useUser();
  const [_loading, setLoading] = useState(true);
  const [originalData, setOriginalData] = useState<UpdateArticleRequest | null>(
    null,
  );
  const [formData, setFormData] = useState<UpdateArticleRequest | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailChanged, setThumbnailChanged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previews, setPreviews] = useState<PreviewImage[]>([]);
  const [imagesChanged, setImagesChanged] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [name]: value };
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

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).map((file, idx) => {
      const ext = file.name.split(".").pop();
      return new File([file], `${Date.now()}-${idx}.${ext}`, {
        type: file.type,
      });
    });
    setFormData((prev) => ({
      ...prev,
      images: prev?.images ? [...prev.images, ...newFiles] : newFiles,
    }));
    setPreviews((prev) => [
      ...prev,
      ...newFiles.map((f) => ({ url: URL.createObjectURL(f), name: f.name })),
    ]);
    setImagesChanged(true);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setThumbnailFile(file);
      setThumbnailChanged(true);
      setThumbnailPreview(URL.createObjectURL(file));
    } else if (file) alert("File quá lớn. Vui lòng chọn ảnh dưới 5MB");
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailChanged(true);
    setThumbnailPreview("");
  };

  const isArrayEqual = (a: number[], b: number[]) => {
    if (!a || !b || a.length !== b.length) return false;
    return [...a].sort().every((v, i) => v === [...b].sort()[i]);
  };

  const handleSubmit = async () => {
    if (!id || !formData || !originalData || !token) return;
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      let hasChanges = false;
      const check = (key: keyof UpdateArticleRequest, val: string) => {
        if (formData[key] !== originalData[key]) {
          fd.append(key, val);
          hasChanges = true;
        }
      };
      check("title", formData.title || "");
      check("slug", formData.slug || "");
      check("content_md", formData.content_md || "");
      check("status", formData.status || "draft");
      check("description", formData.description || "");
      if (thumbnailChanged && thumbnailFile) {
        fd.append("thumbnail", thumbnailFile);
        hasChanges = true;
      }
      if (imagesChanged && formData.images?.length) {
        formData.images.forEach((f) => fd.append("images", f));
        hasChanges = true;
      }
      if (
        !isArrayEqual(
          formData.tag_ids ?? [],
          selectedTags.map((t) => t.id),
        )
      ) {
        fd.append("tags", JSON.stringify(selectedTags.map((t) => t.id)));
        hasChanges = true;
      }
      if (!hasChanges) {
        alert("Không có thay đổi nào để cập nhật");
        return;
      }
      const result = await articleAPI.updateArticle(Number(id), fd, token);
      if (result.success) {
        setThumbnailChanged(false);
        setOriginalData(formData);
        setImagesChanged(false);
        alert("Cập nhật thành công!");
      }
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (id && token && !loading) {
      const getArticle = async () => {
        try {
          const result = await articleAPI.getAdminArticleById(
            Number(id),
            token,
          );
          if (result.success) {
            const init: UpdateArticleRequest = {
              title: result.data?.title,
              slug: result.data?.slug,
              content_md: result.data?.content_md,
              status: result.data?.status,
              description: result.data?.description,
              tag_ids: result.data.tags?.map((t: Tag) => t.id) ?? [],
            };
            setSelectedTags(result.data.tags ?? []);
            setOriginalData(init);
            setFormData(init);
            setPreviews(
              (result.data?.images ?? []).map((img: any) => ({
                id: img.id,
                url: `https://easytrade.site/api/v2${img.url}`,
                name: img.name || img.alt_text || `image-${img.id}`,
              })),
            );
            if (result.data?.thumbnail)
              setThumbnailPreview(
                `https://easytrade.site/api/v2${result.data.thumbnail}`,
              );
          }
        } catch (err) {
          console.error(err);
        }
      };
      getArticle();
      const t = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(t);
    }
  }, [id, token, loading]);

  if (_loading) return <Loading />;
  if (!formData)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "80px 24px",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.1em",
          color: "var(--noir-muted)",
          textTransform: "uppercase",
        }}
      >
        Không có dữ liệu
      </div>
    );

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      {/* Sticky header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(8,8,8,0.95)",
          backdropFilter: "blur(16px)",
          borderBottom: "0.5px solid var(--noir-border)",
          marginBottom: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 56,
            padding: "0 2px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 3,
                height: 26,
                background: "var(--noir-accent)",
                borderRadius: 2,
              }}
            />
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 20,
                color: "var(--noir-white)",
                letterSpacing: "-0.01em",
                margin: 0,
              }}
            >
              Update Article
            </h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setShowPreview((p) => !p)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: showPreview ? "var(--noir-accent)" : "var(--noir-muted)",
                background: "transparent",
                border: `0.5px solid ${showPreview ? "var(--noir-accent)" : "var(--noir-border-md)"}`,
                padding: "8px 14px",
                borderRadius: 4,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {showPreview ? <EyeOff size={12} /> : <Eye size={12} />}
              {showPreview ? "Hide Preview" : "Preview"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--noir-black)",
                background: "var(--noir-accent)",
                padding: "8px 18px",
                borderRadius: 4,
                border: "none",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.6 : 1,
                transition: "opacity 0.2s",
              }}
            >
              <Save size={12} />
              {isSubmitting ? "Saving…" : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </header>

      {/* Layout: 7fr | 3fr */}
      <main
        style={{ display: "grid", gridTemplateColumns: "7fr 3fr", gap: 20 }}
      >
        {/* ── Left column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Basic info */}
          <div
            style={{
              ...S.card,
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <NoirInput
              label="Tiêu đề"
              required
              name="title"
              value={formData.title ?? ""}
              onChange={handleInputChange}
              placeholder="Nhập tiêu đề bài viết…"
            />
            <NoirInput
              label="Slug (URL)"
              name="slug"
              value={formData.slug ?? ""}
              onChange={handleInputChange}
              placeholder="slug-tu-dong-tao"
            />
            <NoirInput
              label="Description"
              required
              name="description"
              value={formData.description ?? ""}
              onChange={handleInputChange}
              placeholder="Nhập giới thiệu về bài viết"
            />
          </div>

          {/* Markdown editor */}
          <div style={S.card}>
            <label style={S.label}>
              Nội dung (Markdown)<span style={S.required}>*</span>
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
            <div
              style={{
                ...S.card,
                borderColor: "var(--noir-accent)",
                borderLeftWidth: 2,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--noir-accent)",
                  marginBottom: 16,
                }}
              >
                Live Preview
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: 24,
                  color: "var(--noir-white)",
                  margin: "0 0 6px",
                  letterSpacing: "-0.02em",
                }}
              >
                {formData.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--noir-muted)",
                  marginBottom: 16,
                  letterSpacing: "0.05em",
                }}
              >
                /{formData.slug}
              </p>
              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    borderRadius: 6,
                    marginBottom: 20,
                    border: "0.5px solid var(--noir-border)",
                  }}
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

        {/* ── Right column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Status */}
          <div style={S.card}>
            <label style={S.label}>Trạng thái</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { value: "draft", icon: <EyeOff size={14} />, label: "Nháp" },
                {
                  value: "published",
                  icon: <Eye size={14} />,
                  label: "Xuất bản",
                },
              ].map((opt) => {
                const active = formData.status === opt.value;
                return (
                  <label
                    key={opt.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 14px",
                      borderRadius: 4,
                      cursor: "pointer",
                      border: `0.5px solid ${active ? "var(--noir-accent)" : "var(--noir-border)"}`,
                      background: active
                        ? "var(--noir-accent-bg)"
                        : "transparent",
                      transition: "all 0.2s",
                    }}
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
                      style={{
                        color: active
                          ? "var(--noir-accent)"
                          : "var(--noir-muted)",
                      }}
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

          {/* Tags */}
          <div style={S.card}>
            <TagSelector
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          </div>

          {/* Thumbnail */}
          <div style={S.card}>
            <label style={S.label}>
              Thumbnail<span style={S.required}>*</span>
            </label>
            {!thumbnailPreview ? (
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  aspectRatio: "16/9",
                  border: "1px dashed var(--noir-border-md)",
                  borderRadius: 6,
                  cursor: "pointer",
                  gap: 8,
                  transition: "border-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.borderColor = "var(--noir-accent)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.borderColor = "var(--noir-border-md)")
                }
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
                <Upload size={24} style={{ color: "var(--noir-muted)" }} />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    color: "var(--noir-muted)",
                    textTransform: "uppercase",
                  }}
                >
                  Upload
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    color: "var(--noir-subtle)",
                  }}
                >
                  PNG / JPG / AVIF · Max 5MB
                </span>
              </label>
            ) : (
              <div style={{ position: "relative" }}>
                <img
                  src={thumbnailPreview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    aspectRatio: "16/9",
                    objectFit: "cover",
                    borderRadius: 6,
                    display: "block",
                  }}
                />
                <button
                  onClick={removeThumbnail}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "#ff4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: 26,
                    height: 26,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <X size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Images */}
          <div style={S.card}>
            <label style={S.label}>
              Ảnh<span style={S.required}>*</span>
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  aspectRatio: "1",
                  border: "1px dashed var(--noir-border-md)",
                  borderRadius: 6,
                  cursor: "pointer",
                  gap: 6,
                  transition: "border-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.borderColor = "var(--noir-accent)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.borderColor = "var(--noir-border-md)")
                }
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />
                <Upload size={20} style={{ color: "var(--noir-muted)" }} />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.1em",
                    color: "var(--noir-muted)",
                    textTransform: "uppercase",
                  }}
                >
                  Add
                </span>
              </label>
              {previews.map((img, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      objectFit: "cover",
                      borderRadius: 6,
                      border: "0.5px solid var(--noir-border)",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 8,
                      color: "var(--noir-muted)",
                      letterSpacing: "0.04em",
                      textAlign: "center",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      width: "100%",
                    }}
                  >
                    {img.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
