import ArticlesList from "@/public/components/user/ArticlesList";
import { articleAPI } from "@/public/lib/api";
import { ArticleWithTags } from "@/public/lib/types";

export default async function ArticlesPage() {
    const data = await articleAPI.getArticles({
        page: 1,
        limit: 10,
        status: 'published'
    });

    const articles: ArticleWithTags[] = data.data;
    return (
        <ArticlesList 
            initialArticles={articles} 
            initialPage={data.pagination.page || 1} 
            initialTotalPages={data.pagination.total_pages || 1}
        />
    )
}