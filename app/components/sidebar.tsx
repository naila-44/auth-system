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
  MessageSquare,
  Bookmark,
  Bell,
} from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={18} /> },
    { name: "My Posts", href: "/posts", icon: <FileText size={18} /> },
    { name: "Analytics", href: "/analytics", icon: <BarChart2 size={18} /> },
   
  ];

  const bottomLinks = [
    { name: "Profile", href: "/profile", icon: <User size={18} /> },
    { name: "Settings", href: "/setting", icon: <Settings size={18} /> },
    { name: "Logout", href: "/logout", icon: <LogOut size={18} /> },
  ];

  return (
    <div
      className={`bg-white border-r shadow-sm transition-all duration-300 h-screen flex flex-col justify-between ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
    
      <div className="p-4">
     
        <div className="flex items-center justify-between mb-8">
          {!collapsed && (
            <Link href="/" className="text-2xl font-bold text-[#7f5539] tracking-wide">
              
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded hover:bg-[#f0e6d8]"
          >
            <Menu size={20} className="text-[#7f5539]" />
          </button>
        </div>

     
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
