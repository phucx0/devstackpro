"use server"
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from 'next/cache'

// For user
export async function signIn(email: string, password: string) {
    const supabase = await createClient()
    const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) throw error
    if (!data.user) throw new Error("No user returned");

    const { data: profile, error: profileError, status } = await supabase
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