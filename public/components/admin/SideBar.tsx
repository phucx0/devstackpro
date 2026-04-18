"use client";
import { useUser } from "@/public/providers/UserProvider";
import {
  LayoutDashboard,
  LogOut,
  NotepadText,
  Tag,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

interface Props {
  path: string;
  name: string;
  Icon: ReactNode;
  selected: boolean;
}

const NavButton = ({ path, name, Icon, selected }: Props) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push("/admin/" + path)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 14px",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: "2px",
        background: selected ? "var(--noir-accent-bg)" : "transparent",
        border: selected
          ? "0.5px solid rgba(232,255,0,0.15)"
          : "0.5px solid transparent",
        color: selected ? "var(--noir-accent)" : "var(--noir-muted)",
        transition: "all 0.2s",
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        position: "relative" as const,
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          const el = e.currentTarget as HTMLElement;
          el.style.background = "var(--noir-surface)";
          el.style.color = "var(--noir-white)";
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          const el = e.currentTarget as HTMLElement;
          el.style.background = "transparent";
          el.style.color = "var(--noir-muted)";
        }
      }}
    >
      {selected && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: "2px",
            height: "16px",
            background: "var(--noir-accent)",
            borderRadius: "0 2px 2px 0",
          }}
        />
      )}
      <span style={{ opacity: selected ? 1 : 0.6 }}>{Icon}</span>
      <span>{name}</span>
    </div>
  );
};

export default function SideBar() {
  const { user, logout } = useUser();
  const pathname = usePathname();

  const isSelected = (module: string) => {
    return pathname.includes(`/${module}`);
  };

  return (
    <div
      style={{
        width: "240px",
        minWidth: "240px",
        minHeight: "100vh",
        maxHeight: "100vh",
        background: "var(--noir-surface)",
        borderRight: "0.5px solid var(--noir-border)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div>
        <div
          style={{
            padding: "20px 16px",
            borderBottom: "0.5px solid var(--noir-border)",
            marginBottom: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "26px",
                height: "26px",
                background: "var(--noir-accent)",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
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
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "13px",
                  color: "var(--noir-white)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  lineHeight: 1.2,
                }}
              >
                DevStack Pro
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  color: "var(--noir-accent)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Admin
              </div>
            </div>
          </div>
        </div>

        {/* Section Label */}
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            color: "var(--noir-subtle)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "8px 16px 6px",
          }}
        >
          Navigation
        </div>

        {/* Nav items */}
        <div style={{ padding: "0 8px" }}>
          <NavButton
            path="dashboard"
            name="Dashboard"
            Icon={<LayoutDashboard size={14} />}
            selected={isSelected("dashboard")}
          />
          <NavButton
            path="articles"
            name="Articles"
            Icon={<NotepadText size={14} />}
            selected={isSelected("articles")}
          />
          <NavButton
            path="tags"
            name="Tags"
            Icon={<Tag size={14} />}
            selected={isSelected("tags")}
          />
          <NavButton
            path="contact"
            name="Contact"
            Icon={<MessageSquare size={14} />}
            selected={isSelected("contact")}
          />
        </div>
      </div>

      {/* User footer */}
      <div
        style={{
          borderTop: "0.5px solid var(--noir-border)",
          padding: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--noir-card)",
            border: "0.5px solid var(--noir-border)",
            borderRadius: "6px",
            padding: "10px 12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "var(--noir-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "11px",
                color: "var(--noir-black)",
                flexShrink: 0,
              }}
            >
              {user?.display_name?.charAt(0)?.toUpperCase() ?? "A"}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "12px",
                  color: "var(--noir-white)",
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "110px",
                }}
              >
                {user?.display_name}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  color: "var(--noir-muted)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {user?.role ?? "Admin"}
              </div>
            </div>
          </div>
          <div
            onClick={logout}
            style={{
              cursor: "pointer",
              color: "var(--noir-muted)",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#ff4444")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color =
                "var(--noir-muted)")
            }
            title="Logout"
          >
            <LogOut size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}
