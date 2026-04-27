import UserLayoutContent from "@/public/components/user/UserLayoutContent";
import { Suspense } from "react";
import UserProfileSidebarSkeleton from "@/public/components/user/UserProfileSidebarSkeleton";

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return (
    <div className="flex">
      <div className="flex-1 min-w-0">{children}</div>
      <Suspense fallback={<UserProfileSidebarSkeleton />}>
        <UserLayoutContent username={username} />
      </Suspense>
    </div>
  );
}
