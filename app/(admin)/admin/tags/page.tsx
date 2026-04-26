"use client";
import { Tag } from "@/public/lib/types";
import { useAuth } from "@/public/providers/AuthProvider";
import { Newspaper, Trash2, Plus, X } from "lucide-react";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

const monoLabel = {
  fontFamily: "var(--font-mono)",
  fontSize: "10px",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: "var(--noir-muted)",
} as const;

export default function TagsPage() {
  const { isAuthLoading } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchTags = async () => {
    setIsLoadingTags(true);
    try {
      // const result = await tagAPI.getAllTags(token)
      // if (result.success) setTags(result.data)
    } catch (err) {
      console.error(err);
      setTags([]);
    } finally {
      setIsLoadingTags(false);
    }
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) {
      setError("Tên tag không được để trống");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      // const result = await tagAPI.createTag(token, newTagName.trim())
      // if (result.success) {
      //     await fetchTags()
      //     setNewTagName("")
      //     setShowAddModal(false)
      // } else {
      //     setError(result.message || "Không thể tạo tag")
      // }
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTag = async (tagId: number) => {
    if (!confirm("Bạn có chắc muốn xóa tag này?")) return;
    try {
      // const result = await tagAPI.deleteTag(token, tagId)
      // if (result.success) await fetchTags()
      // else alert(result.message || "Không thể xóa tag")
    } catch (err: any) {
      alert(err.message || "Đã có lỗi xảy ra");
    }
  };

  // useEffect(() => {
  //   if (!isAuthLoading) fetchTags();
  // }, [isAuthLoading]);

  // if (isAuthLoading || isLoadingTags) return <Loading />;

  return notFound();

  return (
    <div>
      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "28px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                width: "3px",
                height: "22px",
                background: "var(--noir-accent)",
                borderRadius: "2px",
              }}
            />
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(20px, 3vw, 28px)",
                color: "var(--noir-white)",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Quản lý Tags
            </h1>
          </div>
          <p style={{ ...monoLabel, paddingLeft: "13px" }}>
            {tags.length} tags
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="noir-read-btn"
          style={{ gap: "6px" }}
        >
          <Plus size={13} />
          Thêm Tag
        </button>
      </div>

      {/* Table */}
      <div
        style={{
          background: "var(--noir-surface)",
          border: "0.5px solid var(--noir-border)",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--noir-card)" }}>
              {["ID", "Name", "Action"].map((h) => (
                <th
                  key={h}
                  style={{
                    ...monoLabel,
                    padding: "12px 16px",
                    textAlign: "left",
                    borderBottom: "0.5px solid var(--noir-border)",
                    fontWeight: 500,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tags.length > 0 ? (
              tags.map((tag) => (
                <tr
                  key={tag.id}
                  style={{
                    borderBottom: "0.5px solid var(--noir-border)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "var(--noir-card)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "transparent")
                  }
                >
                  <td
                    style={{
                      padding: "14px 16px",
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      color: "var(--noir-muted)",
                    }}
                  >
                    #{String(tag.id).padStart(3, "0")}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span className="noir-tag noir-tag-accent">{tag.name}</span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "32px",
                        height: "32px",
                        background: "transparent",
                        border: "0.5px solid var(--noir-border)",
                        borderRadius: "5px",
                        cursor: "pointer",
                        color: "var(--noir-muted)",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = "#ff4444";
                        el.style.color = "#ff4444";
                        el.style.background = "rgba(255,68,68,0.06)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = "var(--noir-border)";
                        el.style.color = "var(--noir-muted)";
                        el.style.background = "transparent";
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "12px",
                      padding: "60px 0",
                    }}
                  >
                    <Newspaper size={40} color="var(--noir-subtle)" />
                    <div style={{ ...monoLabel }}>Không tìm thấy tag nào</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "var(--noir-surface)",
              border: "0.5px solid var(--noir-border)",
              borderRadius: "8px",
              padding: "28px",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "24px",
              }}
            >
              <div>
                <div
                  style={{
                    ...monoLabel,
                    color: "var(--noir-accent)",
                    marginBottom: "4px",
                  }}
                >
                  New
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "20px",
                    color: "var(--noir-white)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Thêm Tag Mới
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewTagName("");
                  setError("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--noir-muted)",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{ ...monoLabel, display: "block", marginBottom: "8px" }}
              >
                Tên Tag
              </label>
              <input
                type="text"
                value={newTagName}
                onChange={(e) => {
                  setNewTagName(e.target.value);
                  setError("");
                }}
                placeholder="Nhập tên tag..."
                style={{
                  width: "100%",
                  background: "var(--noir-card)",
                  border: "0.5px solid var(--noir-border)",
                  borderRadius: "5px",
                  color: "var(--noir-white)",
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  padding: "10px 14px",
                  outline: "none",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--noir-accent)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "var(--noir-border)")
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isSubmitting) handleAddTag();
                }}
                autoFocus
              />
              {error && (
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    color: "#ff4444",
                    marginTop: "6px",
                    letterSpacing: "0.05em",
                  }}
                >
                  {error}
                </p>
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewTagName("");
                  setError("");
                }}
                className="noir-read-btn-ghost"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                onClick={handleAddTag}
                className="noir-read-btn"
                disabled={isSubmitting}
                style={{ opacity: isSubmitting ? 0.6 : 1 }}
              >
                {isSubmitting ? "Đang tạo..." : "Tạo Tag"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
