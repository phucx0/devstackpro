import NotFound from "@/public/components/NotFound";
import AuthorClient from "@/public/components/user/AuthorClient";
import { getArticlesByUsername } from "@/services/articles.user.service";
import { getUser, getUserByUsername } from "@/services/users.service";
import { Metadata } from "next";

type Params = {
  username: string;
};

type Props = {
  params: Promise<Params>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const user = await getUserByUsername(username);
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_URL_IMAGE!;

  if (!user) {
    return {
      title: "User not found",
      robots: { index: false },
    };
  }

  const avatarUrl = IMAGE_BASE_URL + user?.avatar_url;
  const baseUrl = "https://www.devstackpro.cloud";
  const url = `${baseUrl}/${user.username}`;

  return {
    title: `${user.display_name} (@${user.username})`,
    description: user.bio || `Profile của ${user.display_name}`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${user.display_name}`,
      description: user.bio || "",
      url,
      siteName: "DevStackPro",
      images: [
        {
          url: avatarUrl,
          width: 1200,
          height: 630,
        },
      ],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: user.display_name || "",
      description: user.bio || "",
      images: [avatarUrl],
    },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { username } = await params;

  if (!username || username.trim() === "") return <NotFound />;

  const user = await getUserByUsername(username);
  if (!user) return <NotFound />;
  const myData = await getUser();
  const isOwner = user.id === myData?.id;
  const articles = await getArticlesByUsername(username, myData?.id);

  return <AuthorClient articles={articles} isOwner={isOwner} />;
}
