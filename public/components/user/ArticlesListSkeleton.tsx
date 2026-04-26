import ArticleCardSkeleton from "./ArticleCardSkeleton";

export default function ArticlesListSkeleton() {
  return (
    <div className="mx-auto w-[70%] flex flex-col gap-4">
      {/* grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 */}
      {Array.from({ length: 8 }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}
