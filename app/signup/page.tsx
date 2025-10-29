"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      setMsg("⚠️ Please fill in all fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMsg("❌ Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setMsg("⚠️ Password must be at least 8 characters long.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMsg(data.message || data.error);
    } catch {
      setMsg("⚠️ Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        backgroundColor: "#ede0d4", // nude background
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "500px",
          margin: "20px auto",
          padding: "10px",
        }}
      >
        {/* Main Signup Form */}
        <form
          onSubmit={handleSignup}
          style={{
            width: "350px",
            margin: "10px auto",
            backgroundColor: "#fff",
            border: "2px solid #e6ccb2",
            padding: "40px 50px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#7f5539",
              }}
            >
              Sign Up
            </h1>
          </div>

          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            style={inputStyle}
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={inputStyle}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={inputStyle}
          />

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            style={inputStyle}
          />

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: "#7f5539",
              border: "none",
              padding: "10px 12px",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              borderRadius: "6px",
              transition: "0.3s ease",
              opacity: loading ? 0.8 : 1,
            }}
            onMouseOver={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor = "#9c6644")
            }
            onMouseOut={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor = "#7f5539")
            }
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          {/* Message */}
          {msg && (
            <p
              style={{
                marginTop: "10px",
                textAlign: "center",
                color: "#7f5539",
                fontWeight: "500",
              }}
            >
              {msg}
            </p>
          )}
        </form>

        {/* Sub Content */}
        <div
          style={{
            width: "350px",
            margin: "10px auto",
            border: "1px solid #e6ccb2",
            padding: "20px 50px",
            backgroundColor: "#fff",
            textAlign: "center",
            borderRadius: "10px",
            fontFamily: "'Overpass Mono', monospace",
          }}
        >
          <span style={{ fontSize: "14px", color: "#7f5539" }}>
            Already have an account?{" "}
            <Link
              href="/login"
              style={{
                textDecoration: "none",
                color: "#9c6644",
                fontWeight: "bold",
              }}
            >
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginBottom: "10px",
  padding: "8px 12px",
  border: "1px solid #b08968",
  borderRadius: "6px",
  boxSizing: "border-box" as const,
  outlineColor: "#7f5539",
};
