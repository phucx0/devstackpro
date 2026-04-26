import ArticleCardSkeleton from "@/public/components/user/ArticleCardSkeleton";

export default function AuthorProfileSkeleton() {
  return (
    <div className="w-full bg-(--noir-black) text-(--noir-white)">
      <main className="px-4 pb-8">
        {/* Tabs + button */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-6">
            {[80, 64, 48].map((w) => (
              <div
                key={w}
                className={`h-3 w-${w} bg-white/10 animate-pulse rounded`}
              />
            ))}
          </div>
          <div className="h-7 w-20 bg-white/10 animate-pulse rounded-md" />
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
