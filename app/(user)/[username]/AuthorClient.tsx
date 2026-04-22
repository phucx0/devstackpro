"use client";
import { useState } from "react";
import ArticlesList from "@/public/components/user/ArticlesList";
import EditProfileModal from "./EditProfileModal";
import { UserPublish, ArticleWithTags } from "@/public/lib/types";
import ArticleCard from "@/public/components/user/ArticleCard";

interface Props {
  profile: UserPublish;
  articles: ArticleWithTags[];
  isOwner: boolean;
}

export default function AuthorClient({ profile, articles, isOwner }: Props) {
  const [openEdit, setOpenEdit] = useState(false);
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_URL_IMAGE!;
  return (
    <div className="">
      {/* Profile Header */}
      <div className="flex items-center justify-between p-6">
        <div className="">
          <div className="flex items-center gap-4">
            <img
              src={IMAGE_BASE_URL + profile.avatar_url || "/avatar.png"}
              className="w-16 h-16 rounded-full object-cover border border-(--noir-border)"
            />
            <div className="gap-2">
              <div className="flex-1 flex items-center gap-2">
                <h1 className="text-xl font-semibold">
                  {profile.display_name}
                </h1>
                <p className="text-sm text-(--noir-muted)">
                  @{profile.username}
                </p>
              </div>
              {profile.bio && (
                <p className="text-sm mt-1 text-(--noir-muted)">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={() => setOpenEdit(true)}
            className="px-3 py-2 border border-(--noir-border) hover:border-(--noir-accent) hover:text-(--noir-accent) outline-none rounded-md text-sm cursor-pointer"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Articles */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
          {articles.map((a, index) => (
            <ArticleCard key={index} article={a} />
          ))}
        </div>
      ) : (
        <div className="noir-empty">
          <div className="noir-empty-num" aria-hidden="true">
            ∅
          </div>
          <p className="noir-empty-text">No articles found.</p>
          {isOwner && (
            <button className="mt-5 py-2 px-3.5 bg-(--noir-accent) text-black text-sm rounded-sm cursor-pointer hover:bg-(--noir-accent-dim) transition-all duration-100">
              Create a article
            </button>
          )}
        </div>
      )}

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
