"use client";
import { UserPublish } from "@/public/lib/types";
import { useAuth } from "@/public/providers/AuthProvider";
import { Edit } from "lucide-react";
import FollowButton from "./FollowButton";
import { useModal } from "@/public/providers/ModalProvider";
import { Suspense } from "react";

interface Props {
  user: UserPublish;
  followerCount: number;
  followingCount: number;
}

export default function UserProfileSidebar({
  user,
  followerCount,
  followingCount,
}: Props) {
  const { setOpen } = useModal();
  const { profile } = useAuth();

  const avatarSrc = user.avatar_url
    ? (process.env.NEXT_PUBLIC_URL_IMAGE ?? "") + user.avatar_url
    : null;
  const isOwner = profile && profile.id === user.id;
  const initials =
    user.display_name ??
    ""
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <aside className="w-70 top-(--header-h) sticky shrink-0 self-start hidden md:flex flex-col h-[calc(100vh-var(--header-h))] gap-6 p-4 border-l border-(--noir-border)">
      {/* Avatar + identity */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div className="w-20 h-20 rounded-full overflow-hidden border border-(--noir-border) shrink-0 mx-auto">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={user.display_name ?? ""}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span
              style={{
                fontSize: "18px",
                fontWeight: 500,
                fontFamily: "var(--font-display)",
                color: "var(--noir-accent)",
              }}
            >
              {initials}
            </span>
          )}
        </div>

        <div>
          <h1
            style={{
              fontSize: "15px",
              fontWeight: 500,
              fontFamily: "var(--font-display)",
              color: "var(--noir-white)",
              lineHeight: "1.2",
            }}
          >
            {user.display_name}
          </h1>
          <p
            style={{
              fontSize: "12px",
              marginTop: "3px",
              color: "var(--noir-muted)",
            }}
          >
            @{user.username}
          </p>
        </div>

        {user.bio && (
          <p
            style={{
              fontSize: "12px",
              lineHeight: "1.65",
              color: "var(--noir-muted)",
            }}
          >
            {user.bio}
          </p>
        )}
      </div>

      <div style={{ height: "1px", background: "var(--noir-border)" }} />

      {/* Stats */}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "12px", color: "var(--noir-muted)" }}>
            Following
          </span>
          <span
            style={
              {
                fontSize: "12px",
                fontWeight: 500,
                color: "var(--noir-white)",
                fontFamily: "var(--font-mono)",
                tabularNums: true,
              } as any
            }
          >
            {followingCount ?? 0}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "12px", color: "var(--noir-muted)" }}>
            Follower
          </span>
          <span
            style={
              {
                fontSize: "12px",
                fontWeight: 500,
                color: "var(--noir-white)",
                fontFamily: "var(--font-mono)",
                tabularNums: true,
              } as any
            }
          >
            {followerCount ?? 0}
          </span>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* CTA */}
      {/* {isOwner ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full text-[12px] text-(--noir-black) bg-(--noir-accent) px-4 py-2 rounded flex items-center justify-center gap-2 cursor-pointer"
        >
          <Edit size={14} />
          Edit profile
        </button>
      ) : (
        <FollowButton userId={user.id} />
      )} */}
    </aside>
  );
}
