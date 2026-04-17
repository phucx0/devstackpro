"use client";
import { ArticleWithTags } from "@/public/lib/types";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Ticker topics shown in the accent bar
const TICKER_ITEMS = [
  "AI & Machine Learning",
  "Frontend Development",
  "Backend Systems",
  "DevOps & Cloud",
  "TypeScript",
  "React & Next.js",
  "System Design",
  "Open Source",
];

export default function Featured({
  articles,
}: {
  articles: ArticleWithTags[];
}) {
  if (!articles || articles.length < 3) return null;

  const [main, second, third] = articles;

  const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(new Date(dateStr));

  return (
    <>
      {/* Featured Grid */}
      <section className="noir-featured-wrap">
        <div className="noir-featured-grid">
          {/* Main Featured Article */}
          <Link
            href={`/articles/${main.slug}`}
            className="noir-featured-main"
            style={{ textDecoration: "none" }}
          >
            <div className="noir-featured-main-img">
              <Image
                src={
                  main.thumbnail
                    ? `https://easytrade.site/api/v2/${main.thumbnail}`
                    : "/svg/logo.svg"
                }
                alt={main.title}
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 900px) 100vw, 65vw"
                className="object-contain p-8"
                onError={(e) => {
                  // Phòng trường hợp URL thumbnail bị lỗi 404
                  e.currentTarget.src = "/svg/logo.svg";
                  e.currentTarget.className = "object-contain p-8";
                }}
              />
            </div>
            {/* Ghost number */}
            <span className="noir-featured-main-num" aria-hidden="true">
              01
            </span>

            <div className="noir-featured-main-content">
              <span className="category-label">
                {main.tags?.[0]?.name ?? "Featured"} · Featured
              </span>
              <h2 className="noir-featured-main-title">{main.title}</h2>
              <p className="noir-featured-main-desc">{main.description}</p>
              <div className="noir-featured-main-footer">
                <span className="noir-read-btn">
                  Read Article <ArrowRight size={12} />
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "rgba(244,244,240,0.3)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {formatDate(main.created_at ?? "")}
                </span>
              </div>
            </div>
          </Link>

          {/* Stack — 2 secondary featured */}
          <div className="noir-featured-stack">
            {[second, third].map((article, i) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="noir-featured-item"
                style={{ textDecoration: "none" }}
              >
                <div className="noir-featured-main-img">
                  <Image
                    src={
                      article.thumbnail
                        ? `https://easytrade.site/api/v2/${article.thumbnail}`
                        : "/svg/logo.svg"
                    }
                    alt={article.title}
                    fill
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 900px) 100vw, 65vw"
                    className="object-contain p-8"
                    onError={(e) => {
                      // Phòng trường hợp URL thumbnail bị lỗi 404
                      e.currentTarget.src = "/svg/logo.svg";
                      e.currentTarget.className = "object-contain p-8";
                    }}
                  />
                </div>

                {/* Ghost number */}
                <span className="noir-featured-item-num" aria-hidden="true">
                  0{i + 2}
                </span>

                <div className="noir-featured-item-content">
                  <span className="category-label">
                    {article.tags?.[0]?.name ?? "Article"}
                  </span>
                  <h3 className="noir-featured-item-title">{article.title}</h3>
                  <div className="noir-featured-item-meta">
                    <span className="noir-tag">
                      {formatDate(article.created_at ?? "")}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ticker Bar */}
      <div className="noir-ticker" aria-hidden="true">
        <span className="noir-ticker-label">Trending</span>
        <div style={{ overflow: "hidden", flex: 1 }}>
          <div className="noir-ticker-track">
            {/* Duplicated for seamless loop */}
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="noir-ticker-item">
                {item}
                <span className="noir-ticker-sep">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
