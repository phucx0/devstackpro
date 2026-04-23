import Loading from "@/public/components/Loading";
import { getArticles } from "@/services/articles.author.service";
import { redirect } from "next/navigation";
import { deleteArticleAction } from "@/app/actions/author.actions";
import {
  Eye,
  Newspaper,
  SquarePen,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Status } from "@/public/components/admin/ArticleStatus";
import NotFound from "@/public/components/NotFound";
import { toast } from "sonner";

interface Props {
  searchParams: { page?: string };
}

export default async ({ searchParams }: Props) => {
  const articles = await getArticles();
  const pageNumber = 1;
  const totalPages = 1;
  const totalArticles = 1;
  const isLoading = false;

  const handleDeleteArticle = async (id: number) => {
    const isConfirm = window.confirm(
      "Bạn có chắc chắn muốn xóa bài viết này không?",
    );
    if (!isConfirm) return;
    try {
      await deleteArticleAction(id);
      redirect("/admin/articles");
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi xóa bài viết");
    }
  };

  const startItem = articles
    ? articles.length + (pageNumber - 1) * 10 - articles.length + 1
    : 0;
  const endItem = articles ? articles.length + (pageNumber - 1) * 10 : 0;

  if (isLoading) return <Loading />;

  if (!articles) return <NotFound />;

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
          paddingBottom: 20,
          borderBottom: "0.5px solid var(--noir-border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 3,
              height: 28,
              background: "var(--noir-accent)",
              borderRadius: 2,
            }}
          />
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 22,
              color: "var(--noir-white)",
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            Articles
          </h1>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--noir-accent)",
              background: "var(--noir-accent-bg)",
              border: "0.5px solid rgba(232,255,0,0.2)",
              borderRadius: 3,
              padding: "2px 8px",
              letterSpacing: "0.1em",
            }}
          >
            {totalArticles}
          </span>
        </div>
        <Link href="/admin/articles/create">
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--noir-black)",
              background: "var(--noir-accent)",
              padding: "9px 18px",
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
          >
            <Plus size={14} />
            Add Article
          </button>
        </Link>
      </div>

      {/* Table */}
      <div
        style={{
          border: "0.5px solid var(--noir-border)",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                background: "var(--noir-surface)",
                borderBottom: "0.5px solid var(--noir-border)",
              }}
            >
              {["Title", "Author", "Status", "Views", "Actions"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    fontWeight: 500,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--noir-muted)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {articles && articles.length > 0 ? (
              articles.map((article, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: "0.5px solid var(--noir-border)",
                    transition: "background 0.15s",
                    cursor: "default",
                  }}
                  // onMouseOver={(e) =>
                  //   (e.currentTarget.style.background = "var(--noir-card)")
                  // }
                  // onMouseOut={(e) =>
                  //   (e.currentTarget.style.background = "transparent")
                  // }
                >
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "var(--noir-white)",
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: 14,
                      maxWidth: 340,
                    }}
                  >
                    <div
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {article.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: "var(--noir-muted)",
                        marginTop: 3,
                        letterSpacing: "0.05em",
                      }}
                    >
                      /{article.slug ?? "—"}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--noir-muted)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {article.display_name}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {article.status ? (
                      <Status status={article!.status} />
                    ) : (
                      <div>underfined</div>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--noir-muted)",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <Eye size={12} style={{ color: "var(--noir-subtle)" }} />
                      {article.views}
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {[
                        {
                          type: "link",
                          icon: <Eye size={13} />,
                          href: `/admin/articles/${article.id}`,
                          title: "View",
                        },
                        {
                          type: "link",
                          icon: <SquarePen size={13} />,
                          href: `/admin/articles/${article.id}/update`,
                          title: "Edit",
                        },
                        {
                          type: "action",
                          icon: <Trash2 size={13} />,
                          // action: () => handleDeleteArticle(article.id),
                          title: "Delete",
                          danger: true,
                        },
                      ].map((btn, i) =>
                        btn.type === "link" ? (
                          <Link href={btn.href ?? ""} key={i}>
                            <button
                              title={btn.title}
                              className={`flex items-center justify-center w-[30px] h-[30px] bg-transparent border border-(--noir-border-md) rounded-sm transition-colors duration-200 cursor-pointer ${
                                btn.danger
                                  ? "text-[#ff4444]"
                                  : "text-(--noir-muted)"
                              }`}
                            >
                              {btn.icon}
                            </button>
                          </Link>
                        ) : (
                          <button
                            key={i}
                            title={btn.title}
                            // onClick={btn.action}
                            className={`flex items-center justify-center w-[30px] h-[30px] bg-transparent border border-(--noir-border-md) rounded-sm transition-colors duration-200 cursor-pointer ${
                              btn.danger
                                ? "text-[#ff4444]"
                                : "text-(--noir-muted)"
                            }`}
                          >
                            {btn.icon}
                          </button>
                        ),
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ padding: "64px 24px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <Newspaper
                      size={48}
                      style={{ color: "var(--noir-border-md)" }}
                    />
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        letterSpacing: "0.1em",
                        color: "var(--noir-muted)",
                        textTransform: "uppercase",
                      }}
                    >
                      Không tìm thấy bài viết nào
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            borderTop: "0.5px solid var(--noir-border)",
            background: "var(--noir-surface)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--noir-muted)",
              letterSpacing: "0.06em",
            }}
          >
            {articles?.length
              ? `${startItem}–${endItem} of ${totalArticles}`
              : "0 results"}
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              {
                icon: <ChevronLeft size={14} />,
                disabled: pageNumber === 1,
                // action: () => setPageNumber((p) => p - 1),
              },
              {
                icon: <ChevronRight size={14} />,
                disabled: pageNumber === totalPages,
                // action: () => setPageNumber((p) => p + 1),
              },
            ].map((btn, i) => (
              <button
                key={i}
                disabled={btn.disabled}
                // onClick={btn.action}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 30,
                  height: 30,
                  borderRadius: 4,
                  background: "transparent",
                  border: `0.5px solid ${btn.disabled ? "var(--noir-border)" : "var(--noir-border-md)"}`,
                  color: btn.disabled
                    ? "var(--noir-subtle)"
                    : "var(--noir-muted)",
                  cursor: btn.disabled ? "not-allowed" : "pointer",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                // onMouseOver={(e) => {
                //   if (!btn.disabled) {
                //     e.currentTarget.style.borderColor = "var(--noir-accent)";
                //     e.currentTarget.style.color = "var(--noir-accent)";
                //   }
                // }}
                // onMouseOut={(e) => {
                //   e.currentTarget.style.borderColor = btn.disabled
                //     ? "var(--noir-border)"
                //     : "var(--noir-border-md)";
                //   e.currentTarget.style.color = btn.disabled
                //     ? "var(--noir-subtle)"
                //     : "var(--noir-muted)";
                // }}
              >
                {btn.icon}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
