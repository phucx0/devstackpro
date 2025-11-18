"use client"
import { useState } from "react";

export default function MarkdownToolbar({ onInsert }: { onInsert: (text: string) => void }) {
    const buttons = [
        { label: "H1", insert: "# " },
        { label: "H2", insert: "## " },
        { label: "H3", insert: "### " },
        { label: "Bold", insert: "**bold**" },
        { label: "Italic", insert: "*italic*" },
        { label: "Image", insert: "![description](url)" },
    ];

    return (
        <div className="text-sm text-gray-500 mt-1.5">
        <div>Hỗ trợ Markdown:</div>
        <div className="flex items-center gap-2 flex-wrap mt-1">
            {buttons.map((btn, i) => (
            <button
                key={i}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition font-mono"
                onClick={() => onInsert(btn.insert)}
            >
                {btn.label}
            </button>
            ))}
        </div>
        </div>
    );
};