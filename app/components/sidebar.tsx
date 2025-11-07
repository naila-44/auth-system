"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Home,
  FileText,
  BarChart2,
  User,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={18} /> },
    { name: "My Posts", href: "/dashboard/posts", icon: <FileText size={18} /> },
    { name: "Analytics", href: "/analytics", icon: <BarChart2 size={18} /> },
  ];

  const bottomLinks = [
    { name: "Profile", href: "/profile", icon: <User size={18} /> },
    { name: "Settings", href: "/setting", icon: <Settings size={18} /> },
    { name: "Logout", href: "/logout", icon: <LogOut size={18} /> },
  ];

  return (
    <div
      className={`bg-white border-r shadow-sm transition-all duration-300 h-screen flex flex-col justify-between border-amber-50 ${
        collapsed ? "w-16" : "w-50"
      }`}
    >
      <div className="p-4">
        {/* Top section */}
        <div className="flex items-center justify-between mb-8">
          {!collapsed && (
            <Link
              href="/"
              className="text-2xl font-bold text-[#7f5539] tracking-wide"
            >
              Whisply
            </Link>
          )}
          {/* Menu button - only visible on mobile */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded hover:bg-[#f0e6d8] lg:hidden"
          >
            <Menu size={20} className="text-[#7f5539]" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className={`flex items-center gap-3 p-2 rounded-md hover:bg-[#f0e6d8] text-[#5a4730] font-medium ${
                collapsed ? "justify-center" : ""
              }`}
            >
              {link.icon}
              {!collapsed && <span>{link.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Links */}
      <div className="p-4 border-t space-y-1">
        {bottomLinks.map((link, idx) => (
          <Link
            key={idx}
            href={link.href}
            className={`flex items-center gap-3 p-2 rounded-md hover:bg-[#f0e6d8] text-[#5a4730] font-medium ${
              collapsed ? "justify-center" : ""
            }`}
          >
            {link.icon}
            {!collapsed && <span>{link.name}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}
