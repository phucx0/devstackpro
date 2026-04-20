"use client";
import { useState } from "react";
import ArticlesList from "@/public/components/user/ArticlesList";
import EditProfileModal from "./EditProfileModal";
import { UserPublish, ArticleWithTags } from "@/public/lib/types";

interface Props {
  profile: UserPublish;
  articles: ArticleWithTags[];
  isOwner: boolean;
}

export default function AuthorClient({ profile, articles, isOwner }: Props) {
  const [openEdit, setOpenEdit] = useState(false);
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_URL_IMAGE!;
  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="flex items-center justify-between my-6">
        <div>
          <div className="flex items-center">
            <img
              src={IMAGE_BASE_URL + profile.avatar_url || "/avatar.png"}
              className="w-16 h-16 rounded-full object-cover"
            />

            <div className="flex-1">
              <h1 className="text-lg font-semibold">{profile.display_name}</h1>
              <p className="text-sm opacity-70">@{profile.username}</p>
              <p className="text-sm mt-1">{profile.bio}</p>
            </div>
          </div>
          <div>{profile.bio}</div>
        </div>

        {isOwner && (
          <button
            onClick={() => setOpenEdit(true)}
            className="px-3 py-2 border border-(--noir-border) hover:border-(--noir-accent) hover:text-(--noir-accent) outline-none rounded-md text-sm cursor-pointer"
          >
            Edit
          </button>
        )}
      </div>

      {/* Articles */}
      <ArticlesList
        initialArticles={articles}
        initialPage={0}
        initialTotalPages={0}
      />

      {/* Modal */}
      {openEdit && (
        <EditProfileModal
          profile={profile}
          onClose={() => setOpenEdit(false)}
        />
      )}
    </div>
  );
}
