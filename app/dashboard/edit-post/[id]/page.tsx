"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";

// Dynamic import for ReactQuill (no SSR)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

// Post interface
interface Post {
  title: string;
  content: string;
  imageUrl: string;
  status: "draft" | "published";
}

export default function EditPostPage() {
  const params = useParams();
  const id = params?.id as string; // ensure string
  const router = useRouter();

  // Initialize post state safely
  const [post, setPost] = useState<Post>({
    title: "",
    content: "",
    imageUrl: "",
    status: "draft",
  });

  const [loading, setLoading] = useState(true);

  // Fetch post data
  useEffect(() => {
    if (!id) return;
    axios
      .get(`/api/posts/${id}`)
      .then((res) => {
        const fetched = res.data.post;
        // Ensure all fields are strings
        setPost({
          title: fetched.title || "",
          content: fetched.content || "",
          imageUrl: fetched.imageUrl || "",
          status: fetched.status || "draft",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching post:", err);
        setLoading(false);
      });
  }, [id]);

  // Handle input/select changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  // Submit updated post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/posts/${id}`, post);
      alert("Post updated successfully!");
      router.push("/dashboard"); // navigate back to dashboard
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post.");
    }
  };

  // Loading state
  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <main className="bg-[#f8f5f2] min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold text-[#7f5539] mb-4 text-center">
          Edit Post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
            required
            placeholder="Post title..."
            className="w-full text-black placeholder:text-gray-400 border border-[#d6ccc2] rounded-lg p-3 focus:ring-[#7f5539] focus:border-[#7f5539] transition"
          />

          {/* Content */}
          <div className="border border-[#d6ccc2] rounded-lg overflow-hidden">
            <ReactQuill
              value={post.content || ""} // <-- avoid value error
              onChange={(value) => setPost({ ...post, content: value })}
              theme="snow"
              className="h-40 text-black placeholder:text-gray-400"
            />
          </div>

          {/* Image URL */}
          <input
            type="text"
            name="imageUrl"
            value={post.imageUrl}
            onChange={handleChange}
            placeholder="Image URL..."
            className="w-full text-black placeholder:text-gray-400 border border-[#d6ccc2] rounded-lg p-3 focus:ring-[#7f5539] focus:border-[#7f5539] transition"
          />

          {/* Status */}
          <select
            name="status"
            value={post.status}
            onChange={handleChange}
            className="w-full text-black border border-[#d6ccc2] rounded-lg p-3 focus:ring-[#7f5539] focus:border-[#7f5539] transition"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#7f5539] text-white text-sm py-2 px-4 rounded-md hover:bg-[#9c6644] transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Update Post
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
