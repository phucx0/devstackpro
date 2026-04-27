import ArticlesList from "@/public/components/user/ArticlesList";
import RootLoading from "@/public/components/user/RootLoading";
import { getFollowingFeed } from "@/server/articles/articles.public.service";
import { getAuthUser } from "@/server/users/auth.service";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function FollowingPage() {
  return (
    <Suspense fallback={<RootLoading />}>
      <FollowingSection />
    </Suspense>
  );
}

async function FollowingSection() {
  const authUser = await getAuthUser();
  if (!authUser) {
    redirect(`/sign-in?callbackUrl=/following`);
  }
  const articles = await getFollowingFeed(authUser.id);
  return (
    <ArticlesList
      initialArticles={articles}
      initialPage={1}
      initialTotalPages={1}
    />
  );
}
