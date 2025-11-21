"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";

type Post = {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  author?: string;
};

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts/published");
        const data = await res.json();
        setPosts(data?.posts || []);
      } catch (err) {
        console.error(err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <main className="bg-[#f8f5f2] min-h-screen scroll-smooth font-sans">
      <Navbar />

     
      <section
        className="relative text-center py-48 px-6 flex flex-col items-center justify-center bg-cover bg-center mt-4 "
        style={{ backgroundImage: "url('/hero.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8f5f2]/30 via-[#f8f5f2]/60 to-[#f8f5f2]/80 backdrop-blur-[2px]" />
        <motion.div
          className="relative z-10 max-w-3xl text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.p
            className="text-[#5a3825]/90 font-bold text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            A serene corner for dreamers, writers, and storytellers — where every word finds its rhythm.
          </motion.p>

          <motion.div
            className="flex justify-center space-x-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            <Link
              href="/signup"
              className="bg-[#7f5539] text-[#f8f5f2] px-8 py-3 rounded-full font-semibold shadow-md hover:bg-[#9c6644] hover:shadow-lg transition duration-300"
            >
              Start Writing
            </Link>
            <Link
              href="#blogs"
              className="border-2 border-[#7f5539] text-[#7f5539] px-5 py-3 rounded-full font-semibold hover:bg-[#7f5539] hover:text-white hover:shadow-md transition duration-200 "
            >
              Explore Stories
            </Link>
          </motion.div>
        </motion.div>
      </section>

      
      <section id="blogs" className="max-w-6xl mx-auto py-24 px-6 mt-0">
        <h2 className="text-4xl font-bold text-[#7f5539] mb-4 text-center">
          Featured <span className="text-[#9c6644]">Stories</span>
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts available yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            {posts.map((post, index) => (
              <Link key={post._id} href={`/posts/${post._id}`} className="block">
                <motion.div
                  className="bg-white shadow-lg rounded-2xl overflow-hidden border border-[#e6ccb2]/70 hover:shadow-2xl transition-transform transform hover:-translate-y-2 cursor-pointer"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  {post.imageUrl && (
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      width={500}
                      height={300}
                      className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-[#7f5539] mb-3">{post.title}</h3>
                    <div
                      className="text-[#7f5539]/70 mb-5 text-base"
                      dangerouslySetInnerHTML={{ __html: post.content.slice(0, 150) + "..." }}
                    />
                    <p className="text-sm text-[#9c6644] mb-2">{post.author || ""}</p>
                    <p className="text-xs text-gray-400 mb-2">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-[#9c6644] font-medium hover:underline">Read More →</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </section>
      <motion.section
        className="py-24 bg-[#e6ccb2]/20 text-center rounded-t-[2rem]"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-[#7f5539] mb-4">Join Our Creative Circle</h2>
        <p className="text-[#7f5539]/70 mb-6">
          Subscribe for updates, featured blogs, and writing inspiration.
        </p>
        <form className="flex justify-center space-x-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 rounded-full border border-[#e6ccb2] focus:outline-none focus:ring-2 focus:ring-[#9c6644]/70 w-72 shadow-sm text-black"
          />
          <button
            type="submit"
            className="bg-[#7f5539] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#9c6644] shadow-md hover:shadow-lg transition"
          >
            Subscribe
          </button>
        </form>
      </motion.section>

      <footer className="bg-[#e6ccb2]/60 text-center py-6 text-[#7f5539] border-t border-[#d9bfa6]">
        © 2025 Whisply — Crafted with ❤️ and creativity
      </footer>
    </main>
  );
}
