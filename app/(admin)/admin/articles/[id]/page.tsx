import MarkdownRenderer from "@/public/components/MarkdownRenderer";
import { ArrowLeft, Eye, Clock } from "lucide-react";
import NotFound from "@/public/components/NotFound";
import { getArticle } from "@/services/articles.author.service";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticle(Number(id));
  if (!article) return <NotFound />;
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_URL_IMAGE;

  return (
    <div className="max-w-[820px] mx-auto font-body">
      {/* Back button */}
      <a href="/admin/articles">
        <button className="inline-flex items-center gap-2 mb-7 font-mono text-[11px] font-medium tracking-widest uppercase text-(--noir-muted) bg-transparent border-0 cursor-pointer p-0 transition-colors duration-200">
          <ArrowLeft size={14} />
          Back
        </button>
      </a>

      {/* Article card */}
      <div className="border border-(--noir-border) rounded-md overflow-hidden bg-(--noir-surface)">
        {/* Thumbnail */}
        {article.thumbnail && (
          <div className="relative w-full aspect-16/7 overflow-hidden">
            <img
              src={`${IMAGE_BASE_URL}${article.thumbnail}`}
              alt="Thumbnail"
              className="w-full h-full object-cover brightness-50 saturate-60"
            />
            <div className="absolute inset-0 bg-linear-to-t from-(--noir-surface) to-transparent opacity-90" />
          </div>
        )}

        {/* Header */}
        <div className="px-9 pt-8 pb-6 border-b border-(--noir-border)">
          {/* Tags */}
          {article?.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {article.tags.map((tag) => (
                <span key={tag.id} className="noir-tag">
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <h1 className="font-display font-extrabold text-[clamp(22px,3.5vw,34px)] text-(--noir-white) tracking-[-0.02em] leading-tight mb-3">
            {article?.title}
          </h1>

          {article?.description && (
            <p className="text-[14px] text-(--noir-muted) leading-relaxed mb-5 max-w-[600px]">
              {article.description}
            </p>
          )}

          {/* Meta row */}
          <div className="flex items-center flex-wrap gap-5">
            <span className="font-mono text-[10px] text-(--noir-muted) tracking-wider">
              /{article?.slug}
            </span>

            <span className="flex items-center gap-1 font-mono text-[10px] text-(--noir-muted) tracking-wider">
              <Eye size={11} />
              {article?.views ?? 0} views
            </span>

            <span className="flex items-center gap-1 font-mono text-[10px] text-(--noir-muted) tracking-wider">
              <Clock size={11} />
              {article?.display_name}
            </span>

            {/* Status */}
            {article?.status && (
              <span
                className={`font-mono text-[9px] tracking-[0.12em] uppercase inline-flex items-center gap-1 px-2.5 py-[3px] rounded-[3px] border ${
                  article.status === "published"
                    ? "text-(--noir-accent) bg-(--noir-accent-bg) border-[rgba(232,255,0,0.25)]"
                    : "text-(--noir-muted) bg-[rgba(116,116,112,0.1)] border-(--noir-border)"
                }`}
              >
                <span
                  className={`w-[5px] h-[5px] rounded-full ${
                    article.status === "published"
                      ? "bg-(--noir-accent)"
                      : "bg-(--noir-muted)"
                  }`}
                />
                {article.status}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-9">
          {article?.content_md ? (
            <div className="noir-markdown">
              <MarkdownRenderer content={article.content_md} />
            </div>
          ) : (
            <div className="text-center py-10 font-mono text-[11px] text-(--noir-muted) tracking-widest">
              NO CONTENT
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
