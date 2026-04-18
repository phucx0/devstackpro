import ArticlesList from "@/public/components/user/ArticlesList";
import { ArticleWithTags, Tag } from "@/public/lib/types";
import { getArticles } from "@/services/articles.user.service";

export default async function ArticlesPage() {
  const articles = await getArticles();
  return (
    <ArticlesList
      initialArticles={articles}
      initialPage={1}
      initialTotalPages={1}
    />
  );
}
