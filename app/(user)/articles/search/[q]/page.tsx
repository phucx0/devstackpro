import ArticleCard from "@/public/components/user/ArticleCard";
import { getArticles } from "@/services/articles.service";

export default async ({ params }: { params: Promise<{ q: string }> }) => {
  const { q } = await params;
  const articles = await getArticles(q);

  return (
    <div className="min-h-screen">
      <div className="text-2xl text-white font-bold mb-4">
        Found {articles.length} results for "{q}"
      </div>
      {articles && articles?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
