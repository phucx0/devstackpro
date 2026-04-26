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
    <aside className="w-70 shrink-0 sticky top-(--header-h) self-start hidden md:flex flex-col gap-6 p-7 h-[calc(100vh-var(--header-h))] border-l border-(--noir-border)">
      {/* You might like */}
      <section className="space-y-4">
        <div className="text-sm text-(--noir-white)">You might like</div>
        <div className="space-y-4">
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
                <button className="border border-(--noir-accent) rounded text-[10px] text-(--noir-accent) px-2.5 py-2 cursor-pointer hover:bg-(--noir-accent) hover:text-(--noir-black)">
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
      <section className="space-y-4">
        <div className="text-sm text-(--noir-white)">What's happening</div>
        <div className="space-y-4">
          {trending.map(({ tag, posts }) => (
            <button
              key={tag}
              className="flex flex-col items-start cursor-pointer"
            >
              <span className="text-sm text-(--noir-accent)">#{tag}</span>
              <span className="text-xs text-(--noir-white)">{posts}</span>
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}
