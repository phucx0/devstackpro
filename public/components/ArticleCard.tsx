"use client"
import { UserRound } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArticleWithTags } from "../lib/types";
import Loading from "./Loading";

export default function ArticleCard({article} : {article : ArticleWithTags}) {
    const router = useRouter();
    const goToArticle = () => {
        router.push(`article/${article.slug}`);
    }
    const url = `https://easytrade.site/api/v2/${article.thumbnail}`
    return (
        <article
            onClick={() => goToArticle()}
            className="grid grid-cols-1 md:grid-cols-2 cursor-pointer hover:bg-neutral-100/60 transition-all duration-300 ease-in-out"
        >
            <div className="w-full aspect-video relative bg-neutral-300">
                {article.thumbnail && (
                    <Image
                        src={url}
                        alt={article.slug ?? ""}
                        fill
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL="/images/og-image.png"
                    />
                )}
            </div>
            <div className="py-2 md:px-4 md:py-0">
                <div className="text-xl font-bold">{article.title}</div>
                <div className="flex items-center justify-between text-neutral-500">
                    <div className="flex items-center gap-1">
                        <UserRound size={16}/>
                        <div className="text-sm">{article.display_name}</div>
                    </div>
                    <div className="text-sm">{article.updated_at}</div>
                </div>
            </div>
        </article>
    )
}