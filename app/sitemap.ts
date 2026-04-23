import { ArticleWithTags } from '@/public/lib/types';
import { getArticles } from '@/services/articles.user.service';
import { MetadataRoute } from 'next'

// Buộc route này luôn render động
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.devstackpro.cloud'
    const now = new Date()

    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: now, changeFrequency: 'yearly', priority: 1 },
        { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    ]

    try {
        const articles = await getArticles();
        if (!articles || articles.length === 0) {
            return staticPages;
        }

        const postPages: MetadataRoute.Sitemap = articles.map((article: ArticleWithTags) => ({
            url: `${baseUrl}/${article.username}/articles/${article.slug}`,
            lastModified: article.updated_at ? new Date(article.updated_at) : now,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }))

        return [...staticPages, ...postPages]
    } catch (error) {
        console.error('Error fetching posts for sitemap:', error)
        return staticPages
    }
}