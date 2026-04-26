"use client";
import { Menu, X, Search, ChevronDown, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/public/providers/AuthProvider";

export default function Header() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { profile, isAuthLoading, logout } = useAuth();
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_URL_IMAGE!;

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search/${query.trim()}`);
    setQuery("");
  };

  const handleNav = (path: string) => {
    router.push(path);
    setDrawerOpen(false);
  };

  const handleSignOut = async () => {
    await logout();
    setDropdownOpen(false);
    router.push("/");
  };

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

  const avatarLetter =
    profile?.display_name?.[0]?.toUpperCase() ??
    profile?.email?.[0]?.toUpperCase() ??
    "?";

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

          {/* Desktop Nav */}
          {/* <nav className="noir-nav">
            <Link href="/" className="noir-nav-link">
              Home
            </Link>
            <Link href="/contact" className="noir-nav-link">
              Contact
            </Link>
          </nav> */}

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="noir-search-wrap">
              <div className="noir-search-box">
                <Search size={14} className="text-(--noir-muted) shrink-0" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>

            {/* Auth Area */}
            {!isAuthLoading && profile ? (
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="menu"
                  className="w-10 h-10 border border-(--noir-border) rounded-full bg-(--noir-card) cursor-pointer flex items-center justify-center"
                >
                  {profile.avatar_url ? (
                    <img
                      src={IMAGE_BASE_URL + profile.avatar_url}
                      alt={profile.display_name || "User"}
                      className="w-10 h-10 rounded-full overflow-hidden"
                    />
                  ) : (
                    <User size={18} className="text-(--noir-muted)" />
                  )}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full w-40 bg-(--noir-card) border border-(--noir-border-md) rounded-md p-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                    {/* Menu Items */}
                    <div className="py-1">
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
                    </div>

                    <div className="h-px bg-(--noir-border) mx-1 my-1" />

                    {/* Sign Out */}
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
            ) : (
              <div className="hidden items-center gap-2  md:flex">
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
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="noir-menu-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`noir-drawer-overlay ${drawerOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="noir-drawer-backdrop"
          onClick={() => setDrawerOpen(false)}
        />
        <div className="noir-drawer">
          <div
            className="noir-drawer-close"
            onClick={() => setDrawerOpen(false)}
          >
            <X size={20} />
          </div>

          {/* Mobile Search */}
          <div className="noir-search-box w-full">
            <Search size={14} className="text-(--noir-muted) shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                  setDrawerOpen(false);
                }
              }}
              style={{ width: "100%" }}
            />
          </div>

          <Link
            href="/"
            className="noir-drawer-link"
            onClick={() => setDrawerOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/contact"
            className="noir-drawer-link"
            onClick={() => setDrawerOpen(false)}
          >
            Contact
          </Link>

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
                onClick={() => setDrawerOpen(false)}
              >
                Profile
              </Link>
              <button
                className="noir-drawer-link text-red-400 w-full text-left"
                onClick={logout}
              >
                Sign out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 mt-1">
              <Link
                href="/sign-in"
                className="text-[13px] text-center text-(--noir-accent) px-3.5 py-2 rounded-md border border-(--noir-accent) hover:text-(--noir-white) transition-colors"
                onClick={() => setDrawerOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="text-[13px] font-medium text-center text-(--noir-black) px-3.5 py-2 rounded-md bg-(--noir-accent) hover:bg-(--noir-accent-dim) transition-colors"
                onClick={() => setDrawerOpen(false)}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
