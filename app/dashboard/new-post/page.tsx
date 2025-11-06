"use client";

import { useState, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import axios from "axios";

// Dynamic import for ReactQuill
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

// Type-safe ref for ReactQuill
type QuillRefType = {
  getEditor: () => any;
};

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const quillRef = useRef<QuillRefType | null>(null);

  // Image handler for ReactQuill
  const imageHandler = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const imageUrl = res.data.url;
        const editor = quillRef.current?.getEditor();
        if (!editor) return;

        const range = editor.getSelection(true);
        editor.insertEmbed(range.index, "image", imageUrl);

        // Resize inserted images
        setTimeout(() => {
          const imgs = document.querySelectorAll(".ql-editor img");
          imgs.forEach((img) => {
            (img as HTMLImageElement).style.maxWidth = "100%";
            (img as HTMLImageElement).style.height = "auto";
            (img as HTMLImageElement).style.display = "block";
            (img as HTMLImageElement).style.margin = "10px 0";
            (img as HTMLImageElement).style.borderRadius = "8px";
          });
        }, 100);
      } catch (err) {
        console.error("Image upload failed:", err);
        alert("Failed to upload image");
      }
    };
  };

  // ReactQuill toolbar modules
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  // Submit post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/posts", { title, content, status });
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

  // AI generate dummy content
  const handleGenerateAI = () => {
    setContent(
      "Here's an inspiring post written by AI. You can edit or expand it as you like!"
    );
  };

  return (
    <main className="min-h-screen bg-[#fdf7f0] flex flex-col items-center py-16 px-4">
      <h1 className="text-3xl font-bold text-[#7f5539] mb-8 text-center">
        Create New Post
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg"
      >
        {/* Title */}
        <input
          type="text"
          placeholder="Enter post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-[#e6ccb2] p-4 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9c6644] transition"
        />

        {/* AI Generate */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleGenerateAI}
            className="bg-[#c9ac8b] text-white py-2 px-4 rounded-md text-sm hover:bg-[#b3916f] transition"
          >
            Generate with AI
          </button>
        </div>

        {/* Editor */}
        <div className="border border-[#e6ccb2] rounded-md overflow-hidden">
          <ReactQuill
            ref={quillRef}
            value={content}
            onChange={setContent}
            modules={modules}
            className="h-64 text-black placeholder-gray-500 px-2"
            placeholder="Write your post content here..."
          />
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-1">Post Status</label>
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

        {/* Actions */}
        <div className="flex gap-3 justify-end">
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
            } text-white py-2 px-6 rounded-md text-sm hover:opacity-90 transition`}
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
