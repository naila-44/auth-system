
"use client";

import { useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useParams();
  const token = params.token;

  async function handleResetPassword(e: FormEvent) {
    e.preventDefault();

    if (!password || !confirm) {
      setMsg("Please fill in both fields.");
      return;
    }
    if (password !== confirm) {
      setMsg("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setMsg(null);

      const res = await fetch(`/api/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMsg("✅ Password reset successfully. Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setMsg(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8ede3] to-[#e3d5ca] px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-sm w-full border border-[#d6ccc2]">
        <h1 className="text-2xl font-bold text-[#7f5539] text-center mb-2">
          Reset Password
        </h1>
        <p className="text-gray-600 text-center text-sm mb-6">
          Enter and confirm your new password below.
        </p>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-[#7f5539] outline-none"
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-[#7f5539] outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7f5539] hover:bg-[#9c6644] text-white font-semibold py-2 rounded-md transition disabled:opacity-70"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          {msg && <p className="text-center text-sm text-gray-700 mt-3">{msg}</p>}
        </form>
      </div>
    </div>
  );
}
