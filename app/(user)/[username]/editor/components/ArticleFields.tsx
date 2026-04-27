import { useState } from "react";
import { UpdateArticleRequest } from "@/public/lib/types";

interface NoirInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
}

function NoirInput({ label, required, ...props }: NoirInputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-widest text-(--noir-muted) mb-2">
        {label} {required && <span className="text-(--noir-accent)">*</span>}
      </label>
      <input
        {...props}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full rounded-md bg-(--noir-card) border text-[14px] text-(--noir-white) px-3 py-2 outline-none transition
          ${focused ? "border-(--noir-accent)" : "border-(--noir-border)"}`}
      />
    </div>
  );
}

interface Props {
  article: UpdateArticleRequest;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ArticleFields({ article, onChange }: Props) {
  return (
    <div className="p-6 rounded-sm border border-(--noir-border) bg-(--noir-surface) flex flex-col gap-4">
      <NoirInput
        label="Title"
        name="title"
        value={article.title ?? ""}
        onChange={onChange}
        required
      />
      <NoirInput
        label="Slug"
        name="slug"
        value={article.slug ?? ""}
        onChange={onChange}
      />
      <NoirInput
        label="Description"
        name="description"
        value={article.description ?? ""}
        onChange={onChange}
        required
      />
    </div>
  );
}
