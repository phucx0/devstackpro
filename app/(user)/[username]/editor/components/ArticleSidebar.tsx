import { Eye, EyeOff } from "lucide-react";
import { UpdateArticleRequest, Tag } from "@/public/lib/types";
import TagSelector from "@/public/components/admin/TagSelector";
import ImageUpload from "@/public/components/user/ImageUpload";

interface Props {
  article: UpdateArticleRequest;
  selectedTags: Pick<Tag, "id" | "name">[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTagsChange: (tags: Pick<Tag, "id" | "name">[]) => void;
  onUpload: (file: File) => Promise<void>;
  onRemoveThumbnail: () => void;
}

export function ArticleSidebar({
  article,
  selectedTags,
  onInputChange,
  onTagsChange,
  onUpload,
  onRemoveThumbnail,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* Status */}
      <div className="p-6 rounded-sm border border-(--noir-border) bg-(--noir-surface)">
        <label className="block font-mono text-[10px] uppercase text-(--noir-muted) mb-3">
          Status
        </label>
        <div className="flex flex-col gap-2">
          {[
            { value: "draft", icon: <EyeOff size={14} />, label: "Draft" },
            { value: "published", icon: <Eye size={14} />, label: "Published" },
          ].map((opt) => {
            const active = article.status === opt.value;
            return (
              <label
                key={opt.value}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-sm border cursor-pointer transition-all duration-200
                  ${
                    active
                      ? "border-(--noir-accent) bg-(--noir-accent)/5"
                      : "border-(--noir-border) bg-transparent hover:border-white/20"
                  }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={opt.value}
                  checked={active}
                  onChange={onInputChange}
                  className="hidden"
                />
                <span
                  className={
                    active ? "text-(--noir-accent)" : "text-(--noir-muted)"
                  }
                >
                  {opt.icon}
                </span>
                <span
                  className={`font-mono text-[11px] tracking-widest uppercase ${active ? "text-(--noir-accent)" : "text-(--noir-muted)"}`}
                >
                  {opt.label}
                </span>
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-(--noir-accent)" />
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Tags */}
      <div className="p-6 rounded-sm border border-(--noir-border) bg-(--noir-surface)">
        <label className="block font-mono text-[10px] uppercase text-(--noir-muted) mb-3">
          Tags
        </label>
        <TagSelector
          selectedTags={selectedTags}
          setSelectedTags={onTagsChange}
        />
      </div>

      {/* Thumbnail */}
      <ImageUpload
        label="Thumbnail"
        thumbnailUrl={article.thumbnail || null}
        onChange={onUpload}
        onRemove={onRemoveThumbnail}
      />
    </div>
  );
}
