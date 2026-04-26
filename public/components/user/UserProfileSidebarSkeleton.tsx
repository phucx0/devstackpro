export default function UserProfileSidebarSkeleton() {
  return (
    <aside className="w-70 top-(--header-h) sticky shrink-0 self-start hidden md:flex flex-col h-[calc(100vh-var(--header-h))] gap-6 p-4 border-r border-(--noir-border)">
      {/* Avatar + identity */}
      <div className="flex flex-col gap-4">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-white/10 animate-pulse mx-auto shrink-0" />

        {/* Name + username */}
        <div className="flex flex-col gap-2">
          <div className="h-3.5 w-28 bg-white/10 animate-pulse rounded" />
          <div className="h-3 w-20 bg-white/10 animate-pulse rounded" />
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-full bg-white/10 animate-pulse rounded" />
          <div className="h-3 w-4/5 bg-white/10 animate-pulse rounded" />
          <div className="h-3 w-3/5 bg-white/10 animate-pulse rounded" />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10" />

      {/* Stats */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="h-3 w-14 bg-white/10 animate-pulse rounded" />
          <div className="h-3 w-6 bg-white/10 animate-pulse rounded" />
        </div>
        <div className="flex justify-between items-center">
          <div className="h-3 w-14 bg-white/10 animate-pulse rounded" />
          <div className="h-3 w-6 bg-white/10 animate-pulse rounded" />
        </div>
      </div>

      <div className="flex-1" />

      {/* CTA button */}
      <div className="h-8 w-full bg-white/10 animate-pulse rounded" />
    </aside>
  );
}
