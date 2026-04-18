import ArticleCard from "@/public/components/user/ArticleCard";
import { getArticles } from "@/services/articles.user.service";

export default async ({ params }: { params: Promise<{ q: string }> }) => {
  const { q } = await params;
  const decodedQuery = decodeURIComponent(q);
  const articles = await getArticles(decodedQuery);

  return (
    <div className="min-h-screen">
      <div className="flex items-center my-4 gap-3">
        <div className="noir-section-line" aria-hidden="true"></div>
        <div className="text-2xl text-white font-bold">
          Found {articles.length} results for "{decodedQuery}"
        </div>
      </div>
      {articles && articles?.length > 0 ? (
        <div className="noir-articles-grid">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center text-neutral-300/80 py-10">
          No articles found.
        </div>
      )}
    </div>
  );
};
