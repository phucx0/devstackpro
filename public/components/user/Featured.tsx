"use client"
import { ArticleWithTags } from "@/public/lib/types"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default ({articles} : {articles : ArticleWithTags[]}) => {
    const router = useRouter();
    return (
        <div className="w-full md:aspect-8/3 featured-wrapper box-border mb-8">
            <div className="featured-content">
                <div 
                    onClick={() => router.push(`/articles/${articles[0].slug}`)}
                    className="featured-item-1 relative cursor-pointer"
                >
                    <Image 
                        src={articles[0].thumbnail 
                            ? `https://easytrade.site/api/v2/${articles[0].thumbnail}` 
                            : "/images/og-image.png"
                        }
                        alt={articles[0].title}
                        fill 
                        priority
                        fetchPriority="high"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover" 
                    />
                    <div className="w-full absolute bottom-0 p-2 md:p-4 bg-linear-to-b from-black/10 to-black">
                        <div className="text-white font-bold text-base md:text-2xl">{articles[0].title}</div>
                        <div className="text-sm text-neutral-200 line-clamp-1 md:line-clamp-2">{articles[1].description}</div>
                    </div>
                </div>
                <div 
                    onClick={() => router.push(`/articles/${articles[1].slug}`)}
                    className="featured-item-2 relative cursor-pointer"
                >
                    <Image 
                        src={articles[1].thumbnail 
                            ? `https://easytrade.site/api/v2/${articles[1].thumbnail}` 
                            : "/images/og-image.png"
                        }
                        alt={articles[1].title}
                        fill 
                        priority
                        fetchPriority="high"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover" 
                    />
                    <div className="absolute bottom-0 p-2 md:p-4 bg-linear-to-b from-black/10 to-black">
                        <div className="text-white font-bold text-base md:text-xl">{articles[1].title}</div>
                        <p className="text-sm text-neutral-200 line-clamp-1 md:line-clamp-2">{articles[1].description}</p>
                    </div>
                </div>
                <div 
                    onClick={() => router.push(`/articles/${articles[2].slug}`)}
                    className="featured-item-3 relative cursor-pointer"
                >
                    <Image 
                        src={articles[2].thumbnail 
                            ? `https://easytrade.site/api/v2/${articles[2].thumbnail}` 
                            : "/images/og-image.png"
                        }

                        alt={articles[2].title}
                        fill 
                        priority
                        fetchPriority="high"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover" 
                    />
                    <div className="absolute bottom-0 p-2 md:p-4 bg-linear-to-b from-black/10 to-black">
                        <div className="text-white font-bold text-base md:text-xl">{articles[2].title}</div>
                        <p className="text-sm text-neutral-200 line-clamp-1 md:line-clamp-2">{articles[2].description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}