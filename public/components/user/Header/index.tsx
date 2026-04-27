"use client";
import { Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/public/providers/AuthProvider";
import { SearchBox } from "@/public/components/user/Header/SearchBox";
import { AuthArea } from "@/public/components/user/Header/AuthArea";
import { MobileDrawer } from "@/public/components/user/Header/MobileDrawer";
import { useRouter } from "next/navigation";

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { profile } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (profile) {
      router.push(`${profile.username}/articles/new`);
      return;
    }
    router.push("/sign-in?callbackUrl=/articles/new");
  };
  return (
    <>
      <header className="noir-header">
        <div className="noir-header-inner">
          {/* Logo */}
          <Link href="/" className="noir-logo">
            <div className="noir-logo-mark">
              <svg
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 2h4.5C9.538 2 12 4.462 12 7s-2.462 5-5.5 5H2V2Z"
                  fill="#080808"
                />
              </svg>
            </div>
            <span className="noir-logo-text">DevStack</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClick}
              className={`mr-2 cta-btn text-[13px] font-medium text-(--noir-black) px-3.5 py-2 rounded-md bg-(--noir-accent) cursor-pointer hover:bg-(--noir-accent-dim) transition-colors`}
            >
              {profile ? "Write an article" : "Join to write"}
            </button>
            <SearchBox />
            <AuthArea profile={profile} />
          </div>

          <button
            className="noir-menu-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
