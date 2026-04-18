import MarkdownRenderer from "@/public/components/MarkdownRenderer";
import NotFound from "@/public/components/NotFound";
import CopyButton from "@/public/components/user/CopyButton";
import FacebookShareButton from "@/public/components/user/FacebookShareButton";
import { getArticleBySlug } from "@/services/articles.user.service";
import { ArrowLeft, Clock, User, Eye } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const finalSlug = Array.isArray(slug) ? slug.join("/") : slug;
  const article = await getArticleBySlug(finalSlug);

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
      canonical: `https://devstackpro.cloud/article/${article.slug}`,
    },
    openGraph: {
      title: article.title + " - Dev Stack Pro",
      description: article.description || article.title,
      type: "article",
      url: `https://devstackpro.cloud/article/${article.slug}`,
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
  const article = await getArticleBySlug(finalSlug);

  if (!article) return <NotFound />;

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
            {article.tags?.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginBottom: "16px",
                }}
              >
                {article.tags.slice(0, 3).map((tag: any, i: number) => (
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
              {article.title}
            </h1>

            {/* Meta row */}
            <div
              className="noir-article-meta-row"
              style={{ marginTop: "20px", marginBottom: "28px" }}
            >
              <span className="noir-article-meta-item">
                <User size={12} />
                {article.display_name}
              </span>
              <span className="accent-dot" />
              <span className="noir-article-meta-item">
                <Clock size={12} />
                {formatArticleTime(article.created_at ?? "")}
              </span>
            </div>

            {/* Description */}
            {article.description && (
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
                {article.description}
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
              <MarkdownRenderer content={article.content_md ?? ""} />
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
                  {article.display_name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p
                    style={{
                      color: "var(--noir-white)",
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    {article.display_name}
                  </p>
                  <p
                    style={{
                      color: "var(--noir-muted)",
                      fontSize: "12px",
                      fontFamily: "var(--font-mono)",
                      marginTop: "2px",
                    }}
                  >
                    {formatArticleTime(article.created_at ?? "")}
                  </p>
                </div>
              </div>
            </div>

            {/* All tags */}
            {article.tags?.length > 0 && (
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
                  {article.tags.map((tag: any, i: number) => (
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
