"use client";
import Loading from "@/public/components/Loading";
import MarkdownRenderer from "@/public/components/MarkdownRenderer";
import { articleAPI } from "@/public/lib/api";
import { ArticleWithTags } from "@/public/lib/types";
import { useUser } from "@/public/providers/UserProvider";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Eye, Clock, Tag } from "lucide-react";

export default function ArticleDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<ArticleWithTags>();
  const { token, loading } = useUser();
  const [thumbnailPreview, setThumbnailPreview] = useState<string>();
  const [_loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && token && !loading) {
      const getArticle = async () => {
        try {
          const result = await articleAPI.getAdminArticleById(
            Number(id),
            token,
          );
          if (result.success) {
            setArticle(result.data);
            if (result.data?.thumbnail) {
              setThumbnailPreview(
                `https://easytrade.site/api/v2${result.data?.thumbnail}`,
              );
            }
          }
        } catch (err) {
          console.error("Lỗi khi lấy dữ liệu:", err);
        }
      };
      getArticle();
      const load = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(load);
    }
  }, [id, token, loading]);

  if (_loading) return <Loading />;

  return (
    <div
      style={{
        maxWidth: 820,
        margin: "0 auto",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Back button */}
      <button
        onClick={() => router.back()}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 28,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--noir-muted)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
          transition: "color 0.2s",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.color = "var(--noir-accent)")
        }
        onMouseOut={(e) => (e.currentTarget.style.color = "var(--noir-muted)")}
      >
        <ArrowLeft size={14} /> Back
      </button>

      {/* Article card */}
      <div
        style={{
          border: "0.5px solid var(--noir-border)",
          borderRadius: 6,
          overflow: "hidden",
          background: "var(--noir-surface)",
        }}
      >
        {/* Thumbnail */}
        {thumbnailPreview && (
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16/7",
              overflow: "hidden",
            }}
          >
            <img
              src={thumbnailPreview}
              alt="Thumbnail"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.4) saturate(0.6)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, var(--noir-surface) 0%, transparent 60%)",
              }}
            />
          </div>
        )}

        {/* Header */}
        <div
          style={{
            padding: "32px 36px 24px",
            borderBottom: "0.5px solid var(--noir-border)",
          }}
        >
          {/* Tags */}
          {article?.tags && article.tags.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 14,
              }}
            >
              {article.tags.map((tag) => (
                <span key={tag.id} className="noir-tag">
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(22px, 3.5vw, 34px)",
              color: "var(--noir-white)",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              margin: "0 0 14px",
            }}
          >
            {article?.title}
          </h1>

          {article?.description && (
            <p
              style={{
                fontSize: 14,
                color: "var(--noir-muted)",
                lineHeight: 1.7,
                margin: "0 0 20px",
                maxWidth: 600,
              }}
            >
              {article.description}
            </p>
          )}

          {/* Meta row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--noir-muted)",
                letterSpacing: "0.06em",
              }}
            >
              /{article?.slug}
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--noir-muted)",
                letterSpacing: "0.06em",
              }}
            >
              <Eye size={11} /> {article?.views ?? 0} views
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--noir-muted)",
                letterSpacing: "0.06em",
              }}
            >
              <Clock size={11} /> {article?.display_name}
            </span>
            {/* Status pill */}
            {article?.status && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color:
                    article.status === "published"
                      ? "var(--noir-accent)"
                      : "var(--noir-muted)",
                  background:
                    article.status === "published"
                      ? "var(--noir-accent-bg)"
                      : "rgba(116,116,112,0.1)",
                  border: `0.5px solid ${article.status === "published" ? "rgba(232,255,0,0.25)" : "var(--noir-border)"}`,
                  borderRadius: 3,
                  padding: "3px 10px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background:
                      article.status === "published"
                        ? "var(--noir-accent)"
                        : "var(--noir-muted)",
                    display: "inline-block",
                  }}
                />
                {article.status}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "36px" }}>
          {article?.content_md ? (
            <div className="noir-markdown">
              <MarkdownRenderer content={article.content_md} />
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--noir-muted)",
                letterSpacing: "0.1em",
              }}
            >
              NO CONTENT
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
