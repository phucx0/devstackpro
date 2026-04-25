"use server"
import { toggleArticleLike } from "./article-likes.service"

export async function ToggleLikeArticleAction(articleId: number) : Promise<{ liked: boolean }> {
    return toggleArticleLike(articleId);
}