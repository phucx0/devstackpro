import ArticleCardSkeleton from "@/public/components/user/ArticleCardSkeleton";

export default function RootLoading() {
  return (
    <div className="w-full flex">
      <div className="mx-auto w-full max-w-3xl">
        {Array.from({ length: 8 }).map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
      <RightSidebarSkeleton />
    </div>
  );
}

export function RightSidebarSkeleton() {
  return (
    <aside className="w-70 shrink-0 sticky top-(--header-h) self-start flex flex-col gap-6 p-7 h-[calc(100vh-var(--header-h))] border-l border-(--noir-border)">
      {/* You might like */}
      <section className="space-y-4">
        <div className="h-3.5 w-24 bg-white/10 animate-pulse rounded" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-2.5">
              {/* Avatar */}
              <div className="w-[34px] h-[34px] rounded-full bg-white/10 animate-pulse shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                {/* Name */}
                <div className="h-3 w-24 bg-white/10 animate-pulse rounded" />
                {/* Bio */}
                <div className="h-3 w-full bg-white/10 animate-pulse rounded" />
                {/* Button */}
                <div className="h-6 w-14 bg-white/10 animate-pulse rounded mt-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-white/10" />

      {/* What's happening */}
      <section className="space-y-4">
        <div className="h-3.5 w-32 bg-white/10 animate-pulse rounded" />
        <div className="space-y-4">
          {[80, 60, 70, 90, 75].map((w, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div
                className="h-3 bg-white/10 animate-pulse rounded"
                style={{ width: `${w}%` }}
              />
              <div className="h-2.5 w-16 bg-white/10 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
