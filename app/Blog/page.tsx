"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Post {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  status: "draft" | "published";
  createdAt?: string;
  updatedAt?: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  const stripHtml = (html: string): string =>
    html ? html.replace(/<[^>]*>?/gm, "") : "";

  useEffect(() => {
    axios
      .get("/api/posts/published")
      .then((res) => {
        if (res.data.success) setPosts(res.data.posts || []);
        else setPosts([]);
      })
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  return (
    <main className="bg-[#f8f5f2] min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-[#3e2723]">
          Latest Posts
        </h1>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts available yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post._id}
                onClick={() => router.push(`/Blog/${post._id}`)} // ✅ Click anywhere on card
                className="cursor-pointer group bg-white border border-[#d6ccc2] rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all overflow-hidden flex flex-col justify-between"
              >
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:opacity-90 transition"
                  />
                )}

                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-xl font-semibold text-[#3e2723] mb-2 group-hover:text-[#7f5539] transition">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm flex-1 line-clamp-3 mb-4">
                    {stripHtml(post.content)}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-[#7f5539] group-hover:text-[#3e2723] transition">
                    Read More →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
