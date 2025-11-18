import ReactMarkdown from 'react-markdown';

const MarkdownRenderer = ({ content }: { content: string }) => {
    return (
        <ReactMarkdown
            components={{
                img: ({ node, ...props }) => (
                    <img
                        {...props}
                        className="max-w-full rounded-lg my-4 w-full aspect-video"
                        alt={props.alt || "image"}
                    />
                ),
                h1: ({ node, ...props }) => (
                    <h1 className="text-3xl font-bold my-4 text-black" {...props} />
                ),
                h2: ({ node, ...props }) => (
                    <h2 className="text-2xl font-semibold my-3 text-black" {...props} />
                ),
                p: ({ node, ...props }) => (
                    <p className="text-base md:text-lg text-gray-600 my-2" {...props} />
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
    );
};

export default MarkdownRenderer;
