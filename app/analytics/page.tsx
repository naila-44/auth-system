"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    axios.get("/api/analytics").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <div className="ml-64 p-8">Loading...</div>;

  return (
    <div className="ml-64 p-8">
      <h1 className="text-2xl font-semibold text-[#5a4730] mb-6">Analytics Overview</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white shadow-md p-6 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">Total Posts</p>
          <h2 className="text-2xl font-bold">{stats.totalPosts}</h2>
        </div>
        <div className="bg-white shadow-md p-6 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">Total Likes</p>
          <h2 className="text-2xl font-bold">{stats.totalLikes}</h2>
        </div>
        <div className="bg-white shadow-md p-6 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">Top Posts</p>
          {stats.topPosts.map((p: any) => (
            <p key={p._id} className="text-gray-700 text-sm mt-1">• {p.title}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
