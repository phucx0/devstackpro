import MarkdownRenderer from "@/public/components/MarkdownRenderer";
import CopyButton from "@/public/components/user/CopyButton";
import FacebookShareButton from "@/public/components/user/FacebookShareButton";
import { articleAPI } from "@/public/lib/api";
import { Metadata } from "next";
import Image from "next/image";

async function getArticle(slug: string) {
    if (!slug) return null;
    const result = await articleAPI.getArticleBySlug(slug);
    if (result.success) {
        return result.data;
    }
    return null;
}

export async function generateMetadata({ params }: { params: { slug: string | string[] } }): Promise<Metadata> {
    const { slug } = await params;
    const finalSlug = Array.isArray(slug)
        ? slug.join("/")
        : slug;
    const article = await getArticle(finalSlug);

    if (!article) {
        return {
            title: "Bài viết không tồn tại"
        };
    }

    return {
        title: article.title,
        description: article.title || "",

        openGraph: {
            title: article.title,
            description: article.title || "",
            type: "article",
            url: `https://dev-stack-pro.vercel.app/article/${article.slug}`,
            images: [
                {
                    url: `https://easytrade.site/api/v2${article.thumbnail}`,
                    width: 1200,
                    height: 630,
                }
            ],
        },

        twitter: {
            card: "summary_large_image",
            title: article.title,
            description: article.title || "",
            images: [`https://easytrade.site/api/v2${article.thumbnail}`],
        },
    };
}

export default async function ArticlePage({ params }: { params: { slug: string | string[] } }) {
    const { slug } = await params;
    const finalSlug = Array.isArray(slug)
        ? slug.join("/")
        : slug;
    const _article = await getArticle(finalSlug);
    if (!_article) {
        return <p>Article not found.</p>;
    }
    const formatted = new Date(_article.updated_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

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
        <div className="">
            <article className="bg-white p-4">      
                <div className="flex items-center gap-1 text-neutral-500 py-4">
                    {/* <UserRound size={16}/> */}
                    <div className="text-base">{_article.display_name}</div>
                    <p>-</p>
                    <div className="text-base">{formatted}</div>
                </div>
                <div className="text-2xl font-bold pb-4">{_article.title}</div>
                <div className="flex items-center gap-2">
                    <FacebookShareButton slug={finalSlug}/>
                    <CopyButton/>
                </div>
                {_article.thumbnail && (
                    <div className=" aspect-video relative m-auto my-4 rounded-md overflow-hidden">
                        <Image
                            src={`https://easytrade.site/api/v2/${_article.thumbnail}`}
                            alt={_article.slug}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}
                <div className="content py-4 text-neutral-500">
                    <MarkdownRenderer content={_article.content_md}/>
                </div>
                {/* <div className="py-4">
                    <div className="text-xl font-bold text-center">Download Code Example</div>
                    <div className="px-4 py-2 bg-yellow-500 text-black font-bold w-fit m-auto my-4">Download code</div>
                </div> */}
                {/* <div className="relative w-full aspect-video bg-neutral-500">
                    <iframe
                        src="https://www.youtube.com/embed/r6hpk2_x7Bg"
                        title="YouTube video"
                        // frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full"
                    ></iframe>
                </div> */}

                <div className="flex flex-wrap gap-2 pt-2">
                    <span className="p-2 border border-neutral-300 bg-black text-white text-sm">Tags</span>
                    {/* {article.tags.map((tag, index) => (
                        <div key={index} className="p-2 border border-neutral-300 text-neutral-500 text-sm cursor-pointer hover:bg-neutral-900 hover:text-white">
                            {tag.name}
                        </div>
                    ))} */}
                </div>
            </article>            
        </div>
    )
}