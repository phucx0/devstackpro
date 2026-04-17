import { createClient } from "@/lib/supabase/client";

export async function getUser() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    const { data: existing } = await supabase
        .from("users")
        .select("*")
        .eq("id", String(user?.id))
        .single();

    return existing;
}