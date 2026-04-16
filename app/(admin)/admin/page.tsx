"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const trafficData = [
    { day: 1,  views: 2400 },
    { day: 5,  views: 1398 },
    { day: 10, views: 9800 },
    { day: 15, views: 3908 },
    { day: 20, views: 4800 },
    { day: 25, views: 3800 },
    { day: 30, views: 4300 },
]

const activities = [
    { id: 1, title: 'New comment on "The Future of AI"',              time: "2 hours ago",  icon: "💬" },
    { id: 2, title: 'John Doe published "Getting Started with Vue 3"', time: "1 day ago",    icon: "📝" },
    { id: 3, title: "New user Jane Smith registered.",                 time: "3 days ago",   icon: "👤" },
    { id: 4, title: 'New comment on "Design Systems 101"',             time: "4 days ago",   icon: "💬" },
]

const metrics = [
    { label: "Total Posts",       value: "1,204",  change: "+12%" },
    { label: "Total Views",       value: "245,678", change: "+5.4%" },
    { label: "Total Comments",    value: "4,321",   change: "+8%" },
    { label: "New Subscribers",   value: "352",     change: "+2.1%" },
]

/* ─── Styles ──────────────────────────────────────── */
const card = {
    background: "var(--noir-surface)",
    border: "0.5px solid var(--noir-border)",
    borderRadius: "6px",
} as const

const monoLabel = {
    fontFamily: "var(--font-mono)",
    fontSize: "9px",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "var(--noir-muted)",
} as const

export default function Dashboard() {
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "var(--noir-border)", border: "0.5px solid var(--noir-border)", borderRadius: "6px", overflow: "hidden", marginBottom: "24px" }}>
                {metrics.map((metric, i) => (
                    <div key={metric.label} style={{ ...card, border: "none", borderRadius: 0, padding: "22px 20px", position: "relative", overflow: "hidden" }}>
                        {/* ghost number */}
                        <div style={{
                            position: "absolute",
                            top: "-4px", right: "8px",
                            fontFamily: "var(--font-display)",
                            fontWeight: 800,
                            fontSize: "52px",
                            color: "var(--noir-subtle)",
                            lineHeight: 1,
                            letterSpacing: "-0.04em",
                            pointerEvents: "none",
                            userSelect: "none",
                        }}>
                            {String(i + 1).padStart(2, "0")}
                        </div>
                        <div style={monoLabel}>{metric.label}</div>
                        <div style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 800,
                            fontSize: "clamp(20px, 2.5vw, 28px)",
                            color: "var(--noir-white)",
                            letterSpacing: "-0.02em",
                            marginTop: "8px",
                            lineHeight: 1,
                        }}>
                            {metric.value}
                        </div>
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            marginTop: "10px",
                            fontFamily: "var(--font-mono)",
                            fontSize: "10px",
                            color: "var(--noir-accent)",
                            letterSpacing: "0.06em",
                        }}>
                            ↑ {metric.change}
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
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            fontSize: "16px",
                            color: "var(--noir-white)",
                            letterSpacing: "-0.01em",
                        }}>
                            Website Traffic
                        </span>
                        <span style={{ ...monoLabel, marginLeft: "auto" }}>Last 30 days</span>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={trafficData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                            <CartesianGrid strokeDasharray="2 4" stroke="var(--noir-border)" />
                            <XAxis
                                dataKey="day"
                                stroke="var(--noir-subtle)"
                                tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "var(--noir-muted)" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                stroke="var(--noir-subtle)"
                                tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "var(--noir-muted)" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: "var(--noir-card)",
                                    border: "0.5px solid var(--noir-border)",
                                    borderRadius: "4px",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "11px",
                                    color: "var(--noir-white)",
                                }}
                                cursor={{ stroke: "var(--noir-accent)", strokeWidth: 1, strokeDasharray: "4 2" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="views"
                                stroke="var(--noir-accent)"
                                strokeWidth={1.5}
                                dot={{ fill: "var(--noir-accent)", r: 3, strokeWidth: 0 }}
                                activeDot={{ r: 5, fill: "var(--noir-accent)", strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Activity */}
                <div style={{ ...card, padding: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                        <div style={{ width: "2px", height: "16px", background: "var(--noir-accent)", borderRadius: "1px" }} />
                        <span style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            fontSize: "16px",
                            color: "var(--noir-white)",
                            letterSpacing: "-0.01em",
                        }}>
                            Recent Activity
                        </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                        {activities.map((a, i) => (
                            <div key={a.id} style={{
                                display: "flex",
                                gap: "12px",
                                padding: "14px 0",
                                borderBottom: i < activities.length - 1 ? "0.5px solid var(--noir-border)" : "none",
                            }}>
                                <div style={{
                                    flexShrink: 0,
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "5px",
                                    background: "var(--noir-card)",
                                    border: "0.5px solid var(--noir-border)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "14px",
                                }}>
                                    {a.icon}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: "12px",
                                        color: "var(--noir-white)",
                                        lineHeight: 1.5,
                                        margin: 0,
                                        overflow: "hidden",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical" as const,
                                    }}>
                                        {a.title}
                                    </p>
                                    <p style={{ ...monoLabel, fontSize: "9px", marginTop: "4px" }}>{a.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
