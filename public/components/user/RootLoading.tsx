import ArticleCardSkeleton from "@/public/components/user/ArticleCardSkeleton";

export default function RootLoading() {
  return (
    <div className="w-full">
      {Array.from({ length: 8 }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}
