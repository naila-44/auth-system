"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Upload } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type Post = {
  _id: string;
  title: string;
  desc: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  published: boolean;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "published" | "draft">("all");
  const [filterWeek, setFilterWeek] = useState<string | null>(null);

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
      } else {
        router.push("/login");
      }
    } catch (err) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, [router]);

  // 🔹 Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/dashboard", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.posts)) setPosts(data.posts);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  useEffect(() => {
    if (user) fetchPosts();
  }, [user]);

  // 🔹 Delete post
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Publish post
  const handlePublish = async (id: string) => {
    try {
      const res = await fetch("/api/dashboard", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Post published successfully!");
        fetchPosts();
      } else alert(data.error || "Failed to publish");
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Stats
  const totalPosts = posts.length;
  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = totalPosts - publishedCount;
  const chartData = [
    { name: "Published", value: publishedCount },
    { name: "Draft", value: draftCount },
  ];
  const COLORS = ["#A47551", "#D9BCA3"];

  // 🔹 Weekly Chart
  const getWeekLabel = (date: Date) => {
    const firstDay = new Date(date);
    firstDay.setDate(date.getDate() - date.getDay());
    return firstDay.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const weekCounts: Record<string, number> = {};
  posts.forEach((p) => {
    const week = getWeekLabel(new Date(p.createdAt));
    weekCounts[week] = (weekCounts[week] || 0) + 1;
  });
  const barData = Object.keys(weekCounts).map((week) => ({
    week,
    posts: weekCounts[week],
  }));

  // 🔹 Filters
  const filteredPosts = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType =
      filterType === "all" ? true : filterType === "published" ? p.published : !p.published;
    const matchWeek = filterWeek
      ? getWeekLabel(new Date(p.createdAt)) === filterWeek
      : true;
    return matchSearch && matchType && matchWeek;
  });

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!user) return null;

  return (
    <div className="space-y-6 mt-12">
      {/* 🔹 Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt">
        {[{ label: "Total", value: totalPosts }, { label: "Published", value: publishedCount }, { label: "Drafts", value: draftCount }].map(
          (s, i) => (
            <div
              key={i}
              className="bg-white/60 border border-[#f0e6d8] p-3 rounded-xl shadow hover:shadow-lg text-center"
            >
              <h3 className="text-gray-600 text-sm">{s.label}</h3>
              <p className="text-2xl font-bold text-[#7f5539] mt-1">{s.value}</p>
            </div>
          )
        )}
      </div>

      {/* 🔹 Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pie */}
        <div className="bg-white/60 border border-[#f0e6d8] p-3 rounded-xl shadow">
          <h3 className="text-[#7f5539] text-center font-semibold mb-2">Posts Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
                onClick={(e) => setFilterType(e?.name.toLowerCase() as "published" | "draft")}
                cursor="pointer"
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          {filterType !== "all" && (
            <button
              onClick={() => setFilterType("all")}
              className="mt-1 text-sm text-[#7f5539] underline"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Bar */}
        <div className="bg-white/60 border border-[#f0e6d8] p-3 rounded-xl shadow">
          <h3 className="text-[#7f5539] text-center font-semibold mb-2">Weekly Posts</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="posts"
                fill="#A47551"
                cursor="pointer"
                onClick={(d: any) => setFilterWeek(d?.payload?.week || null)}
              />
            </BarChart>
          </ResponsiveContainer>
          {filterWeek && (
            <button
              onClick={() => setFilterWeek(null)}
              className="mt-1 text-sm text-[#7f5539] underline"
            >
              Clear Week Filter
            </button>
          )}
        </div>
      </div>

      {/* 🔹 Posts List */}
      <div>
        <h2 className="text-xl font-semibold text-[#7f5539] mb-2">Recent Posts</h2>
        <div className="space-y-2">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((p) => (
              <div
                key={p._id}
                className="bg-white/60 border border-[#f0e6d8] p-3 rounded-xl shadow flex justify-between items-center hover:shadow-lg"
              >
                <div>
                  <h3 className="font-semibold text-[#7f5539]">{p.title}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString()} —{" "}
                    {p.published ? "Published" : "Draft"}
                  </p>
                </div>
                <div className="flex gap-2 text-xs">
                  <Link href={`/dashboard/posts/${p._id}`} className="text-[#c9ac8b] hover:underline">
                    View
                  </Link>
                  <Link
                    href={`/dashboard/edit-post/${p._id}`}
                    className="text-[#b3916f] hover:underline"
                  >
                    Edit
                  </Link>
                  {!p.published && (
                    <button
                      onClick={() => handlePublish(p._id)}
                      className="text-[#7f5539] flex items-center gap-1"
                    >
                      <Upload size={16} /> Publish
                    </button>
                  )}
                  <button onClick={() => handleDelete(p._id)} className="text-[#e07b7b]">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-2 text-sm">No posts found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
