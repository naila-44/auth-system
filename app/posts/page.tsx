"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Post = {
  _id: string;
  title: string;
  content?: string;
  imageUrl?: string;
  author?: string;
};

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, "");
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();

        if (Array.isArray(data)) setPosts(data);
        else if (Array.isArray(data.posts)) setPosts(data.posts);
        else setPosts([]);
      } catch (error) {
        console.error(error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setPosts(posts.filter((p) => p._id !== id));
      else alert("Failed to delete post.");
    } catch (err) {
      console.error(err);
      alert("Error deleting post.");
    }
  };

  if (loading) return <p className="p-4 text-[#5a4730]">Loading posts...</p>;

  return (
    <div className="p-6 mt-12">
      <h1 className="text-2xl font-semibold mb-6 text-[#5a4730]">All Posts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length > 0 ? (
          posts.map((post) => {
            const contentPreview = post.content
              ? stripHtml(post.content).substring(0, 80)
              : "";

            return (
              <div
                key={post._id}
                className="relative bg-white rounded-2xl shadow p-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
              >
                {/* Edit & Delete buttons on top-right above everything */}
                <div
                  className="absolute top-3 right-3 flex gap-2 z-20"
                  onClick={(e) => e.stopPropagation()} // prevent card click
                >
                  <button
                  onClick={() => router.push(`/dashboard/edit-post/${post._id}`)}

                    className="bg-blue-500 text-white px-2 py-1 text-xs rounded hover:bg-blue-600 transition z-20"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600 transition z-20"
                  >
                    Delete
                  </button>
                </div>

                {/* Card Content */}
                <div
                  className="cursor-pointer relative z-10"
                  onClick={() => router.push(`/posts/${post._id}`)}
                >
                  {post.imageUrl && (
                    <div className="w-full h-48 relative mb-3 rounded-xl overflow-hidden">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <h2 className="text-lg font-semibold text-[#5a4730]">
                    {post.title}
                  </h2>
                  <p className="text-sm text-[#8c7a5c] mt-1">{contentPreview}...</p>
                  <p className="text-xs mt-2 text-[#a89a80]">
                    Author: {post.author || "Admin"}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-[#5a4730]">No posts found.</p>
        )}
      </div>
    </div>
  );
}
