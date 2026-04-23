import NotFound from "@/public/components/NotFound";
import Header from "@/public/components/user/Header";
import LeftSideBar from "@/public/components/user/LeftSideBar";
import RightSidebar from "@/public/components/user/RightSideBar";
import { getUserByUsername } from "@/server/users/users.service";

export default async function UserLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  if (!username || username.trim() === "") return <NotFound />;
  const user = await getUserByUsername(username);
  if (!user) return <NotFound />;

  return (
    <>
      <Header />
      <div className="flex items-start justify-between w-full">
        <LeftSideBar user={user} />
        {children}
        <RightSidebar />
      </div>
    </>
  );
}
