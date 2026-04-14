import ArticlesList from "@/public/components/user/ArticlesList";
import Featured from "@/public/components/user/Featured";
import SideBar from "@/public/components/user/SideBar";
import { articleAPI } from "@/public/lib/api";
import { ArticleWithTags } from "@/public/lib/types";
import { Metadata } from "next";
import Image from "next/image";

async function fetchArticles(page: number, limit: number) {
  const data = await articleAPI.getArticles({
    page: page,
    limit: limit,
    status: 'published'
  });
  if (data.success) {
    return data.data;
  }
  return [];
}

export const metadata : Metadata = {
  title: "Dev Stack Pro",
  description: "Dev Stack Pro delivers the latest tech news, insights, and practical guides on UI/UX, frontend, AI, and modern software development.",
};


export default async  function HomePage() {
  const featuredArticles = await articleAPI.getFeaturedArticles();

  let articles: ArticleWithTags[] = []
  const data = await articleAPI.getArticles({
    page: 1,
    limit: 10,
    status: 'published'
  });
  if (data.success) articles = data.data;


  return (
    <div>
      <Featured articles={featuredArticles.data}/>
      <ArticlesList 
        initialArticles={articles} 
        initialPage={data.pagination.page || 1} 
        initialTotalPages={data.pagination.total_pages || 1}
      />
    </div>
  );
}
