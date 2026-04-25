import { createClient } from "@/lib/supabase/server";
import { UserPublish } from "@/public/lib/types";
import { cache } from "react";

export const getUser = cache( async(): Promise<UserPublish | null> => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: existing, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", String(user?.id))
        .maybeSingle();

    if (error) {
        console.error("getUser error:", error);
        return null;
    }

    return existing;
});

export async function getUserByUsername(username: string): Promise<UserPublish | null> {
    if (!username || username.trim() === "") {
        throw new Error("Invalid username");
    }

    const supabase = await createClient();
    const { data, error } = await supabase
        .from("users")
        .select("id, username, display_name, avatar_url, created_at, email, bio, updated_at")
        .eq("username", username)
        .maybeSingle();

    if (error) {
        console.error("getUser error:", error);
        throw error;
    }
    return data;
}