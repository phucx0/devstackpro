"use client";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/public/providers/AuthProvider";
import { UserPublish } from "@/public/lib/types";
import Image from "next/image";
import { getAvatarUrl } from "@/lib/utils/image";

interface Props {
  // isAuthLoading: boolean;
  profile: UserPublish | null;
}

export function AuthArea({ profile }: Props) {
  const router = useRouter();
  const { logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_URL_IMAGE!;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleSignOut = async () => {
    console.log("Logout");
    await logout();
    setDropdownOpen(false);
    router.push("/");
  };

  // 1. Đang load → skeleton tránh layout shift
  // if (isAuthLoading) {
  //   return (
  //     <div className="hidden md:block w-10 h-10 rounded-full bg-(--noir-card) border border-(--noir-border) animate-pulse" />
  //   );
  // }

  // 2. Đã đăng nhập
  if (profile) {
    const avatarLetter =
      profile.display_name?.[0]?.toUpperCase() ??
      profile.email?.[0]?.toUpperCase() ??
      "?";

    return (
      <div className="relative hidden md:block" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          aria-expanded={dropdownOpen}
          aria-haspopup="menu"
          className="w-10 h-10 relative border border-(--noir-border) rounded-full bg-(--noir-card) cursor-pointer flex items-center justify-center"
        >
          {profile.avatar_url ? (
            <Image
              src={getAvatarUrl(profile.avatar_url)}
              alt={profile.display_name || "User"}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-(--noir-white)">
              {avatarLetter}
            </span>
          )}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full w-40 bg-(--noir-card) border border-(--noir-border-md) rounded-md p-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
            <button
              className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] text-(--noir-white) cursor-pointer"
              onClick={() => {
                router.push(`/${profile.username}`);
                setDropdownOpen(false);
              }}
            >
              <User size={18} className="text-(--noir-muted)" />
              <span>Profile</span>
            </button>

            <div className="h-px bg-(--noir-border) mx-1 my-1" />

            <button
              className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] text-red-400 cursor-pointer"
              onClick={handleSignOut}
            >
              <LogOut size={18} />
              <span>Sign out</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // 3. Chưa đăng nhập
  return (
    <div className="hidden items-center gap-2 md:flex">
      <Link
        href="/sign-in"
        className="text-[13px] text-(--noir-accent) px-3.5 py-2 rounded-md border border-(--noir-accent) transition-colors"
      >
        Sign in
      </Link>
      <Link
        href="/sign-up"
        className="text-[13px] font-medium text-(--noir-black) px-3.5 py-2 rounded-md bg-(--noir-accent) hover:bg-(--noir-accent-dim) transition-colors"
      >
        Sign up
      </Link>
    </div>
  );
}
