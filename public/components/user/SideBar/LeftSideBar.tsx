"use client";

import { useRouter, usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "For you", path: "/" },
  { label: "Following", path: "/following" },
  // { label: "New", path: "/new" },
  // { label: "Verified only", path: "/verified-only" },
];

export default function LeftSideBar() {
  const router = useRouter();
  const pathname = usePathname();

  const isSelected = (path: string) =>
    path === "/" ? pathname === "/" : pathname.includes(path);

  const getClass = (path: string) =>
    `text-left px-3.5 py-2 w-full text-sm rounded cursor-pointer transition-all duration-200 ${
      isSelected(path)
        ? "bg-(--noir-accent) text-(--noir-black) border border-(--noir-accent)"
        : "border border-(--noir-border) hover:border-(--noir-accent) hover:text-(--noir-accent)"
    }`;

  return (
    <div className="hidden md:block h-[calc(100vh-var(--header-h))] sticky top-(--header-h) w-70 shrink-0 p-4 border-r border-(--noir-border)">
      <div className="space-y-2">
        {NAV_ITEMS.map(({ label, path }) => (
          <button
            key={path}
            onClick={() => router.push(path)}
            className={getClass(path)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
