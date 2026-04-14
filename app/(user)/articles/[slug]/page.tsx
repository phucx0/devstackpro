import MarkdownRenderer from "@/public/components/MarkdownRenderer";
import NotFound from "@/public/components/NotFound";
import CopyButton from "@/public/components/user/CopyButton";
import FacebookShareButton from "@/public/components/user/FacebookShareButton";
import { articleAPI } from "@/public/lib/api";
import { ArrowLeft, Clock, User, Tag, Eye } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getArticle(slug: string) {
  if (!slug) return null;
  try {
    const result = await articleAPI.getArticleBySlug(slug);
    if (result.success) return result.data;
    return null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const finalSlug = Array.isArray(slug) ? slug.join("/") : slug;
  const article = await getArticle(finalSlug);

  if (!article) {
    return { title: "Bài viết không tồn tại" };
  }

  return {
    title: article.title + " - Dev Stack Pro",
    description:
      article.description ||
      article.title ||
      "Master modern web and mobile development with expert guides on CSS, Flutter, Next.js, and UI design principles",
    alternates: {
      canonical: `https://devstackpro.cloud/articles/${article.slug}`,
    },
    openGraph: {
      title: article.title + " - Dev Stack Pro",
      description: article.description || article.title,
      type: "article",
      url: `https://devstackpro.cloud/articles/${article.slug}`,
      images: [
        {
          url: `https://easytrade.site/api/v2${article.thumbnail}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title + " - Dev Stack Pro",
      description: article.description || article.title,
      images: [`https://easytrade.site/api/v2${article.thumbnail}`],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string | string[] };
}) {
  const { slug } = await params;
  const finalSlug = Array.isArray(slug) ? slug.join("/") : slug;
  const _article = await getArticle(finalSlug);

  if (!_article) return <NotFound />;

  function formatArticleTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
      if (diffMinutes < 1) return "Just now";
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      return `${diffHours}h ago`;
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      timeZone: "UTC",
    }).format(date);
  }

  const thumbnailUrl = _article.thumbnail
    ? `https://easytrade.site/api/v2/${_article.thumbnail}`
    : null;

  return (
    <div className="noir-main">
      {/* ── Back nav ── */}
      <div className="noir-container" style={{ paddingTop: "24px" }}>
        <Link
          href="/"
          className="noir-read-btn-ghost"
          style={{ display: "inline-flex", width: "fit-content" }}
        >
          <ArrowLeft size={13} />
          Back to Home
        </Link>
      </div>

      {/* ── Hero image (contained, not full-bleed) ── */}
      {thumbnailUrl && (
        <div className="noir-container" style={{ paddingTop: "28px" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              maxHeight: "420px",
              aspectRatio: "16/7",
              borderRadius: "8px",
              overflow: "hidden",
              border: "0.5px solid var(--noir-border)",
            }}
          >
            <Image
              src={thumbnailUrl}
              alt={_article.title}
              fill
              priority
              fetchPriority="high"
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1000px"
              style={{ filter: "brightness(0.9) saturate(0.95)" }}
            />
            {/* subtle gradient overlay at bottom */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(8,8,8,0.55) 0%, transparent 55%)",
              }}
            />
          </div>
        </div>
      )}

      {/* ── Article layout ── */}
      <div
        className="noir-container"
        style={{ paddingTop: "40px", paddingBottom: "80px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 280px",
            gap: "48px",
            alignItems: "start",
          }}
        >
          {/* ── Main content ── */}
          <article>
            {/* Category / tags top */}
            {_article.tags?.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginBottom: "16px",
                }}
              >
                {_article.tags.slice(0, 3).map((tag: any, i: number) => (
                  <Link
                    key={i}
                    href={`/articles/search/${tag.name}`}
                    className="noir-tag"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h1
              className="noir-article-title"
              style={{ position: "static", padding: 0, maxWidth: "none" }}
            >
              {_article.title}
            </h1>

            {/* Meta row */}
            <div
              className="noir-article-meta-row"
              style={{ marginTop: "20px", marginBottom: "28px" }}
            >
              <span className="noir-article-meta-item">
                <User size={12} />
                {_article.display_name}
              </span>
              <span className="accent-dot" />
              <span className="noir-article-meta-item">
                <Clock size={12} />
                {formatArticleTime(_article.created_at)}
              </span>
            </div>

            {/* Description */}
            {_article.description && (
              <p
                style={{
                  fontSize: "16px",
                  color: "var(--noir-muted)",
                  lineHeight: "1.75",
                  borderLeft: "2px solid var(--noir-accent)",
                  paddingLeft: "16px",
                  marginBottom: "32px",
                  fontStyle: "italic",
                }}
              >
                {_article.description}
              </p>
            )}

            {/* Divider */}
            <div
              style={{
                height: "0.5px",
                background: "var(--noir-border)",
                marginBottom: "36px",
              }}
            />

            {/* Markdown content */}
            <div className="noir-markdown">
              <MarkdownRenderer content={_article.content_md} />
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside
            style={{
              position: "sticky",
              top: "calc(var(--header-h) + 24px)",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
            className="sidebar-hide-mobile"
          >
            {/* Author card */}
            <div
              style={{
                background: "var(--noir-surface)",
                border: "0.5px solid var(--noir-border)",
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <p className="category-label" style={{ marginBottom: "14px" }}>
                Author
              </p>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  className="noir-card-author-dot"
                  style={{
                    width: "36px",
                    height: "36px",
                    fontSize: "14px",
                    flexShrink: 0,
                  }}
                >
                  {_article.display_name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p
                    style={{
                      color: "var(--noir-white)",
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    {_article.display_name}
                  </p>
                  <p
                    style={{
                      color: "var(--noir-muted)",
                      fontSize: "12px",
                      fontFamily: "var(--font-mono)",
                      marginTop: "2px",
                    }}
                  >
                    {formatArticleTime(_article.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* All tags */}
            {_article.tags?.length > 0 && (
              <div
                style={{
                  background: "var(--noir-surface)",
                  border: "0.5px solid var(--noir-border)",
                  borderRadius: "8px",
                  padding: "20px",
                }}
              >
                <p className="category-label" style={{ marginBottom: "14px" }}>
                  Topics
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {_article.tags.map((tag: any, i: number) => (
                    <Link
                      key={i}
                      href={`/articles/search/${tag.name}`}
                      className="noir-tag"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Share card */}
            <div
              style={{
                background: "var(--noir-surface)",
                border: "0.5px solid var(--noir-border)",
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <p className="category-label" style={{ marginBottom: "14px" }}>
                Share Article
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <FacebookShareButton slug={finalSlug} />
                <CopyButton />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Responsive: hide sidebar on mobile ── */}
      <style>{`
            @media (max-width: 900px) {
                .sidebar-hide-mobile { display: none !important; }
                article { grid-column: 1 / -1 !important; }
                .noir-container > div[style*="grid"] {
                    display: block !important;
                }
            }
        `}</style>
    </div>
  );
}
