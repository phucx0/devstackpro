import { createClient } from "@/lib/supabase/client";

// For user
export async function signIn(email: string, password: string) {
    const supabase = await createClient()
    const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) {
        throw error
    }
    if (!data.user) throw new Error("No user returned");

    const { data: profile, error: profileError, status } = await supabase
        .from("users")        
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle();

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
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { username, display_name }
        }
    })
    if (error) throw error
    return data
}