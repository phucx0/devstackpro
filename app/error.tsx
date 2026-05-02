// app/error.tsx
"use client";

import Link from "next/link";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080808] px-8 py-12">
      {/* Grid background */}
      <div className="absolute inset-0 [background-image:linear-gradient(#1e1e1e_1px,transparent_1px),linear-gradient(90deg,#1e1e1e_1px,transparent_1px)] [background-size:48px_48px]" />

      {/* Vertical accent line */}
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#e8ff00] opacity-[0.08]" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Tag */}
        <span className="mb-7 inline-block border border-[#e8ff00]/20 px-3.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[#e8ff00]">
          runtime exception
        </span>

        {/* ERR heading */}
        <h1 className="font-display text-[clamp(72px,16vw,128px)] font-bold leading-none tracking-[-0.04em] text-[#f4f4f0]">
          <span className="text-[#e8ff00]">E</span>RR
        </h1>

        {/* Divider */}
        <div className="my-8 h-px w-10 bg-[#e8ff00] opacity-50" />

        {/* Text */}
        <p className="mb-3 font-display text-lg font-medium text-[#f4f4f0]">
          Something went wrong
        </p>
        <p className="max-w-[340px] text-sm leading-relaxed text-[#747470]">
          An unexpected error occurred. You can try reloading the page or head
          back to safety.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 border border-[#e8ff00] bg-[#e8ff00] px-6 py-2.5 font-body text-[13px] font-medium tracking-[0.04em] text-[#080808] transition-colors hover:bg-[#b8cc00] hover:border-[#b8cc00]"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path
                d="M11 6.5A4.5 4.5 0 1 1 6.5 2V0l3 3-3 3V4a2.5 2.5 0 1 0 2.5 2.5H11z"
                fill="currentColor"
              />
            </svg>
            Reload page
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-[#2a2a2a] bg-transparent px-6 py-2.5 font-body text-[13px] font-medium tracking-[0.04em] text-[#747470] transition-colors hover:border-[#333330] hover:text-[#f4f4f0]"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path
                d="M6.5 1L1 6.5h1.5V12h3V8.5h2V12h3V6.5H12L6.5 1z"
                fill="currentColor"
              />
            </svg>
            Back to home
          </Link>
        </div>

        {/* Footer note */}
        <p className="mt-12 font-mono text-[11px] tracking-[0.06em] text-[#333330]">
          If the issue persists, please contact support
        </p>
      </div>
    </div>
  );
}
