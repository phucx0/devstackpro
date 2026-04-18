import { createClient } from "@/lib/supabase/server";
import { Tag } from "@/public/lib/types";

export async function getAllTags(): Promise<Tag[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("tags")
        .select("*");

    if (error) throw error;

    return data as Tag[];
}