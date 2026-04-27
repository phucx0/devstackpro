"use client";
import { X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/public/providers/AuthProvider";
import { SearchBox } from "./SearchBox";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function MobileDrawer({ open, onClose }: Props) {
  const { profile, logout } = useAuth();
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_URL_IMAGE!;

  const avatarLetter =
    profile?.display_name?.[0]?.toUpperCase() ??
    profile?.email?.[0]?.toUpperCase() ??
    "?";

  return (
    <div
      className={`noir-drawer-overlay ${open ? "open" : ""}`}
      role="dialog"
      aria-modal="true"
    >
      <div className="noir-drawer-backdrop" onClick={onClose} />
      <div className="noir-drawer">
        <div className="noir-drawer-close" onClick={onClose}>
          <X size={20} />
        </div>

        <SearchBox onSearch={onClose} fullWidth />

        <Link href="/" className="noir-drawer-link" onClick={onClose}>
          Home
        </Link>
        <Link href="/contact" className="noir-drawer-link" onClick={onClose}>
          Contact
        </Link>

        {/* Auth section */}
        {profile ? (
          <>
            <div className="flex items-center gap-2.5 py-4">
              {profile.avatar_url ? (
                <img
                  src={IMAGE_BASE_URL + profile.avatar_url}
                  alt={profile.display_name || "User"}
                  className="w-10 h-10 rounded-full overflow-hidden"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-(--noir-accent) text-(--noir-black) text-sm font-semibold flex items-center justify-center shrink-0">
                  {avatarLetter}
                </div>
              )}
              <p className="text-[13px] font-medium text-(--noir-white) m-0">
                {profile.display_name}
              </p>
            </div>
            <Link
              href={`/${profile.username}`}
              className="noir-drawer-link"
              onClick={onClose}
            >
              Profile
            </Link>
            <button
              className="noir-drawer-link text-red-400 w-full text-left"
              onClick={() => {
                logout();
                onClose();
              }}
            >
              Sign out
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-2 mt-1">
            <Link
              href="/sign-in"
              className="text-[13px] text-center text-(--noir-accent) px-3.5 py-2 rounded-md border border-(--noir-accent) transition-colors"
              onClick={onClose}
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="text-[13px] font-medium text-center text-(--noir-black) px-3.5 py-2 rounded-md bg-(--noir-accent) hover:bg-(--noir-accent-dim) transition-colors"
              onClick={onClose}
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
