"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import axios from "axios";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !content || !image) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);

    try {
      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

      const cloudRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      const imageUrl = cloudRes.data.secure_url;

      // Save post to MongoDB via API
      const res = await axios.post("/api/posts", {
        title,
        content,
        imageUrl,
        author: "Admin", // replace with actual logged-in user
      });

      if (res.data.success) {
        alert("Post created successfully!");
        setTitle("");
        setContent("");
        setImage(null);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>

      <div className="mb-4">
        <label className="block mb-1">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Content:</label>
        <ReactQuill theme="snow" value={content} onChange={setContent} />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Upload Image:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-[#7f5539] text-white px-6 py-2 rounded hover:bg-[#9c6644] transition"
      >
        {loading ? "Uploading..." : "Create Post"}
      </button>
    </div>
  );
}

