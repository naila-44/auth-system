// app/login/page.tsx
"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) setError(data.error || "Login failed");
    else router.push("/dashboard");
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 480, margin: "2rem auto" }}>
      <h2>Login</h2>
      <input placeholder="Email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} />
      <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form,password:e.target.value})} />
      <button type="submit">Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p><a href="/forgot">Forgot password?</a></p>
    </form>
  );
}
