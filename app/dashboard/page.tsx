"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, ChevronDown, Trash2, Upload } from "lucide-react";
import Sidebar from "../components/sidebar";
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

export default function Dashboard() {
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "published" | "draft">("all");
  const [filterWeek, setFilterWeek] = useState<string | null>(null);

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
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchPosts();
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

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
      } else {
        alert(data.error || "Failed to publish post");
      }
    } catch (err) {
      console.error("Failed to publish post:", err);
    }
  };

  const totalPosts = posts.length;
  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = totalPosts - publishedCount;

  const chartData = [
    { name: "Published", value: publishedCount },
    { name: "Draft", value: draftCount },
  ];
  const COLORS = ["#A47551", "#D9BCA3"];

  const getWeekLabel = (date: Date) => {
    const firstDayOfWeek = new Date(date);
    firstDayOfWeek.setDate(date.getDate() - date.getDay());
    return firstDayOfWeek.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const weekCounts: { [week: string]: number } = {};
  posts.forEach((post) => {
    const weekLabel = getWeekLabel(new Date(post.createdAt));
    weekCounts[weekLabel] = (weekCounts[weekLabel] || 0) + 1;
  });

  const barData = Object.keys(weekCounts)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .map((week) => ({ week, posts: weekCounts[week] }));

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === "all"
        ? true
        : filterType === "published"
        ? post.published
        : !post.published;
    const matchesWeek = filterWeek ? getWeekLabel(new Date(post.createdAt)) === filterWeek : true;
    return matchesSearch && matchesType && matchesWeek;
  });

  return (
    <main className="bg-gradient-to-br from-[#fdf7f0] to-[#f7efe6] min-h-screen">
     
      <header className="flex justify-between items-center bg-gradient-to-r from-[#e8d8c3]/80 to-[#d9bfa6]/80 p-4 shadow-md sticky top-0 z-50 backdrop-blur-sm rounded-b-lg">
        <h1 className="text-2xl font-bold text-[#7f5539]">Dashboard</h1>
        <div className="flex items-center gap-4 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts..."
            className="pl-3 pr-3 py-1 rounded-lg border border-[#d6ccc2] focus:outline-none focus:ring-2 focus:ring-[#9c6644]/60 text-sm text-gray-700"
          />
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="hover:bg-[#f5e9dc]/70 p-2 rounded-full transition"
          >
            <Bell size={20} className="text-[#7f5539]" />
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-12 w-64 bg-white/60 backdrop-blur-md shadow-lg rounded-lg p-3 text-sm">
              No new notifications
            </div>
          )}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 bg-[#f5e9dc]/80 px-2 py-1 rounded-full hover:shadow-sm transition"
            >
              <div className="w-8 h-8 rounded-full bg-[#7f5539] flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase() || "N"}
              </div>
              <ChevronDown size={16} color="#7f5539" />
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white/60 backdrop-blur-md shadow-md rounded-lg p-2 text-[#7f5539]">
                <Link href="/profile" className="block py-1 px-2 hover:bg-[#f5e9dc]/70 rounded">
                  Profile
                </Link>
                <Link href="/settings" className="block py-1 px-2 hover:bg-[#f5e9dc]/70 rounded">
                  Settings
                </Link>
              </div>
            )}
          </div>
          <Link
            href="/dashboard/new-post"
            className="bg-[#7f5539] text-white px-3 py-2 rounded-lg hover:bg-[#9c6644] transition-all shadow-sm hover:shadow-md"
          >
            + New Post
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        <aside className="lg:col-span-1 h-fit sticky top-[90px]">
          <Sidebar />
        </aside>

        <section className="lg:col-span-3 space-y-8">
      
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[{ label: "Total Posts", value: totalPosts }, { label: "Published", value: publishedCount }, { label: "Drafts", value: draftCount }].map(
              (stat, i) => (
                <div
                  key={i}
                  className="bg-white/60 backdrop-blur-md border border-[#f0e6d8] p-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition text-center"
                >
                  <h3 className="text-gray-600 text-sm font-medium">{stat.label}</h3>
                  <p className="text-3xl font-bold text-[#7f5539] mt-1">{stat.value}</p>
                </div>
              )
            )}
          </div>

         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       
            <div className="bg-white/60 backdrop-blur-md border border-[#f0e6d8] p-4 rounded-xl shadow-md">
              <h3 className="text-[#7f5539] font-semibold text-lg mb-2 text-center">Posts Overview</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                    onClick={(entry) =>
                      setFilterType(entry?.name.toLowerCase() as "published" | "draft")
                    }
                    cursor="pointer"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              {filterType !== "all" && (
                <button
                  onClick={() => setFilterType("all")}
                  className="mt-2 text-sm text-[#7f5539] underline hover:text-[#5b3b2a]"
                >
                  Clear Filter
                </button>
              )}
            </div>

            <div className="bg-white/60 backdrop-blur-md border border-[#f0e6d8] p-4 rounded-xl shadow-md">
              <h3 className="text-[#7f5539] font-semibold text-lg mb-2 text-center">Weekly Posts</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                <Bar
  dataKey="posts"
  fill="#A47551"
  cursor="pointer"
  onClick={(data: any) => {
    if (data && data.payload && data.payload.week) {
      setFilterWeek(data.payload.week);
    }
  }}
/>

                </BarChart>
              </ResponsiveContainer>
              {filterWeek && (
                <button
                  onClick={() => setFilterWeek(null)}
                  className="mt-2 text-sm text-[#7f5539] underline hover:text-[#5b3b2a]"
                >
                  Clear Week Filter
                </button>
              )}
            </div>
          </div>

       
          <div>
            <h2 className="text-2xl font-semibold text-[#7f5539] mb-4">Recent Posts</h2>
            <div className="space-y-3">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white/60 backdrop-blur-md border border-[#f0e6d8] p-4 rounded-xl shadow-md flex justify-between items-center hover:shadow-lg hover:-translate-y-1 transition"
                  >
                    <div>
                      <h3 className="font-semibold text-[#7f5539] text-lg">{post.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()} — {post.published ? "Published" : "Draft"}
                      </p>
                    </div>
                    <div className="flex gap-3 items-center">
                      <Link href={`/posts/${post._id}`} className="text-[#c9ac8b] hover:underline">
                        View
                      </Link>
                      <Link href={`/dashboard/edit-post/${post._id}`} className="text-[#b3916f] hover:underline">
                        Edit
                      </Link>
                      {!post.published && (
                        <button
                          onClick={() => handlePublish(post._id)}
                          className="text-[#7f5539] hover:text-[#5b3b2a] transition flex items-center gap-1"
                        >
                          <Upload size={18} /> Publish
                        </button>
                      )}
                      <button onClick={() => handleDelete(post._id)} className="text-[#e07b7b] hover:text-red-600 transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No posts found.</p>
              )}
            </div>
          </div>

         
          <div>
            <h2 className="text-2xl font-semibold text-[#7f5539] mb-4">Recent Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts
                .filter((post) => post.published)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((post) => (
                  <Link
                    key={post._id}
                    href={`/posts/${post._id}`}
                    className="block bg-white/60 backdrop-blur-md border border-[#f0e6d8] rounded-xl shadow-md p-4 hover:shadow-lg hover:-translate-y-1 transition"
                  >
                    {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="w-full h-32 object-cover rounded-lg mb-2" />}
                    <h3 className="text-[#7f5539] font-semibold text-lg">{post.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{new Date(post.createdAt).toLocaleDateString()}</p>
                    <p className="text-[#c9ac8b] text-sm">Read More →</p>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
