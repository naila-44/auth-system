"use client";

import { useState } from "react";
import axios from "axios";

export default function SettingPage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    const res = await axios.post("/api/setting", { name, bio });
    setMessage("Profile updated successfully!");
  };

  return (
    <div className="ml-64 p-8 mt-10">
      <h1 className="text-2xl font-semibold text-[#5a4730] mb-6">Settings</h1>
      <div className="bg-white p-6 rounded-xl border shadow w-1/2">
        <label className="block mb-3">
          <span className="text-gray-700">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          />
        </label>

        <label className="block mb-3">
          <span className="text-gray-700">Bio</span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          />
        </label>

        <button
          onClick={handleSave}
          className="bg-[#5a4730] text-white px-4 py-2 rounded hover:bg-[#463720]"
        >
          Save Changes
        </button>

        {message && <p className="text-green-600 mt-3">{message}</p>}
      </div>
    </div>
  );
}
