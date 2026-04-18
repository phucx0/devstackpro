import { ArticleWithTags } from '@/public/lib/types';
import { getArticles } from '@/services/articles.user.service';
import { MetadataRoute } from 'next'

// Buộc route này luôn render động
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.devstackpro.cloud'

    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'yearly', priority: 1 },
        { url: `${baseUrl}/articles`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ]

    try {
        const articles = await getArticles();
        if (!articles || articles.length === 0) {
            return staticPages;
        }

        const postPages: MetadataRoute.Sitemap = articles.map((article: ArticleWithTags) => ({
            url: `${baseUrl}/articles/${article.slug}`,
            lastModified: article.updated_at ? new Date(article.updated_at) : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }))

        return [...staticPages, ...postPages]
    } catch (error) {
        console.error('Error fetching posts for sitemap:', error)
        return staticPages
    }
}