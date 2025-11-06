"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import axios from "axios";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("status", status);
      if (image) formData.append("image", image);

      const res = await axios.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        alert(
          status === "draft"
            ? "Post saved as draft!"
            : "Post published successfully!"
        );
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Error creating post:", err);
      alert(err?.response?.data?.error || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAI = () => {
    setContent(
      "Here's an inspiring post written by AI. You can edit or expand it as you like!"
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <main className="min-h-2 bg-[#fdf7f0] p-5 flex flex-col items-center mt-15 ">
      <h1 className="text-3xl font-bold text-[#7f5539] mb-3 text-center">
        Create New Post
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 w-full max-w-3xl bg-white p-8 rounded-xl shadow-md"
      >
        <input
          type="text"
          placeholder="Enter post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-[#e6ccb2] p-4 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9c6644] transition"
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleGenerateAI}
            className="bg-[#c9ac8b] text-white py-2 px-4 rounded-md text-sm hover:bg-[#b3916f] transition"
          >
            Generate with AI
          </button>
        </div>

        <div className="border-[#e6ccb2] rounded-md">
          <ReactQuill
            value={content}
            onChange={setContent}
            className="h-40 text-black placeholder-gray-500"
            placeholder="Write your post content here..."
          />
        </div>

      
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 font-medium mt-7">Upload Image</label>
          <label className="flex items-center justify-between border border-[#e6ccb2] p-2 rounded-md bg-white cursor-pointer text-gray-700 hover:bg-[#f0e6d8] transition">
            {image ? image.name : "Choose image..."}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-1 max-h-20 object-contain rounded-md border border-[#e6ccb2]"
            />
          )}
        </div>

       
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium">Post Status</label>
          <select
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-[#e6ccb2] p-3 rounded-md bg-white text-black focus:ring-2 focus:ring-[#9c6644]"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="flex gap-3 mt-2 justify-end">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`${
              status === "draft" ? "bg-[#b7a69e]" : "bg-[#7f5539]"
            } text-white py-2 px-4 rounded-md text-sm hover:opacity-90 transition`}
          >
            {loading
              ? status === "draft"
                ? "Saving..."
                : "Publishing..."
              : status === "draft"
              ? "Save Draft"
              : "Publish"}
          </button>
        </div>
      </form>
    </main>
  );
}
