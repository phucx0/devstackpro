import Button from "@/public/components/Button";
import MarkdownRenderer from "@/public/components/MarkdownRenderer";
import NotFound from "@/public/components/NotFound";
import CopyButton from "@/public/components/user/CopyButton";
import FacebookShareButton from "@/public/components/user/FacebookShareButton";
import SideBar from "@/public/components/user/SideBar";
import { articleAPI } from "@/public/lib/api";
import { console } from "inspector";
import { ArrowLeft } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getArticle(slug: string) {
    if (!slug) return null;
    try {
        const result = await articleAPI.getArticleBySlug(slug);
        
        if (result.success) {
            console.log('Article data:', {
                title: result.data.title,
                description: result.data.description,
                hasDescription: !!result.data.description
            });
            return result.data;
        }
        return null;
    }catch {
        return null;
    }
}


export async function generateMetadata(
    {  params }: Props
): Promise<Metadata> {
    const { slug } = await params;
    const finalSlug = Array.isArray(slug) ? slug.join("/") : slug;
    const article = await getArticle(finalSlug);

    if (!article) {
        return {
            title: "Bài viết không tồn tại"
        };
    }
    
    return {
        title: article.title + " - Dev Stack Pro",
        description: article.description || article.title || "Master modern web and mobile development with expert guides on CSS, Flutter, Next.js, and UI design principles",
        alternates: {
            canonical: `https://devstackpro.cloud/articles/${article.slug}`,
        },
        openGraph: {
            title: article.title + " - Dev Stack Pro",
            description: article.description || article.title || "Master modern web and mobile development with expert guides on CSS, Flutter, Next.js, and UI design principles",
            type: "article",
            url: `https://devstackpro.cloud/articles/${article.slug}`,
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
            title: article.title + " - Dev Stack Pro",
            description: article.description || article.title || "Master modern web and mobile development with expert guides on CSS, Flutter, Next.js, and UI design principles",
            images: [`https://easytrade.site/api/v2${article.thumbnail}`],
        }
    };
}


export default async function ArticlePage({ params }: { params: { slug: string | string[] } }) {
    const { slug } = await params;
    const finalSlug = Array.isArray(slug)
        ? slug.join("/")
        : slug;
    const _article = await getArticle(finalSlug);
    if (!_article) return <NotFound/>
    
    // console.log(_article.description)
    function formatArticleTime(dateString: string) {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffSeconds = Math.floor(diffMs / 1000)
        const diffMinutes = Math.floor(diffSeconds / 60)
        const diffHours = Math.floor(diffMinutes / 60)

        if (diffHours < 24) {
            if (diffMinutes < 1) return "Just now"
            if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`
            return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
        }

        // Nếu > 24h, hiển thị ngày + giờ
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
            timeZone: "UTC"
        }).format(date);

    }



    return (
        <div className="">
            <Link
                className="flex space-x-2 w-fit cursor-pointer"
                href="/"
            >
                <ArrowLeft color="white"/>
                <div className="text-white">Home</div>
            </Link>
            <div className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-4 my-4">
                <article className="bg-primary p-2 md:p-0 border-t border-gray-800">      
                    <div className="flex items-center gap-1 text-gray-300/80 py-4">
                        {/* <UserRound size={16}/> */}
                        <div className="text-base">{_article.display_name}</div>
                        <p>-</p>
                        <div className="text-base">{formatArticleTime(_article.created_at)}</div>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold pb-4 text-white">{_article.title}</h1>
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
                                priority
                                fetchPriority="high"
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                    )}
                    <div className="content py-4 text-neutral-500">
                        <MarkdownRenderer content={_article.content_md}/>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                        <span className="p-2 border border-neutral-300  text-white text-sm">Tags</span>
                        {_article.tags.map((tag, index) => (
                            <Link href={`/articles/search/${tag.name}`} key={index} className="p-2 min-w-10 text-center border border-gray-600 text-sm cursor-pointer hover:bg-gray-700 text-white">
                                {tag.name}
                            </Link>
                        ))}
                    </div>
                </article>        
                {/* <SideBar/>     */}
            </div>
        </div>
    )
}