import { ArticleWithTags } from '@/public/lib/types';
import { MetadataRoute } from 'next'
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function mapArticle(a: any): ArticleWithTags {
    return {
        ...a,
        username: a.user?.username ?? "",
        tags: a.article_tags?.map((x: any) => ({
            created_at: "",
            id: x.tag.id,
            name: x.tag.name,
        })) ?? [],
    };
}

export const getArticles = async (): Promise<ArticleWithTags[]> => {
    const { data: articles, error } = await supabase
        .from("articles")
        .select(`
            *,
            user:users!articles_user_id_fkey (username),
            article_tags (tag:tags (id, name))
        `)
        .eq("status", "published")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(15);

    if (error) throw error;
    return articles.map(mapArticle);
};

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