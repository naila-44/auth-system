// app/reset/[token]/page.tsx
"use client";
import { useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResetPage() {
  const { token } = useParams() as { token?: string };
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    if (!res.ok) setMsg(data.error || "Reset failed");
    else {
      setMsg("Password reset successful. Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    }
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 480, margin: "2rem auto" }}>
      <h2>Reset Password</h2>
      <input type="password" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Reset</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
