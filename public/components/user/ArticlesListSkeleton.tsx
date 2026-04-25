import ArticleCardSkeleton from "./ArticleCardSkeleton";

export default function ArticlesListSkeleton() {
  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between my-4">
        <div className="noir-section-bar-left">
          <div className="noir-section-line" />
          <div className="h-3 w-28 bg-white/10 animate-pulse rounded" />
        </div>
        <div className="h-3 w-16 bg-white/10 animate-pulse rounded" />
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}