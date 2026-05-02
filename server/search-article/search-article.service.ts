import { createClient } from "@/lib/supabase/server";
import { ArticlePublish } from "@/public/lib/types";
import { mapArticle } from "../articles/articles.helpers";

const ARTICLE_SELECT = `
    *,
    user:users!articles_user_id_fkey (id, username, display_name, avatar_url),
    article_tags (tag:tags (id, name)),
    likes_count:article_likes (count)
`;


export async function searchArticles(keyword?: string): Promise<ArticlePublish[]> {
    const supabase = await createClient();
    
    const { data: articles, error } = await supabase
        .from("articles")
        .select(ARTICLE_SELECT)
        .eq("status", "published")
        .ilike("title", `%${keyword}%`)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(15);

    if (error) throw error;
    return articles.map((a) => mapArticle(a));
};