"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setMsg(null);

    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg("✅ Login successful! Redirecting...");
       
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } else {
        setMsg(data.message || data.error || "Login failed!");
      }
    } catch {
      setMsg("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        backgroundColor: "#ede0d4",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ width: "500px", margin: "20px auto", padding: "10px" }}>
        <form
          onSubmit={handleLogin}
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
            <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#7f5539" }}>
              Login
            </h1>
          </div>

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{
              width: "100%",
              marginBottom: "10px",
              padding: "8px 12px",
              border: "1px solid #b08968",
              borderRadius: "6px",
              boxSizing: "border-box",
              outlineColor: "#7f5539",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{
              width: "100%",
              marginBottom: "10px",
              padding: "8px 12px",
              border: "1px solid #b08968",
              borderRadius: "6px",
              boxSizing: "border-box",
              outlineColor: "#7f5539",
            }}
          />

          <button
            type="submit"
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
            {loading ? "Logging in..." : "Login"}
          </button>

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
            Don’t have an account?{" "}
            <Link
              href="/signup"
              style={{ textDecoration: "none", color: "#9c6644", fontWeight: "bold" }}
            >
              Sign Up
            </Link>
          </span>
          <br />
          <Link
            href="/forgot-password"
            style={{
              fontSize: "13px",
              color: "#b08968",
              textDecoration: "underline",
            }}
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
