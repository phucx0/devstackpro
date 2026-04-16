"use client";
import Loading from "@/public/components/Loading";
import { articleAPI } from "@/public/lib/api";
import { ArticleResponse, ArticleWithTags } from "@/public/lib/types";
import { useUser } from "@/public/providers/UserProvider";
import {
  Eye,
  Newspaper,
  SquarePen,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface StatusProps {
  status: "published" | "draft" | "hidden";
}

export function Status({ status }: StatusProps) {
  const statusMap: Record<
    string,
    { label: string; color: string; bg: string }
  > = {
    published: {
      label: "Published",
      color: "#e8ff00",
      bg: "rgba(232,255,0,0.08)",
    },
    draft: { label: "Draft", color: "#747470", bg: "rgba(116,116,112,0.1)" },
    hidden: { label: "Hidden", color: "#333330", bg: "rgba(51,51,48,0.15)" },
  };
  const { label, color, bg } = statusMap[status] ?? statusMap.hidden;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: bg,
        border: `0.5px solid ${color}33`,
        borderRadius: 3,
        padding: "3px 10px",
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  );
}

export default () => {
  const router = useRouter();
  const { token, loading } = useUser();
  const [articles, setArticles] = useState<ArticleWithTags[]>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteArticle = async (id: number) => {
    if (!token) redirect("/auth/sign-in");
    const isConfirm = window.confirm(
      "Bạn có chắc chắn muốn xóa bài viết này không?",
    );
    if (!isConfirm) return;
    try {
      const result = await articleAPI.deleteArticle(Number(id), token);
      if (result.success) {
        setArticles((prev) => prev?.filter((p) => p.id != id));
      } else {
        alert("Xóa thất bại, thử lại sau");
      }
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi xóa bài viết");
    }
  };

  useEffect(() => {
    if (token) {
      const getArticles = async () => {
        try {
          setIsLoading(true);
          const params = { page: pageNumber, limit: 10, status: null };
          const result = await articleAPI.getAdminArticles(token, params);
          if (result.success) {
            setArticles(result.data);
            setTotalPages(result.pagination.total_pages);
            setTotalArticles(result.pagination.total);
          }
        } catch {
          console.log("Lỗi khi lấy danh sách article");
        } finally {
          setIsLoading(false);
        }
      };
      getArticles();
    }
  }, [loading, token, pageNumber]);

  const startItem = articles
    ? articles.length + (pageNumber - 1) * 10 - articles.length + 1
    : 0;
  const endItem = articles ? articles.length + (pageNumber - 1) * 10 : 0;

  if (isLoading) return <Loading />;

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
        <button
          onClick={() => router.push("/admin/articles/create")}
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
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <Plus size={14} />
          Add Article
        </button>
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
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "var(--noir-card)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
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
                    <Status status={article.status} />
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
                          icon: <Eye size={13} />,
                          action: () =>
                            router.push(`/admin/articles/${article.id}`),
                          title: "View",
                        },
                        {
                          icon: <SquarePen size={13} />,
                          action: () =>
                            router.push(`/admin/articles/${article.id}/update`),
                          title: "Edit",
                        },
                        {
                          icon: <Trash2 size={13} />,
                          action: () => handleDeleteArticle(article.id),
                          title: "Delete",
                          danger: true,
                        },
                      ].map((btn, i) => (
                        <button
                          key={i}
                          title={btn.title}
                          onClick={btn.action}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 30,
                            height: 30,
                            borderRadius: 4,
                            background: "transparent",
                            border: `0.5px solid var(--noir-border-md)`,
                            color: btn.danger ? "#ff4444" : "var(--noir-muted)",
                            cursor: "pointer",
                            transition: "border-color 0.2s, color 0.2s",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = btn.danger
                              ? "#ff4444"
                              : "var(--noir-accent)";
                            e.currentTarget.style.color = btn.danger
                              ? "#ff4444"
                              : "var(--noir-accent)";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.borderColor =
                              "var(--noir-border-md)";
                            e.currentTarget.style.color = btn.danger
                              ? "#ff4444"
                              : "var(--noir-muted)";
                          }}
                        >
                          {btn.icon}
                        </button>
                      ))}
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
                action: () => setPageNumber((p) => p - 1),
              },
              {
                icon: <ChevronRight size={14} />,
                disabled: pageNumber === totalPages,
                action: () => setPageNumber((p) => p + 1),
              },
            ].map((btn, i) => (
              <button
                key={i}
                disabled={btn.disabled}
                onClick={btn.action}
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
                onMouseOver={(e) => {
                  if (!btn.disabled) {
                    e.currentTarget.style.borderColor = "var(--noir-accent)";
                    e.currentTarget.style.color = "var(--noir-accent)";
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = btn.disabled
                    ? "var(--noir-border)"
                    : "var(--noir-border-md)";
                  e.currentTarget.style.color = btn.disabled
                    ? "var(--noir-subtle)"
                    : "var(--noir-muted)";
                }}
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
