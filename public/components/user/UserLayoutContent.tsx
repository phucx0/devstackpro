import React from "react";
import { notFound } from "next/navigation";
import { getUserByUsername } from "@/server/users/users.service";
import { getUserFollowCounts } from "@/server/follows/follows.service";
import LeftSideBar from "./LeftSideBar";

// Layout -> UserLayoutContent
// UserLayoutContent nơi xử lý Server truyền dữ liệu cho components
export default async function UserLayoutContent({
  children,
  username,
}: {
  children: React.ReactNode;
  username: string;
}) {
  if (!username || username === "") return notFound();

  const user = await getUserByUsername(username);
  if (!user) return notFound();

  const { followerCount, followingCount } = await getUserFollowCounts(user.id);

  return (
    <div className="flex items-start justify-between w-full">
      <LeftSideBar
        user={user}
        followerCount={followerCount}
        followingCount={followingCount}
      />
      {children}
    </div>
  );
}
