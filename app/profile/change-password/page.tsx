// app/profile/change-password/page.tsx
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
    if (!res.ok) setMsg(data.error || "Failed");
    else {
      setMsg("Password changed successfully");
      setTimeout(() => router.push("/dashboard"), 1000);
    }
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 480, margin: "2rem auto" }}>
      <h2>Change Password</h2>
      <input type="password" placeholder="Current password" value={form.currentPassword} onChange={e => setForm({...form,currentPassword:e.target.value})} />
      <input type="password" placeholder="New password" value={form.newPassword} onChange={e => setForm({...form,newPassword:e.target.value})} />
      <button type="submit">Change</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
