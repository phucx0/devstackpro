import MarkdownRenderer from "@/public/components/MarkdownRenderer";
import NotFound from "@/public/components/NotFound";
import {
  getArticleBySlug,
  increaseView,
} from "@/services/articles.user.service";
import { Metadata } from "next";
import Link from "next/link";
import BackButton from "./BackButton";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const finalSlug = Array.isArray(slug) ? slug.join("/") : slug;
  const article = await getArticleBySlug(finalSlug);
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_URL_IMAGE!;

  if (!article) {
    return { title: "Bài viết không tồn tại" };
  }

  return {
    title: article.title + " - Dev Stack Pro",
    description:
      article.description ||
      article.title ||
      "Master modern web and mobile development with expert guides on CSS, Flutter, Next.js, and UI design principles",
    alternates: {
      canonical: `https://devstackpro.cloud/articles/${article.slug}`,
    },
    openGraph: {
      title: article.title + " - Dev Stack Pro",
      description: article.description || article.title,
      type: "article",
      url: `https://devstackpro.cloud/articles/${article.slug}`,
      images: [
        {
          url: `${IMAGE_BASE_URL}${article.thumbnail}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title + " - Dev Stack Pro",
      description: article.description || article.title,
      images: [`${IMAGE_BASE_URL}${article.thumbnail}`],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string | string[] };
}) {
  const { slug } = await params;
  const finalSlug = Array.isArray(slug) ? slug.join("/") : slug;
  const article = await getArticleBySlug(finalSlug);
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_URL_IMAGE!;

  function formatArticleTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
      if (diffMinutes < 1) return "Just now";
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      return `${diffHours}h ago`;
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      timeZone: "UTC",
    }).format(date);
  }

  if (!article) return <NotFound />;
  void increaseView(article.id);

  return (
    <div className="pt-10">
      {/* ── Back nav ── */}
      <div className="noir-container">
        <BackButton fallbackHref="/" label="Back" />
      </div>

      {/* ── Article layout ── */}
      <div
        className="noir-container"
        style={{ paddingTop: "40px", paddingBottom: "80px" }}
      >
        <div>
          {/* ── Main content ── */}
          <article>
            {article.thumbnail && (
              <div className="relative w-full aspect-16/7 overflow-hidden">
                <img
                  src={`${IMAGE_BASE_URL}${article.thumbnail}`}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-(--noir-black) to-transparent opacity-100" />
              </div>
            )}
            {/* Header Article */}
            <div className={`w-full mb-10`}>
              <div className="flex flex-col justify-end">
                {article.tags?.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-4">
                    {article.tags.slice(0, 3).map((tag: any, i: number) => (
                      <Link
                        key={i}
                        href={`/articles/search/${tag.name}`}
                        className="noir-tag"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                )}
                <h1 className="noir-article-title static p-0 max-w-none">
                  {article.title}
                </h1>

                {article.description && (
                  <p className="text-base text-(--noir-muted) leading-7 border-l-2 border-(--noir-accent) pl-4 mb-8 italic">
                    {article.description}
                  </p>
                )}
                <div className="h-px bg-(--noir-border)" />
              </div>
            </div>

            {/* Markdown content */}
            <div className="noir-markdown">
              <MarkdownRenderer content={article.content_md ?? ""} />
            </div>
          </article>
        </div>
      </div>

      {/* ── Responsive: hide sidebar on mobile ── */}
      <style>{`
            @media (max-width: 900px) {
                .sidebar-hide-mobile { display: none !important; }
                article { grid-column: 1 / -1 !important; }
                .noir-container > div[style*="grid"] {
                    display: block !important;
                }
            }
        `}</style>
    </div>
  );
}
