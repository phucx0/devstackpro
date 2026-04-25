export default function ArticleCardSkeleton() {
  return (
    <div className="overflow-hidden bg-(--noir-card) border border-(--noir-border)">
      {/* Thumbnail */}
      <div className="w-full aspect-video bg-white/10 animate-pulse" />

      {/* Body */}
      <div className="px-[18px] pt-4 pb-3.5">
        {/* Title */}
        <div className="h-4 w-3/4 bg-white/10 animate-pulse rounded mb-2" />

        {/* Description */}
        <div className="flex flex-col gap-1.5 mb-3.5">
          <div className="h-3 w-full bg-white/10 animate-pulse rounded" />
          <div className="h-3 w-4/5 bg-white/10 animate-pulse rounded" />
        </div>

        {/* Divider */}
        <div className="h-px bg-(--noir-border) mb-3" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <div className="h-7 w-14 bg-white/10 animate-pulse rounded-md" />
          <div className="h-7 w-8 bg-white/10 animate-pulse rounded-md" />
          <div className="h-7 w-8 bg-white/10 animate-pulse rounded-md" />
        </div>
      </div>
    </div>
  );
}
