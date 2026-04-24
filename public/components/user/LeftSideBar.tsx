"use client";
import { UserPublish } from "@/public/lib/types";
import { useAuth } from "@/public/providers/AuthProvider";
import { Edit } from "lucide-react";
import { toast } from "sonner";

interface Props {
  user: UserPublish;
}
export default function LeftSideBar({ user }: Props) {
  const avatarSrc = user.avatar_url
    ? (process.env.NEXT_PUBLIC_URL_IMAGE ?? "") + user.avatar_url
    : null;
  const { profile } = useAuth();
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
    <aside className="w-60 h-[calc(100vh-var(--header-h))] sticky shrink-0 top-(--header-h) self-start flex flex-col gap-6 p-4 border-r border-(--noir-border)">
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
      {/* <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {[
          { label: "Follower", value: 0 },
          { label: "Following", value: 0 },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "12px", color: "var(--noir-muted)" }}>
              {label}
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
              {value.toLocaleString()}
            </span>
          </div>
        ))}
      </div> */}

      {/* <div style={{ height: "1px", background: "var(--noir-border)" }} />
      <div style={{ flex: 1 }} /> */}

      {/* CTA */}
      {isOwner ? (
        <button
          onClick={() => toast.error("We’re working on this feature")}
          className="w-full text-[12px] text-(--noir-black) bg-(--noir-accent) px-4 py-2 rounded flex items-center justify-center gap-2 cursor-pointer"
        >
          <Edit size={14} />
          Edit profile
        </button>
      ) : (
        <button
          onClick={() => toast.error("We’re working on this feature")}
          className="w-full text-[12px] text-(--noir-black) bg-(--noir-accent) px-4 py-2 rounded flex items-center justify-center gap-2 cursor-pointer"
        >
          Follow
        </button>
      )}
    </aside>
  );
}
