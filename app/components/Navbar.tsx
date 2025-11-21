"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Search, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const searchRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef]);

  useEffect(() => {
    if (status === "authenticated") {
      router.refresh(); 
    }
  }, [status, router]);

  return (
    <header className="fixed top-0 left-0 h-15 w-full shadow-md bg-gradient-to-r from-[#b08968] via-[#d6ccc2] to-[#e3d5ca] text-[#3e2723] z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold tracking-wide text-[#3e2723]">
          <span className="text-[#7f5539]">Whisply</span>
        </Link>

        <nav className="flex items-center space-x-10 text-sm font-medium">
          <Link href="/" className="hover:text-[#7f5539] transition">Home</Link>
          <Link href="/about" className="hover:text-[#7f5539] transition">About</Link>
          <Link href="/dashboard" className="hover:text-[#7f5539] transition">Dashboard</Link>
          <Link href="/Blog" className="hover:text-[#7f5539] transition">Blogs</Link>
        </nav>

        <div className="flex items-center space-x-5">
         
          <div ref={searchRef} className="relative flex items-center">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center justify-center p-1 hover:text-[#7f5539] transition"
            >
              <Search size={18} />
            </button>
            {searchOpen && (
              <input
                type="text"
                placeholder="Search..."
                autoFocus
                className="absolute right-0 top-full mt-2 bg-[#f8f5f2] text-[#3e2723] rounded-md px-3 py-1 shadow focus:outline-none border border-[#d6ccc2] w-48"
              />
            )}
          </div>

         
          {status === "loading" ? (
            <span className="text-sm text-[#7f5539]/70">Loading...</span>
          ) : session ? (
            <div className="flex items-center space-x-3">
              <Link href="/profile" className="hover:text-[#7f5539] transition">
                <User size={20} />
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm border border-[#7f5539]/40 px-3 py-1 rounded-md hover:bg-[#7f5539] hover:text-white transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  );
}
