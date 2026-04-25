"use client";
import ArticleCard from "@/public/components/user/ArticleCard";
import { ArticlePublish } from "@/public/lib/types";
import { useState } from "react";
import Link from "next/link";

interface Props {
  articles: ArticlePublish[];
  isOwner: boolean;
  username: string;
}

// ── Main Component ───────────────────────────────────────────────
export default function AuthorProfile({ username, articles, isOwner }: Props) {
  const [filter, setFilter] = useState<"latest" | "popular" | "series">(
    "latest",
  );

  return (
    <div className="w-full  bg-(--noir-black) text-(--noir-white)">
      <main className="px-4 pb-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-6">
            {(["latest", "popular", "series"] as const).map((tab) => {
              const labels = {
                latest: "Newest",
                popular: "Featured",
                series: "Series",
              };
              const active = filter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`text-[12px] font-(--font-body) pb-1 cursor-pointer transition-colors duration-150 border-b ${active ? "text-(--noir-white) border-(--noir-accent)" : "text-(--noir-muted) border-transparent"}`}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>
          {isOwner && (
            <Link
              href={`${username}/articles/new`}
              className={`text-[12px] px-4 py-[7px] rounded-md font-medium transition-colors duration-150 cursor-pointer bg-(--noir-accent) text-(--noir-black)`}
            >
              New post
            </Link>
          )}
        </div>
        {articles.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {articles.map((article, i) => (
              <ArticleCard
                key={article.id}
                article={article}
                isOwner={isOwner}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "96px 0",
              gap: "16px",
            }}
          >
            <span
              style={{
                fontSize: "56px",
                fontWeight: 300,
                color: "rgba(255,255,255,0.1)",
                fontFamily: "var(--font-display)",
              }}
            >
              ∅
            </span>
            <p style={{ fontSize: "13px", color: "var(--noir-muted)" }}>
              Chưa có bài viết nào.
            </p>
            {isOwner && (
              <Link
                href={`${username}/articles/new`}
                style={{
                  marginTop: "8px",
                  fontSize: "12px",
                  padding: "8px 18px",
                  borderRadius: "4px",
                  background: "var(--noir-accent)",
                  color: "var(--noir-black)",
                  fontFamily: "var(--font-body)",
                  border: "none",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Tạo bài viết đầu tiên
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
