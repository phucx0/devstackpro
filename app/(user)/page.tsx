import ArticleCard from "@/public/components/ArticleCard";
import { articleAPI } from "@/public/lib/api";
import { ArticleWithTags } from "@/public/lib/types";
import Image from "next/image";

async function fetchArticles() {
  const data = await articleAPI.getArticles({
    page: 1,
    limit: 10,
    status: 'published'
  });
  if (data.success) {
    return data.data;
  }
  return [];
}

export default async  function Home() {
  const articles: ArticleWithTags[] = await fetchArticles();
  return (
    <div>
      
      {/* <br /> */}
      <div className="box-border">
        <div className=" bg-white p-2 md:p-4">
          <div className="text-lg pb-2 border-b border-b-neutral-400">Latest Articles</div> 
          <div className="flex flex-col gap-4 md:gap-4 mt-4">
            {articles && articles?.length > 0 ? (
              articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            ) : (
              <div className="text-center text-neutral-500 py-10">
                No articles found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
