// author.actions.ts
"use server"
import { revalidateTag } from "next/cache";
import {
    insertArticle,
    updateArticle,
    deleteArticleById,
    getDashboardData,
    getArticleById,
} from "@/server/articles/articles.private.service";
import { CreateArticleRequest, UpdateArticleRequest } from "@/public/lib/types";

export async function insertArticleAction(params: CreateArticleRequest) {
    const result = await insertArticle(params);
    
    revalidateTag("articles", "default");              // home list
    revalidateTag("articles-by-username", "default"); // profile list
    
    return result;
}

export async function updateArticleAction(article: UpdateArticleRequest) {
    const result = await updateArticle(article);

    revalidateTag("articles", "default");
    revalidateTag("articles-by-username", "default");
    revalidateTag("article-slug", "default");

    return result;
}

export async function deleteArticleAction(id: number) {
    const result = await deleteArticleById(id);

    revalidateTag("articles", "default");
    revalidateTag("articles-by-username", "default");

    return result;
}

export async function getDashboardDataAction() {
    return await getDashboardData();
}

export async function getArticlesAction() {
    // return await getArticles();
}

export async function getArticleAction(id: string) {
    return await getArticleById(id);
}