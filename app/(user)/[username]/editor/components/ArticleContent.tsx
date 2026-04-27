import { UpdateArticleRequest } from "@/public/lib/types";
import MarkdownTextarea from "@/public/components/MarkdownTextarea";
import MarkdownRenderer from "@/public/components/MarkdownRenderer";
import { ArticleFields } from "./ArticleFields";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_URL_IMAGE!;

interface Props {
  article: UpdateArticleRequest;
  showPreview: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onContentChange: (text: string) => void;
}

export function ArticleContent({
  article,
  showPreview,
  onInputChange,
  onContentChange,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <ArticleFields article={article} onChange={onInputChange} />

      <div className="p-6 rounded-sm border border-(--noir-border) bg-(--noir-surface)">
        <label className="block font-mono text-[10px] uppercase tracking-widest text-(--noir-muted) mb-2">
          Content <span className="text-(--noir-accent)">*</span>
        </label>
        <MarkdownTextarea
          content={article.content_md ?? ""}
          onChange={onContentChange}
        />
      </div>

      {showPreview && (
        <div className="p-6 rounded-sm border border-(--noir-accent) bg-(--noir-surface)">
          <h3 className="font-display text-2xl text-white mb-2">
            {article.title}
          </h3>
          <p className="text-[10px] font-mono text-(--noir-muted) mb-4">
            /{article.slug}
          </p>
          {article.thumbnail && (
            <img
              src={IMAGE_BASE_URL + article.thumbnail}
              className="w-full h-[200px] object-cover rounded mb-4 border border-(--noir-border)"
              alt="Thumbnail preview"
            />
          )}
          <MarkdownRenderer content={article.content_md ?? ""} />
        </div>
      )}
    </div>
  );
}
