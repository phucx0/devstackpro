import {
  getArticlesByUsername,
  getMyArticles,
} from "@/server/articles/articles.public.service";
import { getAuthUser } from "@/server/users/auth.service";
import { getUserByUsername } from "@/server/users/users.service";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticlesTabView from "./ArticlesTabView";

interface Props {
  username: string;
}

// ── Main Component ───────────────────────────────────────────────
export default async function AuthorProfile({ username }: Props) {
  const user = await getUserByUsername(username);
  if (!user) return notFound();

  const myData = await getAuthUser();
  const isOwner = user.id === myData?.id;

  const articles = isOwner
    ? await getMyArticles(myData.id, 15)
    : await getArticlesByUsername(username, 15);

  return (
    <div className="w-full  bg-(--noir-black) text-(--noir-white)">
      <main className="px-4 pb-8">
        <div className="flex py-4 justify-end">
          {isOwner && (
            <Link
              href={`${username}/articles/new`}
              className={`items-end text-[12px] px-4 py-[7px] rounded font-medium transition-colors duration-150 cursor-pointer bg-(--noir-accent) text-(--noir-black)`}
            >
              New post
            </Link>
          )}
        </div>
        <ArticlesTabView
          articles={articles.filter((a) => a.status === "published")}
          drafts={articles.filter((a) => a.status === "draft")}
          isOwner={isOwner}
          username={username}
        />
      </main>
    </div>
  );
}
