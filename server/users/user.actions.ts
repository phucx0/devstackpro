"use server"
import { createClient } from "@/lib/supabase/server";
import { UpdateInfoUser } from "@/public/lib/types";
import { signIn, signOut, signUp } from "./auth.service";
import { getUser } from "./users.service";

export async function signInAction(email: string, password: string) {
    return signIn(email, password);
}

export async function signUpAction(username: string, password: string, display_name: string, email: string) {
    return signUp(username, password, display_name, email);
}

export async function signOutAction() {
    return signOut();
}

export async function getUserAction() {
    return getUser();
}

export async function updateAvatar(fileKey: string): Promise<boolean> {
    if(!fileKey) throw new Error("Not found image");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from("users")
        .update({ 
            avatar_url: fileKey,
            updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
    
    if (error) throw error;

    return true;
}

export async function updateInfo( params : UpdateInfoUser): Promise<boolean> {
    if(!params) throw new Error("Not found info user");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from("users")
        .update({ 
            display_name: params.display_name,
            bio: params.bio,
            updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
    
    if (error) throw error;

    return true;
}