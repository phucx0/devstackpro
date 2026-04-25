import LeftSideBarSkeleton from "@/public/components/user/LeftSideBarSkeleton";
import UserLayoutContent from "@/public/components/user/UserLayoutContent";
import { Suspense } from "react";

export default async function UserLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return (
    <Suspense
      fallback={
        <div className="flex items-start justify-between w-full">
          <LeftSideBarSkeleton />
        </div>
      }
    >
      <UserLayoutContent username={username}>{children}</UserLayoutContent>
    </Suspense>
  );
}
