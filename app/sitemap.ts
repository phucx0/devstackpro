import { articleAPI } from '@/public/lib/api'
import { ArticleWithTags } from '@/public/lib/types';
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.devstackpro.cloud'

    // Các trang tĩnh
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${baseUrl}/articles`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ]

    // Lấy các bài viết động từ API/database
    try {
        const articles = await articleAPI.getArticles({
            page: 1,
            limit: 100,
            status: 'published'
        });
        if (!articles?.data || articles.data.length === 0) {
            return staticPages;
        }
        const postPages: MetadataRoute.Sitemap = articles.data.map((article: ArticleWithTags) => ({
            url: `${baseUrl}/articles/${article.slug}`,
            lastModified: new Date(article.updated_at ?? ""),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }))

        return [...staticPages, ...postPages]
    } catch (error) {
        console.error('Error fetching posts for sitemap:', error)
        return staticPages
    }
}