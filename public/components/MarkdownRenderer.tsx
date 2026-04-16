"use client";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "@/public/css/markdown.css";
import React from "react";
import rehypeHighlight from "rehype-highlight";
const MarkdownRenderer = ({ content }: { content: string }) => {
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
                  className="object-cover"
                  fill
                  loading="lazy"
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
          p: ({ node, ...props }) => {
            const children = props.children;
            if (node?.children?.length === 1) {
              if ((node.children[0] as any)?.tagName === "img")
                return <>{children}</>;
              if ((node.children[0] as any)?.tagName === "code")
                return <>{children}</>;
            }
            return <p {...props} />;
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
                <div className="group relative my-4 rounded-xl overflow-hidden border border-neutral-700 bg-[#0d1117]">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-2 text-xs text-neutral-400 bg-[#161b22] border-b border-neutral-700">
                    <span className="font-mono">{language || "code"}</span>

                    <div className="opacity-0 group-hover:opacity-100 transition">
                      <CopyButton text={String(children)} />
                    </div>
                  </div>

                  {/* Code */}
                  <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
                    <code {...props}>{children}</code>
                  </pre>
                </div>
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
};

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
      className="hover:text-white transition-colors"
      title="Copy code"
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
};

export default MarkdownRenderer;
