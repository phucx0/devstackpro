"use client";
import { signUpAction } from "@/server/users/user.actions";
import { redirect } from "next/navigation";
import { useCallback, useState } from "react";

const strengthLabel = (p: string) => {
  if (!p) return null;
  if (p.length < 6) return { label: "Weak", color: "#ff6b6b", w: "33%" };
  if (p.length < 10 || !/[^a-zA-Z0-9]/.test(p))
    return { label: "Fair", color: "#ffaa00", w: "66%" };
  return { label: "Strong", color: "var(--noir-accent)", w: "100%" };
};

type FormKey =
  | "username"
  | "displayName"
  | "email"
  | "password"
  | "confirmPassword";

const Field = ({
  id,
  label,
  k,
  type = "text",
  placeholder,
  extra,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  k: FormKey;
  type?: string;
  placeholder: string;
  extra?: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) => (
  <div className="noir-field">
    <label className="noir-label" htmlFor={id}>
      {label}
    </label>
    <div style={{ position: "relative" }}>
      <input
        id={id}
        className="noir-input"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          paddingRight: extra ? 44 : undefined,
          borderColor: error ? "rgba(255,80,80,0.5)" : undefined,
        }}
      />
      {extra}
    </div>
    {error && (
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "#ff6b6b",
          letterSpacing: "0.04em",
          marginTop: 5,
        }}
      >
        {error}
      </p>
    )}
  </div>
);

export default function SignUp() {
  const [form, setForm] = useState({
    username: "",
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = useCallback(
    (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
    },
    [],
  );

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.username.trim()) e.username = "Required";
    if (!form.displayName.trim()) e.displayName = "Required";
    if (!form.email.includes("@")) e.email = "Invalid email";
    if (form.password.length < 6) e.password = "Min 6 characters";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await signUpAction(
        form.username,
        form.password,
        form.displayName,
        form.email,
      );
      if (result.user) {
        localStorage.setItem("token", result.session?.access_token ?? "");
        redirect("/sign-in");
      }
    } finally {
      setLoading(false);
    }
  };

  const strength = strengthLabel(form.password);

  return (
    <div className="noir-auth-wrap" style={{ padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        {/* Logo */}
        <a
          href="/"
          className="noir-logo"
          style={{ marginBottom: 40, display: "flex" }}
        >
          <div className="noir-logo-mark">
            <svg viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" fill="#080808" />
              <rect x="8" y="1" width="5" height="5" fill="#080808" />
              <rect x="1" y="8" width="5" height="5" fill="#080808" />
              <rect
                x="8"
                y="8"
                width="5"
                height="5"
                fill="#080808"
                opacity="0.4"
              />
            </svg>
          </div>
          <span className="noir-logo-text">DevStack Pro</span>
        </a>

        <div className="noir-auth-card" style={{ maxWidth: 480 }}>
          <div style={{ marginBottom: 32 }}>
            <p className="category-label" style={{ marginBottom: 10 }}>
              ✦ Join the community
            </p>
            <h1 className="noir-auth-title">Create Account</h1>
            <p className="noir-auth-sub">
              Already have one?{" "}
              <a
                href="/sign-in"
                style={{
                  color: "var(--noir-accent)",
                  textDecoration: "underline",
                }}
              >
                Sign in
              </a>
            </p>
          </div>

          {/* Row: username + display name */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <Field
              id="su-user"
              label="Username"
              k="username"
              placeholder="your_handle"
              value={form.username}
              onChange={set("username")}
              error={errors.username}
            />
            <Field
              id="su-name"
              label="Display Name"
              k="displayName"
              placeholder="Jane Doe"
              value={form.displayName}
              onChange={set("displayName")}
              error={errors.displayName}
            />
          </div>

          <Field
            id="su-email"
            label="Email"
            k="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={set("email")}
            error={errors.email}
          />

          {/* Password with show/hide */}
          <div className="noir-field">
            <label className="noir-label" htmlFor="su-pass">
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="su-pass"
                className="noir-input"
                type={showPass ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={set("password")}
                style={{
                  paddingRight: 44,
                  borderColor: errors.password
                    ? "rgba(255,80,80,0.5)"
                    : undefined,
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--noir-muted)",
                  padding: 0,
                  display: "flex",
                }}
              >
                {showPass ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {/* Strength bar */}
            {strength && (
              <div style={{ marginTop: 8 }}>
                <div
                  style={{
                    height: 2,
                    background: "var(--noir-border)",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: strength.w,
                      background: strength.color,
                      transition: "width 0.3s, background 0.3s",
                    }}
                  />
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: strength.color,
                    marginTop: 4,
                    letterSpacing: "0.08em",
                  }}
                >
                  {strength.label}
                </p>
              </div>
            )}
            {errors.password && (
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "#ff6b6b",
                  marginTop: 5,
                  letterSpacing: "0.04em",
                }}
              >
                {errors.password}
              </p>
            )}
          </div>

          <Field
            id="su-confirm"
            label="Confirm Password"
            k="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={set("confirmPassword")}
            error={errors.confirmPassword}
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            className="noir-read-btn"
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "13px 18px",
              fontSize: 12,
              marginTop: 8,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
              border: "none",
            }}
          >
            {loading ? (
              "Creating account…"
            ) : (
              <>
                Create Account{" "}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>

          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--noir-subtle)",
              textAlign: "center",
              marginTop: 20,
              letterSpacing: "0.04em",
              lineHeight: 1.7,
            }}
          >
            By creating an account you agree to our{" "}
            <a
              href="/terms"
              style={{
                color: "var(--noir-muted)",
                textDecoration: "underline",
              }}
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              style={{
                color: "var(--noir-muted)",
                textDecoration: "underline",
              }}
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
