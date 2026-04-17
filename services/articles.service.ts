import { createClient } from "@/lib/supabase/client";
import { ArticleWithTags, DashboardData, DashboardMetrics, RecentActivity, TrafficDataPoint } from "@/public/lib/types";

// Get 1 article with `ArticleWithTags` type 
export async function getArticle(params: {
    slug?: string;
    article_id?: number;
}): Promise<ArticleWithTags> {
    const supabase = await createClient();
    const { slug, article_id } = params;
    let query = supabase
        .from("articles")
        .select(`
            *,
            user:users (id, username, display_name, avatar_url),
            article_tags (tag:tags (id, name))    
        `)
        .eq("status", "published")

    if (slug) {
        query = query.eq("slug", slug)
    }

    if (article_id) {
        query = query.eq("id", Number(article_id))
    }
    const { data: article, error } = await query
        .order("created_at", { ascending: false })
        .single()


    if (error) throw error

    const _article : ArticleWithTags = {
        ...article,
        username: article.user?.username ?? "",
        user_id: String(article.user?.id) ,
        display_name: article.user?.display_name ?? "",
        avatar_url: article.user?.avatar_url ?? "",
        tags: article.article_tags?.map(x => ({
            created_at: "",
            id: x.tag.id,
            name: x.tag.name
        })) ?? []
    }
    return _article;
}

// Get all articles with `ArticleWithTags[]` type
export async function getArticles(keyword?: string): Promise<ArticleWithTags[]> {
    const supabase = await createClient();
    let query = supabase
        .from("articles")
        .select(`
            *,
            user:users (id, username, display_name, avatar_url),
            article_tags (tag:tags (id, name))    
        `)
        .eq("status", "published")

    if (keyword) {
        query = query.like("title", keyword)
    }

    const { data: articles, error } = await query
        .order("created_at", { ascending: false })
        .limit(10);
    
    if (error) throw error
    const _articles : ArticleWithTags[] = articles.map((a) => {
        return {
            ...a,
            username: a.user?.username ?? "",
            user_id: String(a.user?.id),
            display_name: a.user?.display_name ?? "",
            avatar_url: a.user?.avatar_url ?? "",
            tags: a.article_tags?.map(x => ({
                created_at: "",
                id: x.tag.id,
                name: x.tag.name
            })) ?? []
        }   
    });
    return _articles;
}

// Get all articles with `ArticleWithTags[]` type by User Id
export async function getAllArticleByUserId(user_id: string): Promise<ArticleWithTags[]> {
    const supabase = await createClient();
    let query = supabase
        .from("articles")
        .select(`
            *,
            user:users (id, username, display_name, avatar_url),
            article_tags (tag:tags (id, name))    
        `)
        .eq("status", "published")
        .eq("user_id", user_id)

    const { data: articles, error } = await query
        .order("created_at", { ascending: false })
        .limit(10);
    
    if (error) throw error
    const _articles : ArticleWithTags[] = articles.map((a) => {
        return {
            ...a,
            username: a.user?.username ?? "",
            user_id: String(a.user?.id),
            display_name: a.user?.display_name ?? "",
            avatar_url: a.user?.avatar_url ?? "",
            tags: a.article_tags?.map(x => ({
                created_at: "",
                id: x.tag.id,
                name: x.tag.name
            })) ?? []
        }   
    });
    return _articles;
}


export async function updateArticle(params: {
    article: ArticleWithTags
}) {
    const supabase = await createClient();
    const {article} = params

    // 1. update article (chỉ field thuộc bảng articles)
    const { data, error } = await supabase
        .from("articles")
        .update({
            title: article.title,
            slug: article.slug,
            description: article.description,
            content_md: article.content_md,
            thumbnail: article.thumbnail,
            status: article.status,
            updated_at: new Date().toISOString(),
        })
        .eq("id", article.id)
        .select()
        .single()

    if (error) {
        console.error("Supabase Update Error:", error);
        throw error;
    }

    if (!data) {
        throw new Error(`Không tìm thấy bài viết với id = ${article.id}`);
    }

    // 2. update tags (many-to-many)
    // if (article.tags) {
    //     // xóa tag cũ
    //     await supabase
    //         .from("article_tags")
    //         .delete()
    //         .eq("article_id", article.id);

    //     // insert lại
    //     const tagRows = article.tags.map(tag => ({
    //         article_id: article.id,
    //         tag_id: tag.id,
    //     }));

    //     const { error: tagError } = await supabase
    //         .from("article_tags")
    //         .insert(tagRows);

    //     if (tagError) throw tagError;
    // }

    return data;
}


export async function deleteArticleById(id: number) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("articles")
        .update({
            deleted_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (error) throw error;
}


// ─── DASHBOARD ───────────────────────────────────────

/** Tổng hợp metrics cho dashboard */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
    const supabase = await createClient()

    const [{ count: totalPosts }, { count: publishedPosts }, { count: draftPosts }, viewsResult] =
        await Promise.all([
            supabase
                .from("articles")
                .select("*", { count: "exact", head: true })
                .is("deleted_at", null),
            supabase
                .from("articles")
                .select("*", { count: "exact", head: true })
                .eq("status", "published")
                .is("deleted_at", null),
            supabase
                .from("articles")
                .select("*", { count: "exact", head: true })
                .eq("status", "draft")
                .is("deleted_at", null),
            supabase
                .from("articles")
                .select("views")
                .is("deleted_at", null),
        ])

    const totalViews = (viewsResult.data ?? []).reduce(
        (sum, row) => sum + (row.views ?? 0),
        0,
    )

    return {
        totalPosts: totalPosts ?? 0,
        totalViews,
        publishedPosts: publishedPosts ?? 0,
        draftPosts: draftPosts ?? 0,
    }
}

/**
 * Traffic theo ngày trong tháng hiện tại.
 * Group by DAY(created_at) — dùng Postgres date_trunc qua rpc hoặc
 * tính phía client nếu không có RPC.
 */
export async function getMonthlyTraffic(): Promise<TrafficDataPoint[]> {
    const supabase = await createClient()

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

    const { data, error } = await supabase
        .from("articles")
        .select("created_at, views")
        .gte("created_at", startOfMonth)
        .lte("created_at", endOfMonth)
        .is("deleted_at", null)
        .eq("status", "published")

    if (error || !data) return []

    // Gộp views theo ngày trong tháng
    const dayMap: Record<number, number> = {}
    for (const row of data) {
        const day = new Date(row.created_at ?? "").getDate()
        dayMap[day] = (dayMap[day] ?? 0) + (row.views ?? 0)
    }

    return Object.entries(dayMap)
        .map(([day, views]) => ({ day: Number(day), views }))
        .sort((a, b) => a.day - b.day)
}

/** Hoạt động gần đây — 10 bài viết mới nhất */
export async function getRecentActivities(limit = 10): Promise<RecentActivity[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("articles")
        .select("id, title, slug, status, created_at, updated_at, views")
        .is("deleted_at", null)
        .order("updated_at", { ascending: false })
        .limit(limit)

    if (error) {
        console.error("[getRecentActivities]", error.message)
        return []
    }
    return (data ?? []) as RecentActivity[]
}

/** Lấy toàn bộ dữ liệu dashboard trong một lần gọi */
export async function getDashboardData(): Promise<DashboardData> {
    const [metrics, trafficData, recentActivities] = await Promise.all([
        getDashboardMetrics(),
        getMonthlyTraffic(),
        getRecentActivities(5),
    ])

    return { metrics, trafficData, recentActivities }
}