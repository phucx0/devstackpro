import ArticlesList from "@/public/components/user/ArticlesList";
import Featured from "@/public/components/user/Featured";
import { Metadata } from "next";
import {
  getArticles,
  getFeaturedArticles,
} from "@/server/articles/articles.user.service";
import { Suspense } from "react";
import FeaturedSkeleton from "@/public/components/user/FeaturedSkeleton";
import ArticlesListSkeleton from "@/public/components/user/ArticlesListSkeleton";

export const metadata: Metadata = {
  title: "Dev Stack Pro",
  description:
    "Dev Stack Pro delivers the latest tech news, insights, and practical guides on UI/UX, frontend, AI, and modern software development.",
};

export default async function HomePage() {
  return (
    <div>
      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedSection />
      </Suspense>
      <Suspense fallback={<ArticlesListSkeleton />}>
        <ArticlesSection />
      </Suspense>
    </div>
  );
}

export async function FeaturedSection() {
  const featuredArticles = await getFeaturedArticles();
  return <Featured articles={featuredArticles.slice(0, 3)} />;
}

export async function ArticlesSection() {
  const articles = await getArticles();
  return (
    <ArticlesList
      initialArticles={articles}
      initialPage={1}
      initialTotalPages={1}
    />
  );
}
