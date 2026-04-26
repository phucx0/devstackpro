import ArticlesList from "@/public/components/user/ArticlesList";
import Featured from "@/public/components/user/Featured";
import { Metadata } from "next";
import {
  getArticles,
  getFeaturedArticles,
} from "@/server/articles/articles.user.service";
import { Suspense } from "react";
import RightSidebar from "@/public/components/user/SideBar/RightSideBar";
import RootLoading from "@/public/components/user/RootLoading";

export const metadata: Metadata = {
  title: "Dev Stack Pro",
  description:
    "Dev Stack Pro delivers the latest tech news, insights, and practical guides on UI/UX, frontend, AI, and modern software development.",
};

export default async function HomePage() {
  return (
    <div className="flex items-start">
      <Suspense fallback={<RootLoading />}>
        <ArticlesSection />
        <RightSidebar />
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
