"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, ChevronDown, LogOut } from "lucide-react";

export default function DashboardHeader() {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 🔹 Fetch user info on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success) setUser(data.user);
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    };
    fetchUser();
  }, []);

  // 🔹 Logout
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert("Logged out successfully!");
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="fixed top-0 w-full h-15 flex items-center justify-between px-4 bg-gradient-to-r from-[#e8d8c3] to-[#d9bfa6] shadow-md z-50 backdrop-blur-sm">
      <h1 className="text-lg font-bold text-[#7f5539]">Dashboard</h1>

      <div className="flex items-center gap-2 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search posts..."
          className="pl-2 pr-2 py-0.5 rounded-lg border border-b-amber-900 focus:outline-none focus:ring-2 focus:ring-[#9c6644]/60 text-sm text-gray-800 flex items-center justify-between"
        />

        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="hover:bg-[#f5e9dc]/70 p-1.5 rounded-full transition"
        >
          <Bell size={16} className="text-[#7f5539]" />
        </button>

        {showNotifications && (
          <div className="absolute right-0 mt-10 w-56 bg-white/60 backdrop-blur-md shadow-lg rounded-lg p-2 text-sm">
            No new notifications 
          </div>
        )}

        <span className="text-[#7f5539] text-sm font-medium hidden sm:block">
          Hi, {user?.name || "Loading..."} 
        </span>

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-1.5 bg-[#f5e9dc]/80 px-1.5 py-0.5 rounded-full hover:shadow-sm transition"
          >
            <div className="w-6 h-6 rounded-full bg-[#7f5539] flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <ChevronDown size={14} color="#7f5539" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-1.5 w-36 bg-white/60 backdrop-blur-md shadow-md rounded-lg p-1.5 text-[#7f5539] text-sm">
              <Link href="/profile" className="block py-1 px-2 hover:bg-[#f5e9dc]/70 rounded">
                Profile
              </Link>
              <Link href="/settings" className="block py-1 px-2 hover:bg-[#f5e9dc]/70 rounded">
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left py-1 px-2 hover:bg-[#f5e9dc]/70 rounded"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>

        <Link
          href="/dashboard/new-post"
          className="bg-[#7f5539] text-white px-2 py-1.5 rounded-lg hover:bg-[#9c6644] transition-all shadow-sm hover:shadow-md text-sm"
        >
          + New Post
        </Link>
      </div>
    </header>
  );
}
