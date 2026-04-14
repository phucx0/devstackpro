"use client"
import { ArticleWithTags } from "@/public/lib/types";
import { useState } from "react";
import ArticleCard from "./ArticleCard";
import { articleAPI } from "@/public/lib/api";

interface Props {
    initialArticles  : ArticleWithTags[],
    initialPage: number,
    initialTotalPages: number
}

export default function ArticlesList({ initialArticles, initialPage, initialTotalPages } : Props) {
    const [articles, setArticles] = useState<ArticleWithTags[]>(initialArticles)
    const [page, setPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(initialTotalPages)
    const limit = 10;
    const handleShowMore = async () => {
        const newPage = page + 1;
        setPage(newPage)
        const result = await articleAPI.getArticles({
            page: newPage,
            limit: limit,
            status: 'published'
        });
        if (result.success) {
            setArticles([...articles, ...result.data])
            setTotalPages(result.pagination.total_pages)
        }
    }
    return (
        <div className="space-y-8">
            <div className="text-2xl text-white font-bold">Latest Articles</div> 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles && articles?.length > 0 ? (
                articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                ))
            ) : (
                <div className="text-center text-neutral-300/80 py-10">
                    No articles found.
                </div>
            )}
            </div>
            {page != totalPages && (
                <div 
                    onClick={handleShowMore}
                    className="text-center text-white cursor-pointer"
                >
                    Show more
                </div>
            )}
        </div>
    )
}