import { createClient } from "@/lib/supabase/server";
import {
    ArticlePublish,
    CreateArticleRequest,
    DashboardData,
    DashboardMetrics,
    RecentActivity,
    TrafficDataPoint,
    UpdateArticleRequest,
} from "@/public/lib/types";

// ==================================
// Service này sử dụng cho user đã đăng nhập 
// ==================================


// Helper lấy user hiện tại, throw nếu chưa auth
async function getAuthUser(supabase: Awaited<ReturnType<typeof createClient>>) {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");
    return user;
}

// Helper tái sử dụng để map raw data → ArticlePublish
function mapArticle(a: any): ArticlePublish {
    return {
        ...a,
        user: {
            id:           a.user?.id           ?? "",
            username:     a.user?.username     ?? "",
            display_name: a.user?.display_name ?? "",
            avatar_url:   a.user?.avatar_url   ?? "",
            role:         a.user?.role         ?? "user",
        },
        tags: a.article_tags?.map((x: any) => ({
            id:   x.tag.id,
            name: x.tag.name,
        })) ?? [],
        likes_count: a.likes_count?.[0]?.count ?? 0,
    };
}

const ARTICLE_SELECT = `
    *,
    user:users!articles_user_id_fkey (id, username, display_name, avatar_url),
    article_tags (tag:tags (id, name)),
    likes_count:article_likes (count)
`;


// Create article 
export async function createArticle(params: CreateArticleRequest): Promise<boolean> {
    const supabase = await createClient();
    const user = await getAuthUser(supabase);

    const { title, slug, description, content_md, thumbnail, status = "draft", tags = [] } = params;

    // 1. Insert article
    const { data: article, error } = await supabase
        .from("articles")
        .insert({
            user_id: user.id,
            title,
            slug,
            description,
            content_md,
            thumbnail,
            status,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })

    if (error) {
        console.error("Supabase Create Error:", error);
        throw error;
    }

    // 2. Insert tags nếu có
    // if (tags.length > 0) {
    //     const tagRows = tags.map(tag => ({
    //         article_id: article.id,
    //         tag_id: tag.id,
    //     }));

    //     const { error: tagError } = await supabase
    //         .from("article_tags")
    //         .insert(tagRows);

    //     if (tagError) throw tagError;
    // }

    return true
}

export async function getArticle(article_id: number): Promise<ArticlePublish> {
    const supabase = await createClient();

    let query = supabase
        .from("articles")
        .select(ARTICLE_SELECT)
        .eq("id", Number(article_id))
        // .eq("status", "published");


    const { data: article, error } = await query.single();
    if (error) throw error;

    // Chỉ tăng view cho guest
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        await supabase.rpc("increase_article_view", { article_id: article.id });
    }

    return mapArticle(article);
}

export async function getArticles(): Promise<ArticlePublish[]> {
    const supabase = await createClient();
    const user = await getAuthUser(supabase);

    const { data: articles, error } = await supabase
        .from("articles")
        .select(ARTICLE_SELECT)
        // .eq("status", "published")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

    if (error) throw error;
    return articles.map(mapArticle);
}

export async function updateArticle(params: { article: UpdateArticleRequest }) {
    const supabase = await createClient();
    await getAuthUser(supabase);
    const { article } = params;

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
        .single();

    if (error) {
        console.error("Supabase Update Error:", error);
        throw error;
    }
    if (!data) throw new Error(`Không tìm thấy bài viết với id = ${article.id}`);

    return data;
}

export async function deleteArticleById(id: number) {
    const supabase = await createClient();
    const user = await getAuthUser(supabase);

    // Verify ownership
    const { data: article, error: fetchError } = await supabase
        .from("articles")
        .select("id")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    if (fetchError || !article) throw new Error("Unauthorized or not found");

    // Soft delete
    const { error } = await supabase
        .from("articles")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

    if (error) throw error;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
    const supabase = await createClient();
    const user = await getAuthUser(supabase); // ✅ chỉ lấy data của user này

    const [
        { count: totalPosts },
        { count: publishedPosts },
        { count: draftPosts },
        viewsResult,
    ] = await Promise.all([
        supabase.from("articles").select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .is("deleted_at", null),
        supabase.from("articles").select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("status", "published")
            .is("deleted_at", null),
        supabase.from("articles").select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("status", "draft")
            .is("deleted_at", null),
        supabase.from("articles").select("views")
            .eq("user_id", user.id)
            .is("deleted_at", null),
    ]);

    const totalViews = (viewsResult.data ?? []).reduce(
        (sum, row) => sum + (row.views ?? 0), 0
    );

    return {
        totalPosts: totalPosts ?? 0,
        totalViews,
        publishedPosts: publishedPosts ?? 0,
        draftPosts: draftPosts ?? 0,
    };
}

export async function getMonthlyTraffic(): Promise<TrafficDataPoint[]> {
    const supabase = await createClient();
    const user = await getAuthUser(supabase); // ✅

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

    const { data, error } = await supabase
        .from("articles")
        .select("created_at, views")
        .eq("user_id", user.id)
        .gte("created_at", startOfMonth)
        .lte("created_at", endOfMonth)
        .is("deleted_at", null)
        .eq("status", "published");

    if (error || !data) return [];

    const dayMap: Record<number, number> = {};
    for (const row of data) {
        const day = new Date(row.created_at ?? "").getDate();
        dayMap[day] = (dayMap[day] ?? 0) + (row.views ?? 0);
    }

    return Object.entries(dayMap)
        .map(([day, views]) => ({ day: Number(day), views }))
        .sort((a, b) => a.day - b.day);
}

export async function getRecentActivities(limit = 10): Promise<RecentActivity[]> {
    const supabase = await createClient();
    const user = await getAuthUser(supabase); // ✅

    const { data, error } = await supabase
        .from("articles")
        .select("id, title, slug, status, created_at, updated_at, views")
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .order("updated_at", { ascending: false })
        .limit(limit);

    if (error) {
        console.error("[getRecentActivities]", error.message);
        return [];
    }
    return (data ?? []) as RecentActivity[];
}

export async function getDashboardData(): Promise<DashboardData> {
    const [metrics, trafficData, recentActivities] = await Promise.all([
        getDashboardMetrics(),
        getMonthlyTraffic(),
        getRecentActivities(5),
    ]);
    return { metrics, trafficData, recentActivities };
}