import ArticlesList from "@/public/components/user/ArticlesList";
import { Metadata } from "next";
import { Suspense } from "react";
import RootLoading from "@/public/components/user/RootLoading";
import { getArticles } from "@/server/articles/articles.public.service";
import { WritePromptCard } from "@/public/components/user/WritePromptCard";

export const metadata: Metadata = {
  title: "Dev Stack Pro",
  description:
    "Dev Stack Pro delivers the latest tech news, insights, and practical guides on UI/UX, frontend, AI, and modern software development.",
};

export default async function HomePage() {
  return (
    <Suspense fallback={<RootLoading />}>
      <ArticlesSection />
    </Suspense>
  );
}

// export async function FeaturedSection() {
//   const featuredArticles = await getFeaturedArticles();
//   return <Featured articles={featuredArticles.slice(0, 3)} />;
// }

export async function ArticlesSection() {
  const articles = await getArticles();
  return (
    <div className="flex flex-col">
      <div className="my-4">
        <WritePromptCard />
      </div>
      <ArticlesList
        initialArticles={articles}
        initialPage={1}
        initialTotalPages={1}
      />
    </div>
  );
}
