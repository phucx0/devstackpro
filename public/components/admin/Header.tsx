"use client"
import { useUser } from "@/public/providers/UserProvider"
import { ChevronDown, Bell } from "lucide-react"

export default function AdminHeader() {
    const { user } = useUser()
    return (
        <div
            style={{
                height: "56px",
                background: "rgba(8,8,8,0.96)",
                borderBottom: "0.5px solid var(--noir-border)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                padding: "0 24px",
                gap: "10px",
                flexShrink: 0,
            }}
        >
            <button
                style={{
                    width: "34px",
                    height: "34px",
                    background: "var(--noir-surface)",
                    border: "0.5px solid var(--noir-border)",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "var(--noir-muted)",
                }}
                onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = "var(--noir-accent)"
                    el.style.color = "var(--noir-accent)"
                }}
                onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = "var(--noir-border)"
                    el.style.color = "var(--noir-muted)"
                }}
            >
                <Bell size={14} />
            </button>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "var(--noir-surface)",
                    border: "0.5px solid var(--noir-border)",
                    borderRadius: "6px",
                    padding: "0 12px",
                    height: "34px",
                    cursor: "pointer",
                }}
            >
                <span style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "13px",
                    color: "var(--noir-white)",
                    letterSpacing: "-0.01em",
                }}>
                    {user?.display_name}
                </span>
                <ChevronDown size={12} color="var(--noir-muted)" />
            </div>
        </div>
    )
}
