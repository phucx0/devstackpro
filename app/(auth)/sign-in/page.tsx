"use client";
import { useAuth } from "@/public/providers/AuthProvider";
import { signInAction } from "@/server/users/user.actions";
import { useRouter } from "next/navigation";
import { useState, KeyboardEvent } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setProfile } = useAuth();

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const result = await signInAction(email, password);
      if (result.user) {
        setProfile(result.user);
        router.push("/");
        router.refresh();
      } else {
        setError("Invalid email or password.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSignIn();
  };

  return (
    <div className="noir-auth-wrap">
      <div style={{ width: "100%", maxWidth: 420 }}>
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

        <div className="noir-auth-card">
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <p className="category-label" style={{ marginBottom: 10 }}>
              ✦ Welcome back
            </p>
            <h1 className="noir-auth-title">Sign In</h1>
            <p className="noir-auth-sub">
              New here?{" "}
              <a
                href="/sign-up"
                style={{
                  color: "var(--noir-accent)",
                  textDecoration: "underline",
                }}
              >
                Create an account
              </a>
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div
              style={{
                background: "rgba(255,80,80,0.08)",
                border: "0.5px solid rgba(255,80,80,0.3)",
                borderRadius: 6,
                padding: "10px 14px",
                marginBottom: 20,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "#ff6b6b",
                letterSpacing: "0.04em",
              }}
            >
              {error}
            </div>
          )}

          {/* Email */}
          <div className="noir-field">
            <label className="noir-label" htmlFor="si-user">
              Email
            </label>
            <input
              id="si-user"
              className="noir-input"
              type="text"
              placeholder="your_email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={onKey}
              autoComplete="email"
              autoFocus
            />
          </div>

          {/* Password */}
          <div className="noir-field">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <label
                className="noir-label"
                htmlFor="si-pass"
                style={{ margin: 0 }}
              >
                Password
              </label>
              <a
                href="/forgot-password"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--noir-muted)",
                  textDecoration: "none",
                  letterSpacing: "0.08em",
                }}
              >
                FORGOT?
              </a>
            </div>
            <div style={{ position: "relative" }}>
              <input
                id="si-pass"
                className="noir-input"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={onKey}
                autoComplete="current-password"
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
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
                {showPassword ? (
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
          </div>

          {/* Submit */}
          <button
            onClick={handleSignIn}
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
              "Signing in…"
            ) : (
              <>
                Sign In{" "}
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

          {/* Divider */}
          {/* <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "24px 0",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "0.5px",
                background: "var(--noir-border)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.1em",
                color: "var(--noir-subtle)",
              }}
            >
              OR
            </span>
            <div
              style={{
                flex: 1,
                height: "0.5px",
                background: "var(--noir-border)",
              }}
            />
          </div> */}

          {/* Google */}
          {/* <button
            onClick={handleSignInWithGoogle}
            className="noir-read-btn-ghost"
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "11px 18px",
              fontSize: 11,
              gap: 8,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button> */}
        </div>
      </div>
    </div>
  );
}
