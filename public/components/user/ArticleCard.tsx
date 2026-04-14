"use client"
import { UserRound } from "lucide-react";
import Image from "next/image";
import { ArticleWithTags } from "../../lib/types";
import Link from "next/link";

export default function ArticleCard({article} : {article : ArticleWithTags}) {
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
        <Link 
            href={`/articles/${article.slug}`} 
            className="bg-gray-800/80 shadow transition-all duration-300 ease-in-out rounded-lg overflow-hidden"
        >
            <article
                className="flex flex-col cursor-pointer h-full"
            >
                <div className="relative w-full aspect-video bg-neutral-300 overflow-hidden">
                    <Image
                        src={`https://easytrade.site/api/v2/${article.thumbnail}`}
                        alt={article.title ?? ""}
                        fill
                        priority
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL="/images/og-image.png"
                        decoding="async"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                <div className="p-2 md:p-4 flex-1 flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg md:text-xl font-medium text-white m-0 line-clamp-2">{article.title}</h2>
                        <p className="text-sm text-neutral-300 line-clamp-2 mt-4">{article.description}</p>
                    </div>
                    <div className="flex items-center justify-between text-neutral-300/80 mb-2 mt-6">
                        <div className="flex items-center gap-1">
                            <UserRound size={16}/>
                            <div className="text-xs">{article.display_name}</div>
                        </div>
                        <div className="text-xs">{formatArticleTime(article.created_at)}</div>
                    </div>
                </div>
            </article>
        </Link>
    )
}