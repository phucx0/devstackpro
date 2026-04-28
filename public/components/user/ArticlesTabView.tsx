"use client";
import { ArticlePublish } from "@/public/lib/types";
import { useState } from "react";
import ArticlesList from "./ArticlesList";

type Tab = "published" | "draft";

type Props = {
  articles: ArticlePublish[];
  drafts: ArticlePublish[];
  isOwner: boolean;
  username: string;
};

export default function ArticlesTabView({
  articles,
  drafts,
  isOwner,
  username,
}: Props) {
  const [tab, setTab] = useState<Tab>("published");

  if (!isOwner) {
    // Visitor chỉ thấy feed bình thường, không có tab
    return (
      <ArticlesList
        initialArticles={articles}
        initialPage={1}
        initialTotalPages={1}
      />
    );
  }

  return (
    <>
      {/* Tab bar */}
      <div className="flex border-b border-white/[0.08] mb-0">
        {[
          { key: "published", label: "Published", count: articles.length },
          { key: "draft", label: "Drafts", count: drafts.length },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setTab(key as Tab)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-[13px] -mb-px border-b-2 transition-colors
              ${
                tab === key
                  ? "border-(--noir-accent) text-(--noir-white)"
                  : "border-transparent text-(--noir-muted) hover:text-white/60"
              }`}
          >
            {label}
            <span
              className={`text-[11px] px-1.5 py-px rounded-full transition-colors
              ${
                tab === key
                  ? "bg-(--noir-accent)/12 text-(--noir-accent)"
                  : "bg-white/[0.07] text-(--noir-muted)"
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Feed — key={tab} để ArticlesList reset scroll/state khi đổi tab */}
      <ArticlesList
        key={tab}
        initialArticles={tab === "published" ? articles : drafts}
        initialPage={1}
        initialTotalPages={1}
      />
    </>
  );
}
