import {
  getArticlesByUsername,
  getMyArticles,
} from "@/server/articles/articles.public.service";
import { getAuthUser } from "@/server/users/auth.service";
import { getUserByUsername } from "@/server/users/users.service";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticlesList from "./ArticlesList";

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
        {articles.length > 0 ? (
          <ArticlesList
            initialArticles={articles}
            initialPage={1}
            initialTotalPages={1}
          />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "96px 0",
              gap: "16px",
            }}
          >
            <span
              style={{
                fontSize: "56px",
                fontWeight: 300,
                color: "rgba(255,255,255,0.1)",
                fontFamily: "var(--font-display)",
              }}
            >
              ∅
            </span>
            <p style={{ fontSize: "13px", color: "var(--noir-muted)" }}>
              Chưa có bài viết nào.
            </p>
            {isOwner && (
              <Link
                href={`${username}/articles/new`}
                style={{
                  marginTop: "8px",
                  fontSize: "12px",
                  padding: "8px 18px",
                  borderRadius: "4px",
                  background: "var(--noir-accent)",
                  color: "var(--noir-black)",
                  fontFamily: "var(--font-body)",
                  border: "none",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Tạo bài viết đầu tiên
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
