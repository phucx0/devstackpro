"use client";
import { useState } from "react";
import { Upload, X, Eye, EyeOff, Save, Sparkles, Loader2 } from "lucide-react";
import { useUser } from "@/public/providers/UserProvider";
import { CreateArticleRequest, Tag } from "@/public/lib/types";
import { redirect } from "next/navigation";
import MarkdownRenderer from "@/public/components/MarkdownRenderer";
import TagSelector from "@/public/components/admin/TagSelector";
import MarkdownTextarea from "@/public/components/MarkdownTextarea";
import ImageUpload from "@/public/components/admin/ImageUpload";
import { createArticleAction } from "@/services/author.actions";

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
  input: {
    width: "100%",
    background: "var(--noir-card)",
    border: "0.5px solid var(--noir-border)",
    borderRadius: 6,
    color: "var(--noir-white)",
    fontFamily: "var(--font-body)",
    fontSize: 14,
    padding: "11px 14px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box" as const,
  } as React.CSSProperties,
  required: {
    color: "var(--noir-accent)",
    marginLeft: 3,
  } as React.CSSProperties,
};

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
    <div style={{ marginBottom: 0 }}>
      <label style={S.label}>
        {label}
        {required && <span style={S.required}>*</span>}
      </label>
      <input
        {...props}
        style={{
          ...S.input,
          borderColor: focused ? "var(--noir-accent)" : "var(--noir-border)",
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
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
  const [focused, setFocused] = useState(false);

  if (!open) return null;

  const examplePrompts = [
    "Viết bài về xu hướng AI trong năm 2025",
    "Bài viết về cách tối ưu hiệu suất Next.js",
    "Phân tích thị trường công nghệ Việt Nam Q1 2025",
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "var(--noir-surface)",
          border: "0.5px solid var(--noir-border)",
          borderRadius: 10,
          padding: "28px",
          width: "100%",
          maxWidth: 520,
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Modal header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--noir-accent-bg)",
              border: "0.5px solid var(--noir-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles size={16} style={{ color: "var(--noir-accent)" }} />
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 16,
                color: "var(--noir-white)",
                letterSpacing: "-0.01em",
              }}
            >
              AI Generate
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "var(--noir-muted)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Powered by Grok
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              marginLeft: "auto",
              background: "transparent",
              border: "none",
              color: "var(--noir-muted)",
              cursor: "pointer",
              padding: 4,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Prompt textarea */}
        <div style={{ marginBottom: 14 }}>
          <label style={S.label}>Mô tả bài viết bạn muốn tạo</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="VD: Hãy tạo 1 bài viết đầy đủ về xu hướng AI năm 2025, gồm tiêu đề, tóm tắt, nội dung chi tiết dạng Markdown..."
            rows={4}
            style={{
              ...S.input,
              resize: "vertical",
              lineHeight: 1.6,
              borderColor: focused
                ? "var(--noir-accent)"
                : "var(--noir-border)",
            }}
          />
        </div>

        {/* Example prompts */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...S.label, marginBottom: 6 }}>Gợi ý nhanh</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {examplePrompts.map((ex) => (
              <button
                key={ex}
                onClick={() => setPrompt(ex)}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.06em",
                  color: "var(--noir-muted)",
                  background: "var(--noir-card)",
                  border: "0.5px solid var(--noir-border)",
                  borderRadius: 4,
                  padding: "5px 10px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "var(--noir-accent)";
                  e.currentTarget.style.color = "var(--noir-accent)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "var(--noir-border)";
                  e.currentTarget.style.color = "var(--noir-muted)";
                }}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--noir-muted)",
              background: "transparent",
              border: "0.5px solid var(--noir-border)",
              padding: "8px 16px",
              borderRadius: 4,
              cursor: "pointer",
            }}
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
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--noir-black)",
              background: prompt.trim()
                ? "var(--noir-accent)"
                : "var(--noir-border)",
              padding: "8px 18px",
              borderRadius: 4,
              border: "none",
              cursor: prompt.trim() ? "pointer" : "not-allowed",
              transition: "background 0.2s",
            }}
          >
            <Sparkles size={11} />
            Tạo bài viết
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CreateArticle() {
  const { token } = useUser();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [showAIModal, setShowAIModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<CreateArticleRequest>({
    title: "",
    slug: "",
    description: "",
    content_md: "",
    thumbnail: "",
    status: "draft",
    tags: [],
  });

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

  // const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setFormData((prev) => ({ ...prev, thumbnail: file }));
  //     setThumbnailPreview(URL.createObjectURL(file));
  //   }
  // };

  // const removeThumbnail = () => {
  //   setFormData((prev) => ({ ...prev, thumbnail: null }));
  //   setThumbnailPreview("");
  // };

  /* ─── Grok AI Generation (via server-side API route) ─── */
  const handleAIGenerate = async (userPrompt: string) => {
    if (!userPrompt.trim()) {
      alert("Vui lòng nhập chủ đề bài viết");
      return;
    }

    setIsGenerating(true);
    setFormData((prev) => ({ ...prev, content_md: "" })); // reset nội dung cũ

    try {
      const response = await fetch("/api/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Không thể tạo bài viết");
      }

      // Đọc metadata từ header
      const metaHeader = response.headers.get("X-Blog-Meta");
      let meta: any = null;
      if (metaHeader) {
        try {
          meta = JSON.parse(metaHeader);
        } catch (e) {
          console.warn("Không parse được meta header");
        }
      }

      // Đọc stream nội dung (content_md)
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let content = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          content += chunk;

          // Cập nhật realtime (tùy chọn - cho UX tốt hơn)
          setFormData((prev) => ({ ...prev, content_md: content }));
        }
      }

      // Sau khi stream xong, cập nhật đầy đủ form
      if (meta) {
        setFormData((prev) => ({
          ...prev,
          title: meta.title ?? prev.title,
          slug: toSlug(meta.title ?? prev.title),
          description: meta.description ?? prev.description,
          content_md: content, // nội dung từ stream
          // thumbnail: meta.thumbnail ?? prev.thumbnail,   // nếu sau này có
        }));
      } else {
        // fallback nếu không có meta
        setFormData((prev) => ({
          ...prev,
          content_md: content,
        }));
      }

      console.log("Generate thành công - Title:", meta?.title);
    } catch (err: any) {
      console.error("AI Generate error:", err);
      alert(err.message || "Có lỗi khi tạo bài viết. Vui lòng thử lại.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    formData.tags = selectedTags.map((t) => t.id);
    if (!formData.title) return alert("Thiếu title");
    if (!formData.description) return alert("Thiếu giới thiệu");
    if (!formData.slug) return alert("Thiếu slug");
    if (!formData.content_md) return alert("Thiếu nội dung");
    if (!token) redirect("/auth/sign-in");
    setFormData((prev) => ({ ...prev, images }));
    setIsSubmitting(true);
    try {
      const result = await createArticleAction(formData);
      // const result = await articleAPI.createArticle(formData, token);
      if (result) {
        alert("Tạo bài viết thành công");
        redirect(`/admin/articles/${result.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ─── Render ─── */
  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      {/* AI Generate Modal */}
      <AIGenerateModal
        open={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerate={handleAIGenerate}
      />

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
              Create Article
            </h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {/* AI Generate button */}
            <button
              onClick={() => setShowAIModal(true)}
              disabled={isGenerating}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: isGenerating
                  ? "var(--noir-muted)"
                  : "var(--noir-accent)",
                background: "var(--noir-accent-bg)",
                border: "0.5px solid var(--noir-accent)",
                padding: "8px 14px",
                borderRadius: 4,
                cursor: isGenerating ? "not-allowed" : "pointer",
                opacity: isGenerating ? 0.7 : 1,
                transition: "all 0.2s",
              }}
            >
              {isGenerating ? (
                <Loader2
                  size={12}
                  style={{ animation: "spin 1s linear infinite" }}
                />
              ) : (
                <Sparkles size={12} />
              )}
              {isGenerating ? "Đang tạo…" : "AI Generate"}
            </button>

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
              {isSubmitting ? "Publishing…" : "Đăng bài"}
            </button>
          </div>
        </div>
      </header>

      {/* Spinning keyframe for loader */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Layout: 7fr | 3fr */}
      <main
        style={{ display: "grid", gridTemplateColumns: "7fr 3fr", gap: 20 }}
      >
        {/* ── Left column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* AI generating overlay hint */}
          {isGenerating && (
            <div
              style={{
                ...S.card,
                borderColor: "var(--noir-accent)",
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "var(--noir-accent-bg)",
              }}
            >
              <Loader2
                size={16}
                style={{
                  color: "var(--noir-accent)",
                  animation: "spin 1s linear infinite",
                  flexShrink: 0,
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    color: "var(--noir-accent)",
                    textTransform: "uppercase",
                  }}
                >
                  Grok đang tạo bài viết…
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    color: "var(--noir-muted)",
                    marginTop: 2,
                  }}
                >
                  Vui lòng chờ, nội dung sẽ tự động điền vào các trường bên dưới
                </div>
              </div>
            </div>
          )}

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
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Nhập tiêu đề bài viết…"
            />
            <NoirInput
              label="Slug (URL)"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="slug-tu-dong-tao"
            />
            <NoirInput
              label="Description"
              required
              name="description"
              value={formData.description}
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

          {/* Thumbnail + Images */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
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
                    (e.currentTarget.style.borderColor =
                      "var(--noir-border-md)")
                  }
                >
                  <input
                    type="file"
                    accept="image/*"
                    // onChange={handleThumbnailChange}
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
                <div style={{ position: "relative" }} className="group">
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
                    // onClick={removeThumbnail}
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
              <ImageUpload images={images} setImages={setImages} />
            </div>
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
                      border: `0.5px solid ${active ? "var(--noir-accent)" : "var(--noir-border)"}`,
                      background: active
                        ? "var(--noir-accent-bg)"
                        : "transparent",
                      cursor: "pointer",
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
        </div>
      </main>
    </div>
  );
}
