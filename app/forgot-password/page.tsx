"use client";

import { useState, FormEvent } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleForgotPassword(e: FormEvent) {
    e.preventDefault();

    if (!email) {
      setMsg("⚠️ Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      setMsg(null);

      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setMsg("✅ Password reset link has been sent to your email.");
      } else {
        const text = await res.text();
        setMsg(`❌ ${text}`);
      }
    } catch (err) {
      console.error(err);
      setMsg("⚠️ Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8ede3] to-[#e3d5ca] px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-sm w-full border border-[#d6ccc2]">
        <h1 className="text-2xl font-bold text-[#7f5539] text-center mb-2">
          Forgot Password
        </h1>
        <p className="text-gray-600 text-center text-sm mb-6">
          Enter your registered email to reset your password.
        </p>

        <form onSubmit={handleForgotPassword} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-[#7f5539] outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7f5539] hover:bg-[#9c6644] text-white font-semibold py-2 rounded-md transition disabled:opacity-70"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          {msg && (
            <p className="text-center text-sm text-gray-800 mt-3">{msg}</p>
          )}
        </form>
      </div>
    </div>
  );
}
