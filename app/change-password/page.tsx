
"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) setMsg(data.error || "Failed to change password");
    else {
      setMsg("Password changed successfully");
      setTimeout(() => router.push("/dashboard"), 1500);
    }
  }

  return (
    <div
      style={{
        backgroundColor: "lightsteelblue",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "500px",
          border: "0px solid #000",
          margin: "20px auto",
          padding: "10px",
        }}
      >
        <div
          style={{
            width: "250px",
            margin: "10px auto",
            backgroundColor: "#fff",
            border: "2px solid #e6e6e6",
            padding: "40px 50px",
            borderRadius: "6px",
          }}
        >
         
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#000",
              }}
            >
              Change Password
            </h1>
          </div>
          <input
            type="password"
            placeholder="Current Password"
            value={form.currentPassword}
            onChange={(e) =>
              setForm({ ...form, currentPassword: e.target.value })
            }
            style={{
              width: "100%",
              marginBottom: "10px",
              padding: "8px 12px",
              border: "1px solid #dbdbdb",
              borderRadius: "3px",
              boxSizing: "border-box",
            }}
          />
          <input
            type="password"
            placeholder="New Password"
            value={form.newPassword}
            onChange={(e) =>
              setForm({ ...form, newPassword: e.target.value })
            }
            style={{
              width: "100%",
              marginBottom: "10px",
              padding: "8px 12px",
              border: "1px solid #dbdbdb",
              borderRadius: "3px",
              boxSizing: "border-box",
            }}
          />
          <input
            type="submit"
            value="Change Password"
            onClick={submit}
            style={{
              width: "100%",
              backgroundColor: "darkblue",
              border: "1px solid",
              padding: "8px 12px",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              borderRadius: "3px",
            }}
          />
          {msg && (
            <p
              style={{
                marginTop: "10px",
                textAlign: "center",
                fontSize: "14px",
                color: msg.startsWith("✅") ? "green" : "red",
              }}
            >
              {msg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
