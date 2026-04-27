// app/admin/articles/[id]/update/page.tsx
import { getArticleAction } from "@/server/articles/articles.private.action";
import { UpdateArticleForm } from "../components/UpdateArticleForm";
import { notFound } from "next/navigation";

export default async function UpdateArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getArticleAction(id);

  if (!result) notFound();

  const article = {
    id: result.id,
    title: result.title,
    slug: result.slug,
    content_md: result.content_md ?? undefined,
    description: result.description ?? undefined,
    status: (result.status as "draft" | "published") ?? "draft",
    tags: result.tags ?? [],
    thumbnail: result.thumbnail ?? undefined,
  };

  return <UpdateArticleForm initialArticle={article} />;
}
