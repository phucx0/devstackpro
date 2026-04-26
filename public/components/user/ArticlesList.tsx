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

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Grid */}
      {articles && articles.length > 0 ? (
        articles.map((article, i) => (
          <ArticleCard
            key={article.id}
            article={article}
            index={i}
            isOwner={(profile && article.user_id === profile.id) || false}
          />
        ))
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
