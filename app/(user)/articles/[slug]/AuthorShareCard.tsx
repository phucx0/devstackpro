"use client";
import { Clock, Eye, Copy, Mail, Facebook, Linkedin } from "lucide-react";
import { toast } from "sonner";

type Props = {
  displayName: string;
  username: string;
  createdAt: string;
  readTime: number;
  views?: number;
  tags: { name: string }[];
  slug: string;
};

const SHARE_PLATFORMS = [
  {
    label: "Facebook",
    icon: <Facebook size={13} />,
    href: (slug: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        `https://devstackpro.cloud/articles/${slug}`,
      )}`,
  },
  {
    label: "X / Twitter",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4l11.733 16H20L8.267 4z" />
        <path
          d="M4 20l6.768-6.768M15.232 9.232L20 4"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
    href: (slug: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        `https://devstackpro.cloud/articles/${slug}`,
      )}`,
  },
  {
    label: "LinkedIn",
    icon: <Linkedin size={20} />,
    href: (slug: string) =>
      `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        `https://devstackpro.cloud/articles/${slug}`,
      )}`,
  },
  {
    label: "Email",
    icon: <Mail size={13} />,
    href: (slug: string) =>
      `mailto:?body=${encodeURIComponent(
        `https://devstackpro.cloud/articles/${slug}`,
      )}`,
  },
];

export default function AuthorShareCard({
  displayName,
  username,
  createdAt,
  readTime,
  views,
  tags,
  slug,
}: Props) {
  const formatted = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(createdAt));

  function handleCopy() {
    toast.success("Copied link");
    navigator.clipboard.writeText(`https://devstackpro.cloud/article/${slug}`);
  }

  return (
    <div className="bg-(--noir-surface) border border-(--noir-border) rounded-lg overflow-hidden">
      {/* Author row */}
      <div className="p-5 pb-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="noir-card-author-dot shrink-0">
            {displayName?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <a
              className="text-(--noir-white) font-semibold text-md truncate hover:text-(--noir-accent)"
              href={`/${username}`}
            >
              {displayName}
            </a>
            <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
              <span className="font-mono text-[12px] text-(--noir-muted)">
                @{username}
              </span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map((tag) => (
              <span key={tag.name} className="noir-tag">
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="h-px bg-(--noir-border)" />
      </div>

      {/* Share */}
      <div className="p-5 pt-4">
        <p className="category-label mb-3">Share</p>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {SHARE_PLATFORMS.map((p) => (
            <a
              key={p.label}
              href={p.href(slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="noir-read-btn-ghost whitespace-nowrap flex items-center gap-2 text-[10px] py-2 px-3 justify-center"
            >
              {p.icon}
              {p.label}
            </a>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="noir-read-btn w-full justify-center gap-2 text-[10px] cursor-pointer"
        >
          <Copy size={12} />
          Copy link
        </button>
      </div>
    </div>
  );
}
