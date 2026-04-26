"use client";
import { useState, useRef, useEffect } from "react";

export function ReplyEditor({
  onSubmit,
  onCancel,
  placeholder = "Write a reply…",
}: {
  onSubmit: (text: string) => void;
  onCancel: () => void;
  placeholder?: string;
}) {
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div className="mt-2 ml-12">
      <textarea
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="w-full resize-none rounded-lg border border-(--noir-border) bg-white/[0.03] px-3 py-2 text-sm text-(--noir-white) placeholder:text-(--noir-muted) outline-none focus:border-white/20 transition-colors"
      />
      <div className="flex gap-2 mt-1.5 justify-end">
        <button
          onClick={onCancel}
          className="text-xs px-3 py-1.5 rounded text-(--noir-muted) hover:text-(--noir-white) transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (text.trim()) {
              onSubmit(text.trim());
              setText("");
            }
          }}
          disabled={!text.trim()}
          className="text-xs px-3 py-1.5 rounded bg-(--noir-accent) text-black font-semibold disabled:opacity-40 hover:brightness-110 transition-all"
        >
          Reply
        </button>
      </div>
    </div>
  );
}
