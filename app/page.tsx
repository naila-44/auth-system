"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "./components/Navbar";
import Link from "next/link";

type Post = {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  author?: string;
};

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    }
    fetchPosts();
  }, []);

  return (
    <main className="bg-[#f8f5f2] min-h-screen scroll-smooth">
      {/* Navbar */}
      <Navbar />

      {/* HERO SECTION */}
      <section
        className="relative text-center py-40 px-6 flex flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-[#f8f5f2]/70 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-6xl font-extrabold text-[#7f5539] mb-4 leading-tight drop-shadow-sm">
            Write. Inspire. <span className="text-[#9c6644]">Whisply.</span>
          </h1>
          <p className="text-[#7f5539]/80 text-lg mb-8 leading-relaxed">
            A serene space where words flow effortlessly — your thoughts,
            your stories, your voice.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/signup"
              className="bg-[#7f5539] text-[#f8f5f2] px-6 py-2 rounded-md font-semibold hover:bg-[#9c6644] transition"
            >
              Start Writing
            </Link>
            <Link
              href="#blogs"
              className="border border-[#7f5539] text-[#7f5539] px-6 py-2 rounded-md font-semibold hover:bg-[#7f5539] hover:text-white transition"
            >
              Explore Stories
            </Link>
          </div>
        </div>
      </section>

      {/* TRENDING / FEATURED POSTS */}
      <section id="blogs" className="max-w-6xl mx-auto py-24 px-6">
        <h2 className="text-4xl font-bold text-[#7f5539] mb-12 text-center">
          Featured <span className="text-[#9c6644]">Stories</span>
        </h2>

        {posts.length === 0 && (
          <p className="text-center text-gray-500">No posts available yet.</p>
        )}

        <div className="grid md:grid-cols-3 gap-10">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white shadow-lg rounded-2xl overflow-hidden border border-[#e6ccb2]/70 hover:shadow-2xl transition-transform transform hover:-translate-y-2"
            >
              {post.imageUrl && (
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={500}
                  height={300}
                  className="w-full h-56 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-[#7f5539] mb-3">
                  {post.title}
                </h3>
                <p className="text-[#7f5539]/70 mb-5 text-base">
                  {post.content.slice(0, 120)}...
                </p>
                <p className="text-sm text-[#9c6644] mb-2">
                  {post.author ? `✍️ ${post.author}` : ""}
                </p>
                <p className="text-xs text-gray-400 mb-2">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <Link
                  href={`/posts/${post._id}`}
                  className="text-[#9c6644] font-medium hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SUBSCRIBE SECTION */}
      <section className="py-20 bg-[#f8f5f2] text-center">
        <h2 className="text-3xl font-bold text-[#7f5539] mb-4">
          Join Our Creative Circle
        </h2>
        <p className="text-[#7f5539]/70 mb-6">
          Subscribe for updates, featured blogs, and writing inspiration.
        </p>
        <form className="flex justify-center space-x-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded-md border border-[#e6ccb2] focus:outline-none focus:ring-2 focus:ring-[#9c6644]/50 w-64"
          />
          <button
            type="submit"
            className="bg-[#7f5539] text-white px-5 py-2 rounded-md font-semibold hover:bg-[#9c6644] transition"
          >
            Subscribe
          </button>
        </form>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#e6ccb2]/60 text-center py-6 text-[#7f5539] border-t border-[#d9bfa6]">
        © 2025 Whisply — Crafted with ☕ and creativity ✨
      </footer>
    </main>
  );
}
