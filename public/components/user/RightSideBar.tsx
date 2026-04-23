// ── Right Sidebar ─────────────────────────────────────────────────
export default function RightSidebar() {
  const suggested = [
    {
      name: "Nguyễn An",
      username: "nguyenan",
      bio: "Designer & developer tại Hà Nội",
      initials: "NA",
    },
    {
      name: "Phạm Linh",
      username: "phamlinh",
      bio: "Viết về UX và sản phẩm số",
      initials: "PL",
    },
    {
      name: "Trần Minh",
      username: "tranminh",
      bio: "Engineering @ startup",
      initials: "TM",
    },
  ];

  const trending = [
    { tag: "thiết kế", posts: "1.2k bài viết" },
    { tag: "next.js", posts: "842 bài viết" },
    { tag: "ux research", posts: "631 bài viết" },
    { tag: "đời sống", posts: "3.4k bài viết" },
    { tag: "ai & tools", posts: "2.1k bài viết" },
  ];

  return (
    <aside
      className="
        w-60 shrink-0
        sticky top-(--header-h) self-start
        flex flex-col gap-6
        p-7
        h-[calc(100vh-var(--header-h))]
        border-l border-(--noir-border)
      "
    >
      {/* You might like */}
      <section>
        <h3
          style={{
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--noir-muted)",
            fontFamily: "var(--font-mono)",
            marginBottom: "16px",
          }}
        >
          You might like
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {suggested.map((user) => (
            <div
              key={user.username}
              style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--noir-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--noir-accent)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {user.initials}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--noir-white)",
                    fontFamily: "var(--font-display)",
                    lineHeight: 1,
                  }}
                >
                  {user.name}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: "var(--noir-muted)",
                    marginTop: "2px",
                    marginBottom: "6px",
                    lineHeight: 1.4,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user.bio}
                </p>
                <button
                  style={{
                    fontSize: "11px",
                    padding: "3px 10px",
                    borderRadius: "4px",
                    border:
                      "1px solid var(--noir-border-md, rgba(255,255,255,0.1))",
                    color: "var(--noir-muted)",
                    background: "transparent",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    transition: "border-color 0.15s, color 0.15s",
                  }}
                >
                  Theo dõi
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: "1px", background: "var(--noir-border)" }} />

      {/* What's happening */}
      <section>
        <h3
          style={{
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--noir-muted)",
            fontFamily: "var(--font-mono)",
            marginBottom: "16px",
          }}
        >
          What's happening
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {trending.map(({ tag, posts }) => (
            <button
              key={tag}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
                padding: "9px 10px",
                borderRadius: "6px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                transition: "background 0.12s",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "var(--noir-white)",
                  fontFamily: "var(--font-display)",
                }}
              >
                #{tag}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "var(--noir-muted)",
                  fontFamily: "var(--font-mono)",
                  marginTop: "1px",
                }}
              >
                {posts}
              </span>
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}
