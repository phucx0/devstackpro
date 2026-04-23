import ArticlesList from "@/public/components/user/ArticlesList";
import Featured from "@/public/components/user/Featured";
import { Metadata } from "next";
import {
  getArticles,
  getFeaturedArticles,
} from "@/server/articles/articles.user.service";

export const metadata: Metadata = {
  title: "Dev Stack Pro",
  description:
    "Dev Stack Pro delivers the latest tech news, insights, and practical guides on UI/UX, frontend, AI, and modern software development.",
};

export default async function HomePage() {
  const articles = await getArticles();
  const featuredArticles = await getFeaturedArticles();
  return (
    <div>
      <Featured articles={featuredArticles.slice(0, 3)} />
      <ArticlesList
        initialArticles={articles}
        initialPage={1}
        initialTotalPages={1}
      />
    </div>
  );
}
