import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from 'next/cache'
import { redirect } from "next/navigation";


/**
 * Lấy thông tin chi tiết user hiện tại nếu session tồn tại.
 * @returns Thông tin chi tiết user nếu có, ngược lại trả về null 
 */
export async function getAuthUser() {
    const db = await createClient();
    const { data : {user}, error } = await db.auth.getUser();
    if (error) return null;
    return user;
}

/**
 * Đăng nhập tài khoản user với email và mật khẩu 
 * @param email 
 * @param password 
 * @returns 
 */
export async function signIn(email: string, password: string) {
    const supabase = await createClient()
    const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) throw error
    if (!data.user) throw new Error("No user returned");

    const { data: profile, error: profileError } = await supabase
        .from("users")        
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle();
    if (profileError) {
        console.error("Profile fetch error:", profileError)
        // Không throw để không làm hỏng login, nhưng nên log
    }

    // Refresh path để RSC cập nhật session
    revalidatePath('/', 'layout')

    return {
        user: profile,          
        session: data.session,
        token: data.session?.access_token,
    };
}   


/**
 * 
 * @param username 
 * @param password 
 * @param display_name 
 * @param email 
 * @returns 
 */
export async function signUp(
    username: string,
    password: string,
    display_name: string,
    email: string
) {
    const supabase = await createClient()
    const avatars = [
        "man-3d-13078581.webp",
        "man-3d-13078591.webp",
        "man-3d-13078601.png",
        "man-3d-13078612.webp"
    ]

    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { 
                username, 
                display_name,
                avatar_url: randomAvatar
            }
        }
    })
    if (error) throw error

    revalidatePath('/', 'layout')
    
    return data
}


export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
}


export async function signInWithGoogle() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`
        },
    });

    if (error) throw error;
    if (data.url) redirect(data.url);
}