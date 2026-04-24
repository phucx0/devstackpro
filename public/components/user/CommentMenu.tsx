"use client";
import { Flag, Link, Trash } from "lucide-react";
import { useState, useRef, useEffect } from "react";

// ── Three-dot menu ─────────────────────────────────────────────────────────
export function ThreeDotMenu({
  onDelete,
  isOwner,
}: {
  onDelete?: () => void;
  isOwner: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const buttons = isOwner
    ? [{ label: "Delete", icon: <Trash size={14} />, danger: true }]
    : [
        { label: "Copy link", icon: <Link size={14} />, danger: false },
        { label: "Report", icon: <Flag size={14} />, danger: false },
      ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="p-1 rounded text-(--noir-muted) hover:text-(--noir-white) hover:bg-white/5 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-7 z-50 min-w-35 rounded-lg border border-(--noir-border) bg-[#1a1a1a] shadow-xl overflow-hidden">
          {buttons.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.danger) onDelete?.();
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-colors text-left ${
                item.danger ? "text-red-400" : "text-(--noir-muted)"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Share button ───────────────────────────────────────────────────────────
export function ShareButton() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex items-center gap-1.5 text-xs text-(--noir-muted) hover:text-(--noir-white) transition-colors px-2 py-1 rounded hover:bg-white/5"
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path
              d="M2 8l4 4 8-8"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M10 3a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-1.5-.4L6 10.1A3 3 0 0 1 6 11a3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3c.55 0 1.06.15 1.5.4L7 6.9A3 3 0 0 1 7 6a3 3 0 0 1 3-3z" />
          </svg>
          Share
        </>
      )}
    </button>
  );
}
