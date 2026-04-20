import { createClient } from "@/lib/supabase/server";
import NotFound from "@/public/components/NotFound";
import { getArticlesByUsername } from "@/services/articles.user.service";
import AuthorClient from "./AuthorClient";
import { getUser, getUserByUsername } from "@/services/users.service";

type Props = {
  params: Promise<{ username?: string }>;
};

export default async function AuthorPage({ params }: Props) {
  const { username } = await params;

  if (!username || username.trim() === "") return <NotFound />;

  const [user, myData] = await Promise.all([
    // Thông tin của username
    getUserByUsername(username),
    // Thông tin của user hiện tại
    getUser(),
  ]);

  if (!user) return <NotFound />;
  const isOwner = user.id === myData?.id;

  const articles = await getArticlesByUsername(username);

  return <AuthorClient profile={user} articles={articles} isOwner={isOwner} />;
}
