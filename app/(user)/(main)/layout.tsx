import RightSidebar from "@/public/components/user/SideBar/RightSideBar";
import { Suspense } from "react";
import RightSidebarSkeleton from "@/public/components/user/SideBar/RightSideBarSkeletion";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full">
      <div className="flex-1 min-w-0">
        <div className="mx-auto w-full max-w-3xl">{children}</div>
      </div>
      <Suspense fallback={<RightSidebarSkeleton />}>
        <RightSidebar />
      </Suspense>
    </div>
  );
}
