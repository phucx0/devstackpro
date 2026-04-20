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
        .single();

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
        .select("*")
        .eq("username", username)
        .single();

    if (error) {
        console.error("getUser error:", error);
        throw error;
    }
    return data;
}