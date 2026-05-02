import { createClient } from "@/lib/supabase/server";

export async function getArticles() {
    const supabase = await createClient();
    return supabase.from("articles").select(`
        *,
        user:users!articles_user_id_fkey (id, username, display_name, avatar_url, role),
        article_tags (tag:tags (id, name)),
        likes_count:article_likes (count)
    `);
}

type GetArticlesResult = Awaited<ReturnType<typeof getArticles>>;
export type RawArticle = NonNullable<GetArticlesResult["data"]>[number];