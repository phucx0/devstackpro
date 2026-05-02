import MarkdownRenderer from "@/public/components/MarkdownRenderer";
import { Metadata } from "next";
import Link from "next/link";
import BackButton from "./BackButton";
import CommentSection from "@/public/components/user/Comment/CommentSection";
import { notFound } from "next/navigation";
import {
  getArticleBySlug,
  increaseView,
} from "@/server/articles/articles.public.service";
import { getThumbnailUrl } from "@/lib/utils/image";
import Image from "next/image";
import { Tag } from "@/public/lib/types";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const finalSlug = Array.isArray(slug) ? slug.join("/") : slug;
  const article = await getArticleBySlug(finalSlug);
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_URL_IMAGE!;
  const thumbnailUrl = IMAGE_BASE_URL + article?.thumbnail;
  if (!article) {
    return { title: "Bài viết không tồn tại" };
  }

  return {
    metadataBase: new URL("https://devstackpro.cloud"),
    title: article.title + " - Dev Stack Pro",
    description:
      article.description ||
      article.title ||
      "Master modern web and mobile development with expert guides on CSS, Flutter, Next.js, and UI design principles",
    alternates: {
      canonical: `https://devstackpro.cloud/${article.user.username}/articles/${article.slug}`,
    },
    openGraph: {
      title: article.title + " - Dev Stack Pro",
      description: article.description || article.title,
      type: "article",
      url: `https://devstackpro.cloud/${article.user.username}/articles/${article.slug}`,
      images: [
        {
          url: thumbnailUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title + " - Dev Stack Pro",
      description: article.description || article.title,
      images: [thumbnailUrl],
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

  if (!article) return notFound();
  void increaseView(article.id);

  return (
    <div className="mx-auto w-full max-w-3xl pb-10">
      {/* ── Back nav ── */}
      <div className="my-4">
        <BackButton fallbackHref="/" label="Back" />
      </div>

      {/* ── Article layout ── */}
      <main className="">
        {/* ── Main content ── */}
        <article>
          {article.thumbnail && (
            <div className="relative w-full aspect-16/7 overflow-hidden">
              <Image
                src={getThumbnailUrl(article.thumbnail)}
                alt="Thumbnail"
                className="w-full h-full object-cover"
                fill
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-(--noir-black) to-transparent opacity-100" />
            </div>
          )}
          {/* Header Article */}
          <div className={`w-full mb-10`}>
            <div className="flex flex-col justify-end">
              {article.tags?.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-4">
                  {article.tags
                    .slice(0, 3)
                    .map((tag: Pick<Tag, "id" | "name">, i: number) => (
                      <Link
                        key={i}
                        href={`/search/${tag.name}`}
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
        <CommentSection
          articleId={article.id}
          username={article.user.username || ""}
          slug={article.slug}
        />
      </main>

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
