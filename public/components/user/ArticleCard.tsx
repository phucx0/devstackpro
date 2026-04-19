"use client";
import { UserRound } from "lucide-react";
import Image from "next/image";
import { ArticleWithTags } from "../../lib/types";
import Link from "next/link";

export default function ArticleCard({
  article,
  index = 0,
}: {
  article: ArticleWithTags;
  index?: number;
}) {
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
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  }

  // Zero-padded index for the card corner
  const num = String(index + 1).padStart(2, "0");
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_URL_IMAGE!;

  return (
    <Link href={`/articles/${article.slug}`} className="noir-card">
      {/* Thumbnail */}
      <div className="noir-card-thumb-wrap flex items-center justify-center">
        {article.thumbnail != null ? (
          <Image
            src={`${IMAGE_BASE_URL}${article.thumbnail}`}
            alt={article.title ?? ""}
            fill
            priority={index < 3}
            className="noir-card-thumb"
            placeholder="blur"
            blurDataURL="/images/og-image.png"
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
          />
        ) : (
          <img src="/svg/logo.svg" alt="logo svg" />
        )}
        {/* Ghost number on thumb */}
        <span className="noir-card-thumb-num" aria-hidden="true">
          {num}
        </span>
      </div>

      {/* Body */}
      <div className="noir-card-body">
        <div>
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
                marginBottom: "4px",
              }}
            >
              {article.tags.slice(0, 2).map((tag) => (
                <span key={tag.id} className="noir-tag">
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <h2 className="noir-card-title">{article.title}</h2>
          <p className="noir-card-desc">{article.description}</p>
        </div>

        <div className="noir-card-footer">
          <div className="noir-card-author">
            <div className="noir-card-author-dot">
              <UserRound size={10} />
            </div>
            <span>{article.display_name}</span>
          </div>
          <span className="noir-card-author">
            {formatArticleTime(article.created_at ?? "")}
          </span>
        </div>
      </div>
    </Link>
  );
}
