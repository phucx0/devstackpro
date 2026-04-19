"use client";
import { useAuth } from "@/public/providers/UserProvider";
import {
  LayoutDashboard,
  LogOut,
  NotepadText,
  Tag,
  MessageSquare,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

interface NavButtonProps {
  path: string;
  name: string;
  Icon: ReactNode;
  selected: boolean;
}

const NavButton = ({ path, name, Icon, selected }: NavButtonProps) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push("/admin/" + path)}
      className={`
        relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-md cursor-pointer mb-0.5
        font-mono text-[11px] font-medium tracking-[0.08em] uppercase
        transition-all duration-200
        ${
          selected
            ? "bg-(--noir-accent-bg) border border-(--noir-accent)/15 text-(--noir-accent)"
            : "border border-transparent text-(--noir-muted) hover:bg-(--noir-surface) hover:text-(--noir-white)"
        }
      `}
    >
      {selected && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-(--noir-accent) rounded-r-sm" />
      )}
      <span className={selected ? "opacity-100" : "opacity-60"}>{Icon}</span>
      <span>{name}</span>
    </div>
  );
};

export default function SideBar() {
  const { user, profile, logout } = useAuth();
  const pathname = usePathname();

  const isSelected = (module: string) => pathname.includes(`/${module}`);

  const navItems = [
    {
      path: "dashboard",
      name: "Dashboard",
      Icon: <LayoutDashboard size={14} />,
    },
    { path: "articles", name: "Articles", Icon: <NotepadText size={14} /> },
    { path: "tags", name: "Tags", Icon: <Tag size={14} /> },
    { path: "contact", name: "Contact", Icon: <MessageSquare size={14} /> },
  ];

  return (
    <div className="w-60 min-w-60 min-h-screen max-h-screen bg-(--noir-surface) border-r border-(--noir-border)/50 flex flex-col justify-between overflow-hidden">
      {/* Top */}
      <div>
        {/* Logo */}
        <div className="px-4 py-5 border-b border-(--noir-border)/50 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-6.5 h-6.5 bg-(--noir-accent) rounded-md flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" fill="#080808" />
                <rect x="8" y="1" width="5" height="5" fill="#080808" />
                <rect x="1" y="8" width="5" height="5" fill="#080808" />
                <rect
                  x="8"
                  y="8"
                  width="5"
                  height="5"
                  fill="#080808"
                  opacity="0.4"
                />
              </svg>
            </div>
            <div>
              <div className="font-display font-bold text-[13px] text-(--noir-white) tracking-[0.04em] uppercase leading-tight">
                DevStack Pro
              </div>
              <div className="font-mono text-[9px] text-(--noir-accent) tracking-[0.1em] uppercase">
                Admin
              </div>
            </div>
          </div>
        </div>

        {/* Section label */}
        <div className="font-mono text-[9px] text-(--noir-subtle) tracking-[0.15em] uppercase px-4 pt-2 pb-1.5">
          Navigation
        </div>

        {/* Nav items */}
        <div className="px-2">
          {navItems.map((item) => (
            <NavButton
              key={item.path}
              {...item}
              selected={isSelected(item.path)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
