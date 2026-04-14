import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import "@/public/css/markdown.css"
const MarkdownRenderer = ({ content }: { content: string }) => {
    const markdownStyles = {
        h1: 'text-3xl font-bold mb-4 text-gray-900',
        h2: 'text-2xl font-bold mb-3 text-gray-900',
        h3: 'text-xl font-bold mb-2 text-gray-900',
        p: 'mb-4 text-gray-700 leading-relaxed',
        strong: 'font-bold text-gray-900',
        em: 'italic text-gray-700',
        ul: 'list-disc list-inside mb-4 text-gray-700',
        ol: 'list-decimal list-inside mb-4 text-gray-700',
        li: 'mb-1',
        code: 'bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600',
        pre: 'bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4',
        blockquote: 'border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-4',
        a: 'text-blue-500 hover:underline'
    };
    return (
        <div className='markdown-body'>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    blockquote: ({ children }) => (
                        <aside className="my-4 p-4 bg-amber-400/10 border-l-4 border-amber-400 rounded">
                            {children}
                        </aside>
                    ),
                    a: ({node, ...props}) => (
                        <a {...props}  rel="noopener noreferrer" target="_blank"/>
                    ),
                    ul: ({ node, ...props }) => (
                        <ul {...props} />
                    ),
                    li: ({ node, ...props }) => (
                        <li {...props} />
                    ),
                    img: ({ node, ...props }) => {
                        if (!props.src || typeof props.src !== "string") return null;
                        return (
                            <div className="w-full aspect-video relative my-10">
                                <Image
                                    src={props.src}
                                    alt={props.alt || "image"}
                                    className="rounded-lg object-cover"
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
                    p: ({ node, ...props }) => (
                        <p {...props} />
                    ),
                    table: ({ node, ...props }) => (
                        <div className='w-full overflow-y-hidden'>
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
                        <tr className="border-b border-gray-500 hover:bg-gray-700/10 transition-colors duration-200" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                        <td
                            className="px-4 py-3 text-gray-300 text-sm border-b border-gray-500"
                            {...props}
                        />
                    ),
                    code: ({ node, className, children, ...props }) => {
                        const isInline =
                            node?.tagName?.toLowerCase() === "code";

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
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
