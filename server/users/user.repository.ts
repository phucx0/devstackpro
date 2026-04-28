import { createClient } from "@/lib/supabase/server";

/**
 * Lấy thông tin chi tiết user chưa bị xóa theo user_id
 * 
 * @param params.userId - user_id của user 
 * @returns Thông tin user nếu có, ngược lại trả về null 
 * 
 * @throws Error nếu query database thất bại   
 */
export async function getUserById(params: { userId: string}) {
    const db = await createClient();
    const { userId } = params;

    const { data, error } = await db
        .from("users")
        .select("id, username, display_name, avatar_url, created_at, email, bio, updated_at, role")
        .eq("id", userId)
        .is("deleted_at", null)
        .maybeSingle();

    if (error) throw error;
    return data;
}

/**
 * Lấy thông tin chi tiết user chưa bị xóa theo username
 * 
 * @param username - username của user 
 * @returns Thông tin user nếu có, ngược lại trả về null 
 * 
 * @throws Error nếu query database thất bại   
 */
export async function getUserByUsername(username: string) {
    const db = await createClient();

    const { data, error } = await db
        .from("users")
        .select("id, username, display_name, avatar_url, created_at, email, bio, updated_at, role")
        .eq("username", username)
        .is("deleted_at", null)
        .maybeSingle();

    if (error) throw error;
    return data;
}