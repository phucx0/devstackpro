import { notFound } from "next/navigation";
import { getUserByUsername } from "@/server/users/users.service";
import { getUserFollowCounts } from "@/server/follows/follows.service";
import UserProfileSidebar from "./UserProfileSidebar";

// Layout -> UserLayoutContent
// UserLayoutContent nơi xử lý Server truyền dữ liệu cho components
export default async function UserLayoutContent({
  username,
}: {
  username: string;
}) {
  if (!username || username === "") return notFound();

  const user = await getUserByUsername(username);
  if (!user) return notFound();

  const { followerCount, followingCount } = await getUserFollowCounts(user.id);

  return (
    <UserProfileSidebar
      user={user}
      followerCount={followerCount}
      followingCount={followingCount}
    />
  );
}
