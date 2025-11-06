"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();

        if (Array.isArray(data)) {
          setPosts(data);
        } else if (Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else {
          console.error("Unexpected data shape:", data);
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

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
              <Link
                key={post._id}
                href={`/posts/${post._id}`}
                className="bg-white rounded-2xl shadow p-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 block"
              >
                {post.imageUrl && (
                  <div className="w-full h-48 relative mb-3">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover rounded-xl"
                      unoptimized
                    />
                  </div>
                )}
                <h2 className="text-lg font-semibold text-[#5a4730]">
                  {post.title}
                </h2>
                <p className="text-sm text-[#8c7a5c] mt-1">
                  {contentPreview}...
                </p>
                <p className="text-xs mt-2 text-[#a89a80]">
                  Author: {post.author || "Admin"}
                </p>
              </Link>
            );
          })
        ) : (
          <p className="text-[#5a4730]">No posts found.</p>
        )}
      </div>
    </div>
  );
}
