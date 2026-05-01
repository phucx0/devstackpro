import ArticlesList from "@/public/components/user/ArticlesList";
import ArticlesListSkeleton from "@/public/components/user/ArticlesListSkeleton";
import { searchArticles } from "@/server/search-article/search-article.service";
import { Suspense } from "react";

export default async function SearchPage({
  params,
}: {
  params: Promise<{ q: string }>;
}) {
  const { q } = await params;
  const decodedQuery = decodeURIComponent(q);
  const articles = await searchArticles(decodedQuery);

  return (
    <div className="min-h-screen">
      <div className="flex items-center my-4 gap-3">
        <div className="noir-section-line" aria-hidden="true"></div>
        <div className="text-2xl text-white font-bold">
          <span>Found {articles.length} results for</span>{" "}
          <span className="text-(--noir-accent)">{decodedQuery}</span>
        </div>
      </div>
      <Suspense fallback={<ArticlesListSkeleton />}>
        <ArticlesSection decodedQuery={decodedQuery || ""} />
      </Suspense>
    </div>
  );
}

type Props = {
  decodedQuery: string | "";
};

export async function ArticlesSection({ decodedQuery }: Props) {
  const articles = await searchArticles(decodedQuery);
  return (
    <ArticlesList
      initialArticles={articles}
      initialPage={1}
      initialTotalPages={1}
    />
  );
}
