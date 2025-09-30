// app/signup/page.tsx
"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) setError(data.error ? JSON.stringify(data.error) : "Signup failed");
    else router.push("/login");
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 480, margin: "2rem auto" }}>
      <h2>Signup</h2>
      <input placeholder="Email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} />
      <input placeholder="Username" value={form.username} onChange={e => setForm({...form,username:e.target.value})} />
      <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form,password:e.target.value})} />
      <button type="submit">Create account</button>
      {error && <pre style={{ color: "red" }}>{error}</pre>}
    </form>
  );
}
