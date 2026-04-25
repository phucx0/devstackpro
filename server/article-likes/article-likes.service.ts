import { createClient } from "@/lib/supabase/server";
import { getUser } from "../users/users.service";

// Check if user has liked the article 
export async function isHasUserLikeArticle(articleId: number): Promise<boolean> {
    const supabase = await createClient();
    const authUser = await getUser();

    if (!authUser?.id) return false;

    const { data, error } = await supabase
        .from("article_likes")
        .select("id")
        .eq("article_id", articleId)
        .eq("user_id", authUser.id)
        .maybeSingle();

    if (error) throw error;

    return !!data;
}

export async function toggleArticleLike(articleId: number) : Promise<{ liked: boolean }> {
    const supabase = await createClient()
    const authUser = await getUser();

    if(!authUser) throw new Error("Unauthorized");
    
    const {data: existing, error: error_existing} = await supabase
        .from("article_likes")
        .select("article_id")
        .eq("article_id", articleId)
        .eq("user_id", authUser?.id)
        .maybeSingle()

    if(error_existing) throw error_existing;
    
    // If existed, delete row (unlike)
    if(existing) {
        const { error } = await supabase
            .from("article_likes")
            .delete()
            .eq("article_id", articleId)
            .eq("user_id", authUser.id)
        
        if(error) throw error;

        return { liked: false }; // <-- unlike
    }

    // insert if like 
    const {error} =  await supabase
        .from("article_likes")
        .insert({
            "article_id": articleId,
            "user_id": authUser?.id
        })
    
    if(error) throw error;
    
    return { liked: true }; // <-- like
}   
