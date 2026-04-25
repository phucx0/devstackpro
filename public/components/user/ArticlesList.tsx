"use client";
import { ArticlePublish } from "@/public/lib/types";
import { useState } from "react";
import ArticleCard from "./ArticleCard";
import { useAuth } from "@/public/providers/AuthProvider";

interface Props {
  initialArticles: ArticlePublish[];
  initialPage: number;
  initialTotalPages: number;
}

export default function ArticlesList({
  initialArticles,
  initialPage,
  initialTotalPages,
}: Props) {
  const [articles, setArticles] = useState<ArticlePublish[]>(initialArticles);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);
  const { profile } = useAuth();
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
      {/* Grid */}
      {articles && articles.length > 0 ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {articles.map((article, i) => (
              <ArticleCard
                key={article.id}
                article={article}
                index={i}
                isOwner={
                  (profile && article.id === Number(profile.id)) || false
                }
              />
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
