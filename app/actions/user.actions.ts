"use server"
import { createClient } from "@/lib/supabase/server";
import { UpdateInfoUser } from "@/public/lib/types";

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