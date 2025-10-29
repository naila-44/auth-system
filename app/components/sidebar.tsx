"use client";

import Link from "next/link";
import { Home, FileText, BarChart2, User, Menu } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: <Home size={18} /> },
    { name: "Posts", href: "/posts", icon: <FileText size={18} /> },
    { name: "Analytics", href: "/analytics", icon: <BarChart2 size={18} /> },
    { name: "Profile", href: "/profile", icon: <User size={18} /> },
  ];

  return (
    <div
      className={`bg-white rounded shadow p-4 transition-all duration-300 h-screen overflow-y-auto ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-4 flex items-center justify-center w-full p-2 bg-[#f0e6d8] rounded hover:bg-[#e8d8c3]"
      >
        <Menu size={20} />
      </button>

      {/* Navigation Links */}
      <nav className="space-y-2">
        {links.map((link, idx) => (
          <Link
            key={idx}
            href={link.href}
            className={`flex items-center gap-2 p-2 rounded hover:bg-[#f0e6d8] text-[#5a4730] font-medium ${
              collapsed ? "justify-center" : ""
            }`}
          >
            {link.icon}
            {!collapsed && <span>{link.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}
