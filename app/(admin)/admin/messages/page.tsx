"use client";
import { useState, useEffect } from "react";
import { Eye, Trash2, Mail, MessageSquare, X } from "lucide-react";
import { Message } from "@/public/lib/types";
import { useUser } from "@/public/providers/UserProvider";

const monoLabel = {
  fontFamily: "var(--font-mono)",
  fontSize: "10px",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: "var(--noir-muted)",
} as const;

const statusMap = {
  new: {
    color: "var(--noir-accent)",
    bg: "var(--noir-accent-bg)",
    text: "Mới",
  },
  read: { color: "#f0a800", bg: "rgba(240,168,0,0.08)", text: "Đã đọc" },
  replied: {
    color: "#4ade80",
    bg: "rgba(74,222,128,0.08)",
    text: "Đã trả lời",
  },
};

const Status = ({ status }: { status: string }) => {
  const cfg = statusMap[status as keyof typeof statusMap] ?? statusMap.new;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "var(--font-mono)",
        fontSize: "9px",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: cfg.color,
        background: cfg.bg,
        border: `0.5px solid ${cfg.color}30`,
        padding: "3px 8px",
        borderRadius: "3px",
      }}
    >
      {cfg.text}
    </span>
  );
};

export default function AdminContactsPage() {
  const { token, loading } = useUser();
  const [contacts, setContacts] = useState<Message[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Message | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!loading && token) fetchContacts();
  }, [pageNumber, loading, token]);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      // const response = await contactAPI.getContacts(pageNumber, 10, token)
      // if (response.success) {
      //     setContacts(response.data)
      //     setTotalContacts(response.pagination.total)
      //     setTotalPages(response.pagination.total_pages)
      // }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewContact = async (id: number) => {
    try {
      //   const response = await contactAPI.getContactById(id);
      //   if (response.success) {
      //     setSelectedContact(response.data);
      //     setShowModal(true);
      //   }
    } catch (error) {
      console.error("Error fetching contact:", error);
    }
  };

  const handleDeleteContact = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa tin nhắn này?")) {
      console.log("Delete contact:", id);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("vi-VN");

  const iconBtn = (
    onClick: () => void,
    icon: React.ReactNode,
    danger = false,
  ) => (
    <button
      onClick={onClick}
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
        el.style.borderColor = danger ? "#ff4444" : "var(--noir-accent)";
        el.style.color = danger ? "#ff4444" : "var(--noir-accent)";
        el.style.background = danger
          ? "rgba(255,68,68,0.06)"
          : "var(--noir-accent-bg)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--noir-border)";
        el.style.color = "var(--noir-muted)";
        el.style.background = "transparent";
      }}
    >
      {icon}
    </button>
  );

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
              Tin nhắn liên hệ
            </h1>
          </div>
          <p style={{ ...monoLabel, paddingLeft: "13px" }}>
            Tổng {totalContacts} tin nhắn
          </p>
        </div>
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
        {isLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                border: "1.5px solid var(--noir-accent)",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <span style={monoLabel}>Đang tải...</span>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--noir-card)" }}>
                {["Tên", "Email", "Nội dung", "Trạng thái", "Ngày gửi", ""].map(
                  (h, i) => (
                    <th
                      key={i}
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
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {contacts && contacts.length > 0 ? (
                contacts.map((contact) => (
                  <tr
                    key={contact.id}
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
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: "13px",
                        color: "var(--noir-white)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {contact.name}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        color: "var(--noir-muted)",
                      }}
                    >
                      {contact.email}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontSize: "13px",
                        color: "var(--noir-muted)",
                        maxWidth: "200px",
                      }}
                    >
                      <div
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {contact.message}
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {/* <Status status={contact.status} /> */}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        color: "var(--noir-muted)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {/* {formatDate(contact.created_at)} */}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {iconBtn(
                          () => handleViewContact(contact.id),
                          <Eye size={13} />,
                        )}
                        {iconBtn(
                          () => handleDeleteContact(contact.id),
                          <Trash2 size={13} />,
                          true,
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
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
                      <MessageSquare size={40} color="var(--noir-subtle)" />
                      <div style={monoLabel}>Chưa có tin nhắn nào</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>

            {/* Pagination footer */}
            {contacts.length > 0 && (
              <tfoot>
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "14px 16px",
                      borderTop: "0.5px solid var(--noir-border)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ ...monoLabel, fontSize: "10px" }}>
                        {contacts.length > 0 ? (pageNumber - 1) * 10 + 1 : 0}–
                        {Math.min(pageNumber * 10, totalContacts)} /{" "}
                        {totalContacts}
                      </span>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          className="noir-read-btn-ghost"
                          style={{
                            padding: "6px 16px",
                            opacity: pageNumber === 1 ? 0.4 : 1,
                            cursor:
                              pageNumber === 1 ? "not-allowed" : "pointer",
                          }}
                          disabled={pageNumber === 1}
                          onClick={() => setPageNumber((p) => p - 1)}
                        >
                          ← Prev
                        </button>
                        <button
                          className="noir-read-btn-ghost"
                          style={{
                            padding: "6px 16px",
                            opacity: pageNumber === totalPages ? 0.4 : 1,
                            cursor:
                              pageNumber === totalPages
                                ? "not-allowed"
                                : "pointer",
                          }}
                          disabled={pageNumber === totalPages}
                          onClick={() => setPageNumber((p) => p + 1)}
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedContact && (
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
              maxWidth: "540px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            {/* Modal header */}
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
                  Detail
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
                  Chi tiết tin nhắn
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
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

            {/* Fields */}
            {[
              { label: "Họ tên", value: selectedContact.name },
              { label: "Email", value: selectedContact.email },
              {
                label: "Ngày gửi",
                value: formatDate(selectedContact.created_at ?? ""),
              },
            ].map((f) => (
              <div
                key={f.label}
                style={{
                  marginBottom: "16px",
                  paddingBottom: "16px",
                  borderBottom: "0.5px solid var(--noir-border)",
                }}
              >
                <div style={{ ...monoLabel, marginBottom: "6px" }}>
                  {f.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    color: "var(--noir-white)",
                  }}
                >
                  {f.value}
                </div>
              </div>
            ))}

            <div
              style={{
                marginBottom: "16px",
                paddingBottom: "16px",
                borderBottom: "0.5px solid var(--noir-border)",
              }}
            >
              <div style={{ ...monoLabel, marginBottom: "6px" }}>
                Trạng thái
              </div>
              {/* <Status status={selectedContact.status} /> */}
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={{ ...monoLabel, marginBottom: "8px" }}>Nội dung</div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  color: "rgba(244,244,240,0.8)",
                  lineHeight: 1.75,
                  background: "var(--noir-card)",
                  border: "0.5px solid var(--noir-border)",
                  borderRadius: "5px",
                  padding: "14px 16px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {selectedContact.message}
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                className="noir-read-btn-ghost"
              >
                Đóng
              </button>
              <a
                href={`mailto:${selectedContact.email}`}
                className="noir-read-btn"
                style={{ textDecoration: "none" }}
              >
                <Mail size={13} />
                Trả lời
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
