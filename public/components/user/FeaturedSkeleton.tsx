export default function FeaturedSkeleton() {
  return (
    <>
      {/* Featured Grid */}
      <section className="noir-featured-wrap">
        <div className="noir-featured-grid">
          {/* Main */}
          <div className="noir-featured-main">
            <div className="noir-featured-main-img bg-white/10 animate-pulse" />

            <div className="noir-featured-main-content">
              <div className="h-3 w-24 bg-white/10 animate-pulse rounded mb-3" />
              <div className="flex flex-col gap-2 mb-2">
                <div className="h-5 w-full bg-white/10 animate-pulse rounded" />
                <div className="h-5 w-3/4 bg-white/10 animate-pulse rounded" />
              </div>
              <div className="flex flex-col gap-1.5 mb-4">
                <div className="h-3 w-full bg-white/10 animate-pulse rounded" />
                <div className="h-3 w-5/6 bg-white/10 animate-pulse rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-3 w-24 bg-white/10 animate-pulse rounded" />
                <div className="h-3 w-16 bg-white/10 animate-pulse rounded" />
              </div>
            </div>
          </div>

          {/* Stack — 2 secondary */}
          <div className="noir-featured-stack">
            {[0, 1].map((i) => (
              <div key={i} className="noir-featured-item">
                <div className="noir-featured-main-img bg-white/10 animate-pulse" />
                <div className="noir-featured-item-content">
                  <div className="h-3 w-16 bg-white/10 animate-pulse rounded mb-2" />
                  <div className="flex flex-col gap-1.5 mb-2">
                    <div className="h-4 w-full bg-white/10 animate-pulse rounded" />
                    <div className="h-4 w-2/3 bg-white/10 animate-pulse rounded" />
                  </div>
                  <div className="h-3 w-20 bg-white/10 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ticker Bar */}
      <div className="noir-ticker" aria-hidden="true">
        <div className="h-3 w-16 bg-white/10 animate-pulse rounded" />
        <div className="flex-1 h-3 bg-white/10 animate-pulse rounded" />
      </div>
    </>
  );
}
