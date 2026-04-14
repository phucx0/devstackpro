import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "@/public/css/markdown.css";
const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
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
            const hasOnlyImage =
              node?.children?.length === 1 &&
              (node.children[0] as any)?.tagName === "img";

            if (hasOnlyImage) {
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
          code: ({ node, className, children, ...props }) => {
            const isInline = node?.tagName?.toLowerCase() === "code";

            return (
              <code
                className={`rounded px-1 py-0.5 text-sm ${
                  isInline
                    ? "bg-gray-100 text-red-500"
                    : "bg-black text-green-400 block p-3 my-3"
                }`}
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

export default MarkdownRenderer;
