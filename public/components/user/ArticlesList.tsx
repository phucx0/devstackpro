"use client";
import { ArticleWithTags } from "@/public/lib/types";
import { useState } from "react";
import ArticleCard from "./ArticleCard";

interface Props {
  initialArticles: ArticleWithTags[];
  initialPage: number;
  initialTotalPages: number;
}

export default function ArticlesList({
  initialArticles,
  initialPage,
  initialTotalPages,
}: Props) {
  const [articles, setArticles] = useState<ArticleWithTags[]>(initialArticles);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);

  const limit = 10;

  const handleShowMore = async () => {
    // if (loading) return;
    // setLoading(true);
    // const newPage = page + 1;
    // setPage(newPage);
    // const result = await getArticles();
    // if (result) {
    //   setArticles((prev) => [...prev, ...result]);
    // }
    // setLoading(false);
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between my-4">
        <div className="noir-section-bar-left">
          <div className="noir-section-line" aria-hidden="true" />
          <span className="noir-section-title">Latest Articles</span>
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--noir-muted)",
            letterSpacing: "0.06em",
          }}
        >
          {articles.length} articles
        </span>
      </div>

      {/* Grid */}
      {articles && articles.length > 0 ? (
        <>
          <div className="noir-articles-grid">
            {articles.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </div>

          {/* Show More */}
          {page !== totalPages && (
            <div className="noir-show-more">
              <button
                className="noir-show-more-btn"
                onClick={handleShowMore}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More Articles"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="noir-empty">
          <div className="noir-empty-num" aria-hidden="true">
            ∅
          </div>
          <p className="noir-empty-text">No articles found.</p>
        </div>
      )}
    </div>
  );
}
