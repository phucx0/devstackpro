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
import * as ArticleRepo from "@/server/articles/articles.repository"
import { getAuthUser } from "@/server/users/auth.service";
import { getLikedSet, mapArticle } from "@/server/articles/articles.helpers";



/**
 * Lấy danh sách bài viết của chính user kèm Draft  
 * 
 * @param userId 
 * @param limit - số lượng bài viết đã trả về 
 * @returns Danh sách bài viết (publish | draft)
 */
export async function getMyArticles(userId: string, limit: number): Promise<ArticlePublish[]> {
    const raw = await ArticleRepo.getArticlesByUserId({userId: userId, limit, includeDraft: true});  
    const likedSet = await getLikedSet(raw.map(a => a.id), userId)
    return raw.map(a => ({ ...mapArticle(a), is_liked: likedSet.has(a.id) }));
}

/**
 * Tạo bài viết mới với status mặc định là draft
 * 
 * @throws Error nếu user chưa đăng nhập
 */
export async function insertArticle(params: CreateArticleRequest): Promise<boolean> {
    const db = await createClient()
    const user = await getAuthUser();
    if(!user) return false;
    const { title, slug, description, content_md, thumbnail, status = "draft", tags = [] } = params;
    await ArticleRepo.insertArticle({
        userId: user.id,
        title: title,
        slug: slug,
        thumbnail: thumbnail || "",
        description: description || "",
        content_md: content_md || "",
        status: status,
        db
    })
    return true
}


/**
 * Lấy bài viết theo id, chỉ dành cho author (bao gồm cả draft)
 * Tăng view nếu là guest
 * 
 * @throws Error nếu user chưa đăng nhập hoặc không tìm thấy bài viết
 */
export async function getArticleById(articleId: string): Promise<ArticlePublish | null> {
    const user = await getAuthUser();
    if(!user) return null;
    const article = await ArticleRepo.getArticleById({
        articleId: articleId,
        userId: user.id
    })
    return mapArticle(article);
}


/**
 * Cập nhật bài viết, chỉ author mới có quyền sửa
 * 
 * @throws Error nếu user chưa đăng nhập hoặc không có quyền
 */
export async function updateArticle(article: UpdateArticleRequest ) {
    const db = await createClient();
    const user = await getAuthUser();
    if(!user) throw new Error("Unauthorized");
    const data = await ArticleRepo.updateArticle({
        article: article,
        userId: user.id,
        db
    })
    return data;
}


/**
 * Xóa mềm bài viết theo id, chỉ author mới có quyền xóa
 * 
 * @throws Error nếu id không hợp lệ hoặc user không có quyền
 */
export async function deleteArticleById(id: number) {
    if(!id) throw new Error("id is required");
    const db = await createClient();
    const user = await getAuthUser();
    if(!user) throw new Error("Unauthorized");
    await ArticleRepo.deleteArticle({
        id: id,
        userId: user.id,
        db:db
    });
}


export async function getDashboardMetrics(): Promise<DashboardMetrics> {
    const supabase = await createClient();
    const user = await getAuthUser();
    if(!user) throw new Error("Unauthorized");
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
    const user = await getAuthUser(); // ✅
    if(!user) throw new Error("Unauthorized");
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
    const user = await getAuthUser();
    if(!user) throw new Error("Unauthorized");
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