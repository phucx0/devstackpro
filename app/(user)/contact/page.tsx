"use client";
import React, { useState } from "react";
import {
  Mail,
  User,
  MessageSquare,
  Send,
  Globe,
  Youtube,
  CheckCircle2,
} from "lucide-react";
import { MessageFormData } from "@/public/lib/types";

export default function ContactPage() {
  const [formData, setFormData] = useState<MessageFormData>({
    name: "",
    message: "",
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<MessageFormData>>({});

  const validate = () => {
    const newErrors: Partial<MessageFormData> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof MessageFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      // const result = await contactAPI.submit(formData);
      // if (result.success) {
      //   setFormData({ name: "", email: "", message: "" });
      //   setSubmitted(true);
      //   setTimeout(() => setSubmitted(false), 5000);
      // } else {
      //   alert(result.message || "Failed to send message. Please try again.");
      // }
    } catch (err) {
      console.error("Submit error:", err);
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="noir-main">
      <div
        className="noir-container"
        style={{ paddingTop: "56px", paddingBottom: "80px" }}
      >
        {/* Page header */}
        <div style={{ marginBottom: "48px" }}>
          <span className="category-label">Get In Touch</span>
          <h1 className="noir-contact-title" style={{ marginTop: "12px" }}>
            Let's <span>Talk</span>
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "var(--noir-muted)",
              lineHeight: "1.7",
              marginTop: "12px",
              maxWidth: "480px",
            }}
          >
            Send a message and I'll get back to you as soon as possible.
          </p>
        </div>

        {/* Grid */}
        <div className="contact-grid">
          {/* Form */}
          <div
            style={{
              background: "var(--noir-surface)",
              border: "0.5px solid var(--noir-border)",
              borderRadius: "10px",
              padding: "36px",
            }}
          >
            {submitted ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "64px 24px",
                  textAlign: "center",
                  gap: "16px",
                }}
              >
                <CheckCircle2
                  size={48}
                  color="var(--noir-accent)"
                  strokeWidth={1.5}
                />
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "24px",
                    color: "var(--noir-white)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Message Sent!
                </h2>
                <p style={{ color: "var(--noir-muted)", fontSize: "14px" }}>
                  Thank you for reaching out. I'll respond within 24–48 hours.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                {/* Name */}
                <div className="noir-field">
                  <label
                    className="noir-label"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <User size={11} /> Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="noir-input"
                    style={errors.name ? { borderColor: "#ff4d4d" } : {}}
                  />
                  {errors.name && <p className="field-error">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="noir-field">
                  <label
                    className="noir-label"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Mail size={11} /> Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className="noir-input"
                    style={errors.email ? { borderColor: "#ff4d4d" } : {}}
                  />
                  {errors.email && (
                    <p className="field-error">{errors.email}</p>
                  )}
                </div>

                {/* Message */}
                <div className="noir-field">
                  <label
                    className="noir-label"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <MessageSquare size={11} /> Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Enter your message..."
                    rows={6}
                    className="noir-textarea"
                    style={errors.message ? { borderColor: "#ff4d4d" } : {}}
                  />
                  {errors.message && (
                    <p className="field-error">{errors.message}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="noir-read-btn"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    padding: "14px 24px",
                    fontSize: "12px",
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside
            style={{
              position: "sticky",
              top: "calc(var(--header-h) + 24px)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {[
              {
                icon: <Mail size={16} />,
                label: "Email",
                value: "phamhoangphuc613p@gmail.com",
                href: "mailto:phamhoangphuc613p@gmail.com",
              },
              {
                icon: <Globe size={16} />,
                label: "Website",
                value: "devstackpro.cloud",
                href: "https://devstackpro.cloud/",
              },
              {
                icon: <Youtube size={16} />,
                label: "YouTube",
                value: "@DevStackPro",
                href: "https://www.youtube.com/@DevStackPro",
              },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="contact-channel-card"
              >
                <div className="contact-channel-icon">{item.icon}</div>
                <div style={{ overflow: "hidden" }}>
                  <p className="category-label" style={{ marginBottom: "3px" }}>
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--noir-white)",
                      fontFamily: "var(--font-mono)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              </a>
            ))}

            {/* Response badge */}
            <div
              style={{
                background: "var(--noir-accent-bg)",
                border: "0.5px solid var(--noir-border-md)",
                borderRadius: "8px",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span className="accent-dot" style={{ flexShrink: 0 }} />
              <p
                style={{
                  fontSize: "12px",
                  fontFamily: "var(--font-mono)",
                  color: "var(--noir-muted)",
                  letterSpacing: "0.05em",
                }}
              >
                Response time:{" "}
                <span style={{ color: "var(--noir-accent)" }}>24–48 hours</span>
              </p>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
                .contact-grid {
                    display: grid;
                    grid-template-columns: 1fr 300px;
                    gap: 32px;
                    align-items: start;
                }
                .contact-channel-card {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    background: var(--noir-surface);
                    border: 0.5px solid var(--noir-border);
                    border-radius: 8px;
                    padding: 18px 20px;
                    text-decoration: none;
                    transition: border-color 0.2s, background 0.2s;
                }
                .contact-channel-card:hover {
                    border-color: var(--noir-accent);
                    background: var(--noir-accent-bg);
                }
                .contact-channel-icon {
                    width: 36px;
                    height: 36px;
                    background: var(--noir-accent-bg);
                    border: 0.5px solid var(--noir-border-md);
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--noir-accent);
                    flex-shrink: 0;
                }
                .field-error {
                    color: #ff6b6b;
                    font-size: 11px;
                    font-family: var(--font-mono);
                    margin-top: 6px;
                    letter-spacing: 0.05em;
                }
                .spinner {
                    width: 13px;
                    height: 13px;
                    border: 2px solid rgba(8,8,8,0.25);
                    border-top-color: var(--noir-black);
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                    display: inline-block;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 768px) {
                    .contact-grid {
                        grid-template-columns: 1fr;
                    }
                    aside {
                        position: static !important;
                    }
                }
            `}</style>
    </div>
  );
}
