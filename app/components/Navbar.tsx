"use client";

import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full shadow-md bg-gradient-to-r from-[#b08968] via-[#d6ccc2] to-[#e3d5ca] text-[#3e2723] z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wide text-[#3e2723]">
          <span className="text-[#7f5539]">Whisply</span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center space-x-10 text-sm font-medium">
          <Link href="/" className="hover:text-[#7f5539] transition">
            Home
          </Link>
          <Link href="#about" className="hover:text-[#7f5539] transition">
            About
          </Link>
          <Link href="/dashboard" className="hover:text-[#7f5539] transition">
            Dashboard
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-5">
          {/* Search */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hover:text-[#7f5539] transition"
            >
              <Search size={18} />
            </button>
            {searchOpen && (
              <input
                type="text"
                placeholder="Search..."
                className="absolute right-0 top-10 bg-[#f8f5f2] text-[#3e2723] rounded-md px-3 py-1 shadow focus:outline-none border border-[#d6ccc2]"
              />
            )}
          </div>

          {/* Auth Buttons */}
          <Link
            href="/login"
            className="hover:text-[#7f5539] transition border border-[#7f5539]/40 px-4 py-1.5 rounded-md"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-[#7f5539] text-[#f8f5f2] px-4 py-1.5 rounded-md font-semibold hover:bg-[#9c6644] transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
