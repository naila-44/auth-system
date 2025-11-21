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

  // Helper to remove HTML tags from content
  const stripHtml = (html: string): string =>
    html ? html.replace(/<[^>]*>?/gm, "") : "";

  // Fetch published posts
  const fetchPosts = () => {
    axios
      .get("/api/posts/published")
      .then((res) => {
        if (res.data.success) setPosts(res.data.posts || []);
        else setPosts([]);
      })
      .catch((err) => console.error("Error fetching posts:", err));
  };

  // Delete a post
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await axios.delete(`/api/posts/${id}`);
      if (res.data.success) {
        fetchPosts();
        alert("Post deleted successfully!");
      } else {
        alert("Failed to delete post.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting the post.");
    }
  };

  useEffect(() => {
    fetchPosts();
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
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post._id}
                className="relative cursor-pointer group bg-white border border-[#d6ccc2] rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all overflow-hidden flex flex-col"
                onClick={() => router.push(`/Blog/${post._id}`)}
              >
                {/* Edit & Delete buttons (top-right, one line) */}
                <div
                  className="absolute top-2 right-2 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()} // prevent card click
                >
                 <button
  onClick={() => router.push(`/dashboard/edit-post/${post._id}`)}
  className="bg-[#3e2723] text-white px-3 py-1 text-xs rounded-full hover: transition shadow-sm"
>
  Edit
</button>

<button
  onClick={() => handleDelete(post._id)}
  className="bg-[#7f5539] text-white px-3 py-1 text-xs rounded-full hover:bg-amber-800 transition shadow-sm"
>
  Delete
</button>

                </div>

                {/* Post image */}
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:opacity-90 transition"
                  />
                )}

                {/* Post content */}
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
