import { Eye, EyeOff, Save } from "lucide-react";

interface Props {
  showPreview: boolean;
  isChanged: boolean;
  isSubmitting: boolean;
  onTogglePreview: () => void;
  onSave: () => void;
}

export function ArticleHeader({
  showPreview,
  isChanged,
  isSubmitting,
  onTogglePreview,
  onSave,
}: Props) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/95 border-b border-(--noir-border) mb-7">
      <div className="flex items-center justify-between h-14 px-1">
        <div className="flex items-center gap-3">
          <div className="w-[3px] h-[26px] bg-(--noir-accent) rounded" />
          <h1 className="font-display text-xl font-bold text-(--noir-white)">
            Update Article
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onTogglePreview}
            className={`flex items-center gap-2 px-3 py-2 text-[10px] uppercase tracking-widest font-mono border rounded transition cursor-pointer
              ${
                showPreview
                  ? "text-(--noir-accent) border-(--noir-accent)"
                  : "text-(--noir-muted) border-(--noir-border)"
              }`}
          >
            {showPreview ? <EyeOff size={12} /> : <Eye size={12} />}
            {showPreview ? "Hide Preview" : "Preview"}
          </button>

          <button
            onClick={onSave}
            disabled={!isChanged || isSubmitting}
            className="flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-widest font-mono rounded bg-(--noir-accent) text-black disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition"
          >
            <Save size={12} />
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </header>
  );
}
