"use client"

import { DashboardData, RecentActivity } from "@/public/lib/types"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const STATUS_ICON: Record<string, string> = {
    published: "📝",
    draft: "🗒️",
    archived: "📦",
}

const monoLabel = {
    fontFamily: "var(--font-mono)",
    fontSize: "9px",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "var(--noir-muted)",
} as const

const card = {
    background: "var(--noir-surface)",
    border: "0.5px solid var(--noir-border)",
    borderRadius: "6px",
} as const

function relativeTime(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60_000)
    if (mins < 60) return `${mins} minutes ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs} hours ago`
    return `${Math.floor(hrs / 24)} days ago`
}

export default function DashboardClient({ data }: { data: DashboardData }) {
    const { metrics, trafficData, recentActivities } = data

    const metricCards = [
        { label: "Total Posts",     value: metrics.totalPosts.toLocaleString(),    change: null },
        { label: "Total Views",     value: metrics.totalViews.toLocaleString(),    change: null },
        { label: "Published",       value: metrics.publishedPosts.toLocaleString(), change: null },
        { label: "Drafts",          value: metrics.draftPosts.toLocaleString(),    change: null },
    ]

    return (
        <div>
            {/* Page header */}
            <div style={{ marginBottom: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <div style={{ width: "3px", height: "22px", background: "var(--noir-accent)", borderRadius: "2px" }} />
                    <h1 style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        fontSize: "clamp(22px, 3vw, 30px)",
                        color: "var(--noir-white)",
                        letterSpacing: "-0.02em",
                        margin: 0,
                    }}>
                        Dashboard
                    </h1>
                </div>
                <p style={{ ...monoLabel, paddingLeft: "13px", fontSize: "10px" }}>
                    Blog performance overview
                </p>
            </div>

            {/* Metrics Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "1px",
                background: "var(--noir-border)",
                border: "0.5px solid var(--noir-border)",
                borderRadius: "6px",
                overflow: "hidden",
                marginBottom: "24px",
            }}>
                {metricCards.map((metric, i) => (
                    <div key={metric.label} style={{
                        ...card, border: "none", borderRadius: 0,
                        padding: "22px 20px", position: "relative", overflow: "hidden",
                    }}>
                        <div style={{
                            position: "absolute", top: "-4px", right: "8px",
                            fontFamily: "var(--font-display)", fontWeight: 800,
                            fontSize: "52px", color: "var(--noir-subtle)",
                            lineHeight: 1, letterSpacing: "-0.04em",
                            pointerEvents: "none", userSelect: "none",
                        }}>
                            {String(i + 1).padStart(2, "0")}
                        </div>
                        <div style={monoLabel}>{metric.label}</div>
                        <div style={{
                            fontFamily: "var(--font-display)", fontWeight: 800,
                            fontSize: "clamp(20px, 2.5vw, 28px)",
                            color: "var(--noir-white)",
                            letterSpacing: "-0.02em", marginTop: "8px", lineHeight: 1,
                        }}>
                            {metric.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart + Activity */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "16px" }}>
                {/* Traffic Chart */}
                <div style={{ ...card, padding: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                        <div style={{ width: "2px", height: "16px", background: "var(--noir-accent)", borderRadius: "1px" }} />
                        <span style={{
                            fontFamily: "var(--font-display)", fontWeight: 700,
                            fontSize: "16px", color: "var(--noir-white)", letterSpacing: "-0.01em",
                        }}>
                            Website Traffic
                        </span>
                        <span style={{ ...monoLabel, marginLeft: "auto" }}>This month</span>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={trafficData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                            <CartesianGrid strokeDasharray="2 4" stroke="var(--noir-border)" />
                            <XAxis dataKey="day" stroke="var(--noir-subtle)"
                                tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "var(--noir-muted)" }}
                                axisLine={false} tickLine={false} />
                            <YAxis stroke="var(--noir-subtle)"
                                tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "var(--noir-muted)" }}
                                axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{
                                background: "var(--noir-card)",
                                border: "0.5px solid var(--noir-border)",
                                borderRadius: "4px",
                                fontFamily: "var(--font-mono)",
                                fontSize: "11px",
                                color: "var(--noir-white)",
                            }} cursor={{ stroke: "var(--noir-accent)", strokeWidth: 1, strokeDasharray: "4 2" }} />
                            <Line type="monotone" dataKey="views" stroke="var(--noir-accent)"
                                strokeWidth={1.5}
                                dot={{ fill: "var(--noir-accent)", r: 3, strokeWidth: 0 }}
                                activeDot={{ r: 5, fill: "var(--noir-accent)", strokeWidth: 0 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Activity */}
                <div style={{ ...card, padding: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                        <div style={{ width: "2px", height: "16px", background: "var(--noir-accent)", borderRadius: "1px" }} />
                        <span style={{
                            fontFamily: "var(--font-display)", fontWeight: 700,
                            fontSize: "16px", color: "var(--noir-white)", letterSpacing: "-0.01em",
                        }}>
                            Recent Activity
                        </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {recentActivities.map((a: RecentActivity, i: number) => (
                            <div key={a.id} style={{
                                display: "flex", gap: "12px", padding: "14px 0",
                                borderBottom: i < recentActivities.length - 1
                                    ? "0.5px solid var(--noir-border)" : "none",
                            }}>
                                <div style={{
                                    flexShrink: 0, width: "32px", height: "32px",
                                    borderRadius: "5px", background: "var(--noir-card)",
                                    border: "0.5px solid var(--noir-border)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "14px",
                                }}>
                                    {STATUS_ICON[a.status] ?? "📄"}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{
                                        fontFamily: "var(--font-body)", fontSize: "12px",
                                        color: "var(--noir-white)", lineHeight: 1.5, margin: 0,
                                        overflow: "hidden", display: "-webkit-box",
                                        WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const,
                                    }}>
                                        {a.title}
                                    </p>
                                    <div style={{ display: "flex", gap: "8px", marginTop: "4px", alignItems: "center" }}>
                                        <p style={{ ...monoLabel, fontSize: "9px" }}>
                                            {relativeTime(a.updated_at)}
                                        </p>
                                        <span style={{
                                            ...monoLabel, fontSize: "8px",
                                            color: a.status === "published" ? "var(--noir-accent)" : "var(--noir-muted)",
                                        }}>
                                            {a.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}