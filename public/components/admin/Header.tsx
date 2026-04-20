"use client";
import { useAuth } from "@/public/providers/AuthProvider";
import { Bell, ChevronDown, Settings, User, LogOut } from "lucide-react";
import { useState, useRef, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";

// ─── Dropdown Portal ──────────────────────────────────────────────────────────

interface DropdownPortalProps {
  anchorRef: React.RefObject<HTMLElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  children: ReactNode;
}

const DropdownPortal = ({
  anchorRef,
  open,
  children,
  dropdownRef,
}: DropdownPortalProps) => {
  const [coords, setCoords] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (open && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
      });
    }
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={dropdownRef}
      style={{
        position: "fixed",
        top: coords.top,
        right: coords.right,
        zIndex: 9999,
      }}
    >
      {children}
    </div>,
    document.body,
  );
};

// ─── Dropdown Item ────────────────────────────────────────────────────────────

interface DropdownItemProps {
  Icon: ReactNode;
  label: string;
  danger?: boolean;
  onClick: () => void;
}

const DropdownItem = ({ Icon, label, danger, onClick }: DropdownItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded text-[11px] font-mono tracking-[0.06em] uppercase transition-colors duration-150 cursor-pointer
      ${
        danger
          ? "text-red-400 hover:bg-red-400/10"
          : "text-(--noir-muted) hover:bg-(--noir-card) hover:text-(--noir-white)"
      }`}
  >
    {Icon}
    {label}
  </button>
);

// ─── AdminHeader ──────────────────────────────────────────────────────────────

export default function AdminHeader() {
  const { profile, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng khi click ra ngoài
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        anchorRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node) // nếu click trong dropdown thì không đóng
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  // Đóng khi scroll
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = () => setDropdownOpen(false);
    window.addEventListener("scroll", handler, true);
    return () => window.removeEventListener("scroll", handler, true);
  }, [dropdownOpen]);

  return (
    <div className="h-14 bg-black/95 border-b border-(--noir-border)/50 backdrop-blur-2xl flex items-center justify-end px-6 gap-2.5 shrink-0">
      {/* Bell */}
      <button className="w-8 h-8 bg-(--noir-surface) border border-(--noir-border)/50 rounded-md flex items-center justify-center cursor-pointer text-(--noir-muted) hover:border-(--noir-accent) hover:text-(--noir-accent) transition-all duration-200">
        <Bell size={14} />
      </button>

      {/* Profile trigger */}
      <button
        ref={anchorRef}
        onClick={() => setDropdownOpen((v) => !v)}
        className="flex items-center gap-2 bg-(--noir-surface) border border-(--noir-border)/50 rounded-md px-3 h-8 cursor-pointer hover:border-(--noir-accent)/40 transition-all duration-200"
      >
        <div className="w-5 h-5 rounded-full bg-(--noir-accent) flex items-center justify-center font-display font-bold text-[9px] text-(--noir-black) shrink-0">
          {profile?.display_name?.charAt(0)?.toUpperCase() ?? "A"}
        </div>
        <span className="font-display font-semibold text-[13px] text-(--noir-white) tracking-tight">
          {profile?.display_name ?? "Admin"}
        </span>
        <ChevronDown
          size={12}
          className={`text-(--noir-muted) transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown qua Portal — thoát khỏi mọi overflow/clip của parent */}
      <DropdownPortal
        anchorRef={anchorRef}
        dropdownRef={dropdownRef}
        open={dropdownOpen}
      >
        <div className="w-44 bg-(--noir-surface) border border-(--noir-border)/50 rounded-md overflow-hidden shadow-2xl">
          {/* User info */}
          <div className="px-3 py-2.5 border-b border-(--noir-border)/50">
            <p className="font-display font-semibold text-[12px] text-(--noir-white) truncate">
              {profile?.display_name}
            </p>
            {/* <p className="font-mono text-[9px] text-(--noir-muted) uppercase tracking-[0.06em]">
              {profile?.role ?? "Admin"}
            </p> */}
          </div>

          {/* Actions */}
          <div className="p-1">
            <DropdownItem
              Icon={<User size={12} />}
              label="Profile"
              onClick={() => setDropdownOpen(false)}
            />
            <DropdownItem
              Icon={<Settings size={12} />}
              label="Settings"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="h-px bg-(--noir-border)/50 my-1" />
            <DropdownItem
              Icon={<LogOut size={12} />}
              label="Logout"
              danger
              onClick={async () => {
                setDropdownOpen(false);
                await logout();
              }}
            />
          </div>
        </div>
      </DropdownPortal>
    </div>
  );
}
