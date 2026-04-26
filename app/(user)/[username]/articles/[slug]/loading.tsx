export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Back button */}
      <div className="my-4">
        <div className="h-4 w-14 bg-white/10 animate-pulse rounded" />
      </div>

      <main className="p-4">
        <article>
          {/* Thumbnail */}
          <div className="w-full aspect-16/7 bg-white/10 animate-pulse rounded-md" />

          {/* Header */}
          <div className="w-full mb-10 mt-5">
            {/* Tags */}
            <div className="flex gap-2 flex-wrap mb-4">
              {[56, 80, 54].map((w, i) => (
                <div
                  key={i}
                  className="h-6 bg-white/10 animate-pulse rounded-full"
                  style={{ width: w }}
                />
              ))}
            </div>

            {/* Title */}
            <div className="h-9 w-[90%] bg-white/10 animate-pulse rounded-md mb-2" />
            <div className="h-9 w-[75%] bg-white/10 animate-pulse rounded-md mb-6" />

            {/* Description */}
            <div className="border-l-2 border-(--noir-accent) pl-4 mb-8 flex flex-col gap-2">
              <div className="h-4 w-full bg-white/10 animate-pulse rounded" />
              <div className="h-4 w-[85%] bg-white/10 animate-pulse rounded" />
            </div>

            <div className="h-px bg-white/10" />
          </div>

          {/* Markdown content */}
          <div className="flex flex-col gap-3 mb-10">
            {[100, 100, 92, 100, 78].map((w, i) => (
              <div
                key={i}
                className="h-4 bg-white/10 animate-pulse rounded"
                style={{ width: `${w}%` }}
              />
            ))}

            {/* Code block */}
            <div className="my-2 bg-white/10 animate-pulse rounded-md p-4 flex flex-col gap-2">
              {[100, 100, 95, 100, 70].map((w, i) => (
                <div
                  key={i}
                  className="h-4 bg-white/5 rounded"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>

            {[100, 100, 83, 91, 55].map((w, i) => (
              <div
                key={i}
                className="h-4 bg-white/10 animate-pulse rounded"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>

          {/* Comment section */}
          <div className="border-t border-white/10 pt-8">
            <div className="h-4 w-36 bg-white/10 animate-pulse rounded mb-5" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3 mb-4">
                <div className="w-9 h-9 bg-white/10 animate-pulse rounded-full shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-4 w-full bg-white/10 animate-pulse rounded" />
                  <div className="h-4 w-[75%] bg-white/10 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </article>
      </main>
    </div>
  );
}
