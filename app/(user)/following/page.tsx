import ArticlesList from "@/public/components/user/ArticlesList";
import { getFollowingFeed } from "@/server/articles/articles.public.service";
import { getAuthUser } from "@/server/users/auth.service";
import { notFound } from "next/navigation";

export default async function FollowingPage() {
  const authUser = await getAuthUser();
  if (!authUser) notFound();
  const articles = await getFollowingFeed(authUser.id);
  return (
    <ArticlesList
      initialArticles={articles}
      initialPage={1}
      initialTotalPages={1}
    />
  );
}
