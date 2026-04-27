import ArticleCardSkeleton from "./ArticleCardSkeleton";

export default function ArticlesListSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      {Array.from({ length: 8 }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}
