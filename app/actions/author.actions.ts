"use server"
import {
    createArticle,
    updateArticle,
    deleteArticleById,
    getDashboardData,
    getArticle,
    getArticles,
} from "@/services/articles.author.service";
import { ArticleWithTags, CreateArticleRequest, UpdateArticleRequest } from "@/public/lib/types";

export async function createArticleAction(params: CreateArticleRequest) {
    return await createArticle(params);
}

export async function updateArticleAction(article: UpdateArticleRequest) {
    return await updateArticle({ article });
}

export async function deleteArticleAction(id: number) {
    return await deleteArticleById(id);
}

export async function getDashboardDataAction() {
    return await getDashboardData();
}

export async function getArticlesAction() {
    return await getArticles();
}

export async function getArticleAction(id: number) {
    return await getArticle(id);
}
