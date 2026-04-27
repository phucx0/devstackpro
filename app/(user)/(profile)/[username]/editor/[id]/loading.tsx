// UpdateArticleSkeleton.tsx
export default function loading() {
  return (
    <div className="px-4 w-full">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/95 border-b border-(--noir-border) mb-7">
        <div className="flex items-center justify-between h-14 px-1">
          <div className="flex items-center gap-3">
            <div className="w-[3px] h-[26px] bg-(--noir-accent) rounded" />
            <div className="h-5 w-36 bg-white/10 animate-pulse rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-24 bg-white/10 animate-pulse rounded" />
            <div className="h-8 w-16 bg-white/10 animate-pulse rounded" />
          </div>
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-5">
        {/* Left */}
        <div className="flex flex-col gap-4">
          {/* Fields */}
          <div className="p-6 rounded-sm border border-(--noir-border) bg-(--noir-surface) flex flex-col gap-5">
            {["Title", "Slug", "Description"].map((field) => (
              <div key={field}>
                <div className="h-2.5 w-16 bg-white/10 animate-pulse rounded mb-2" />
                <div className="h-9 w-full bg-white/10 animate-pulse rounded-md" />
              </div>
            ))}
          </div>

          {/* Content editor */}
          <div className="p-6 rounded-sm border border-(--noir-border) bg-(--noir-surface)">
            <div className="h-2.5 w-16 bg-white/10 animate-pulse rounded mb-3" />
            <div className="h-64 w-full bg-white/10 animate-pulse rounded" />
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4">
          {/* Status */}
          <div className="p-6 rounded-sm border border-(--noir-border) bg-(--noir-surface)">
            <div className="h-2.5 w-12 bg-white/10 animate-pulse rounded mb-3" />
            <div className="flex flex-col gap-2">
              <div className="h-10 w-full bg-white/10 animate-pulse rounded-sm" />
              <div className="h-10 w-full bg-white/10 animate-pulse rounded-sm" />
            </div>
          </div>

          {/* Tags */}
          <div className="p-6 rounded-sm border border-(--noir-border) bg-(--noir-surface)">
            <div className="h-2.5 w-8 bg-white/10 animate-pulse rounded mb-3" />
            <div className="h-9 w-full bg-white/10 animate-pulse rounded" />
          </div>

          {/* Thumbnail */}
          <div className="p-6 rounded-sm border border-(--noir-border) bg-(--noir-surface)">
            <div className="h-2.5 w-20 bg-white/10 animate-pulse rounded mb-3" />
            <div className="h-40 w-full bg-white/10 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
