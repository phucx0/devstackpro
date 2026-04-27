"use server"
import { getArticleBySlug } from "./articles.public.service";

export async function getArticleBySlugAction(slug: string) {
    return getArticleBySlug(slug);
}