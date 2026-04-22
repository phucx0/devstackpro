"use client";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "@/public/css/markdown.css";
import React, { useState } from "react";
import rehypeHighlight from "rehype-highlight";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          blockquote: ({ children }) => (
            <div
              style={{
                fontSize: "16px",
                color: "var(--noir-muted)",
                lineHeight: "1.75",
                borderLeft: "2px solid var(--noir-accent)",
                paddingLeft: "16px",
                marginBottom: "32px",
                fontStyle: "italic",
              }}
            >
              {children}
            </div>
          ),
          a: ({ node, ...props }) => (
            <a {...props} rel="noopener noreferrer" target="_blank" />
          ),
          ul: ({ node, ...props }) => <ul {...props} />,
          li: ({ node, ...props }) => <li {...props} />,
          img: ({ node, ...props }) => {
            if (!props.src || typeof props.src !== "string") return null;
            return (
              <div className="w-full aspect-video relative my-10 rounded-lg overflow-hidden">
                <Image
                  src={props.src}
                  alt={props.alt || "image"}
                  className="w-full aspect-video relative my-10 rounded-lg overflow-hidden object-cover"
                  fill
                  loading="eager"
                  quality={90}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            );
          },
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl md:text-3xl" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl md:text-2xl" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg md:text-xl " {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-base md:text-lg " {...props} />
          ),
          p: ({ node, children }) => {
            const first = node?.children?.[0] as any;
            const isOnlyBlock =
              node?.children?.length === 1 && first?.type === "element";

            const tag = first?.tagName;
            if (
              isOnlyBlock &&
              (tag === "img" || tag === "div" || tag === "pre")
            ) {
              return <>{children}</>;
            }
            return <p>{children}</p>;
          },
          table: ({ node, ...props }) => (
            <div className="w-full overflow-y-hidden">
              <table
                className="w-full border border-gray-500 border-collapse rounded-lg overflow-hidden my-6"
                {...props}
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-gray-700/20 text-left" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th
              className="px-4 py-3 font-semibold text-white text-sm border-b border-gray-500"
              {...props}
            />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="divide-y divide-gray-500" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr
              className="border-b border-gray-500 hover:bg-gray-700/10 transition-colors duration-200"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="px-4 py-3 text-gray-300 text-sm border-b border-gray-500"
              {...props}
            />
          ),
          code: ({ inline, className, children, node, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";

            const isBlock =
              language ||
              node?.position?.start.line !== node?.position?.end.line;

            // Sử dụng cho code block
            // ```terminal
            // npm install test
            // ```
            if (isBlock) {
              return (
                // <div className="group relative my-4 rounded-xl overflow-hidden border border-neutral-700 bg-[#0d1117]">
                //   {/* Header */}
                //   <div className="flex items-center justify-between px-4 py-2 text-xs text-neutral-400 bg-[#161b22] border-b border-neutral-700">
                //     <span className="font-mono">{language || "code"}</span>

                //     <CopyButton text={String(children)} />
                //   </div>

                //   {/* Code */}
                //   <pre className="bg-(--noir-accent-bg) p-4">
                //     <code className="text-sm font-(--font-mono)" {...props}>
                //       {children}
                //     </code>
                //   </pre>
                // </div>

                <NoirCodeBlock
                  language={language || "code"}
                  children={children}
                  props={props}
                />
              );
            }
            // sử dụng code bình thường
            // `code`
            return (
              <code
                className="bg-neutral-800 text-neutral-200 px-1.5 py-0.5 rounded-md font-mono text-sm border border-neutral-700"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// Component Copy Button
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="hover:text-white transition-colors cursor-pointer"
      title="Copy code"
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
};

export function NoirCodeBlock({ language, children, ...props }: any) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative my-4 rounded-xl overflow-hidden border border-(--noir-border) bg-(--noir-black) font-(--font-mono)">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-(--noir-surface) border-b border-(--noir-border)">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-(--noir-accent)" />
          <span className="text-[12px] text-(--noir-muted) tracking-widest">
            {(language ?? "code").toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="cursor-pointer text-[10px] text-(--noir-muted) border border-(--noir-border-md) px-2.5 py-0.5 rounded tracking-wider hover:border-(--noir-accent) hover:text-(--noir-accent) transition-colors"
          >
            {copied ? "COPIED" : "COPY"}
          </button>
        </div>
      </div>

      {/* Code */}
      <pre className="p-4 overflow-x-auto bg-(--noir-card) m-0">
        <code
          className="text-[13px] leading-[22px] text-(--noir-white)"
          {...props}
        >
          {children}
        </code>
      </pre>
    </div>
  );
}
