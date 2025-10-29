"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Bell, Search, ChevronDown } from "lucide-react";
import Sidebar from "../components/sidebar";

type SummaryStat = { title: string; value: number; color: string; trendColor: string; trend: number[] };
type Post = { id: string; title: string; date: string; views: number; likes: number };
type AnalyticsItem = { date: string; posts: number; likes: number };

export default function Dashboard() {
  const router = useRouter();

  const [summaryStats, setSummaryStats] = useState<SummaryStat[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsItem[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        setSummaryStats(data.summaryStats || []);
        setAnalyticsData(data.analyticsData || []);
        setRecentPosts(data.recentPosts || []);
        setNotifications(data.notifications || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Safe total calculation
  const totalPosts = analyticsData.reduce((sum, item) => sum + (item.posts || 0), 0);
  const totalLikes = analyticsData.reduce((sum, item) => sum + (item.likes || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-[#5a4730]">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <main className="bg-[#f8f5f2] min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center bg-gradient-to-r from-[#e8d8c3] to-[#d9bfa6] p-4 shadow sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-[#5a4730]">Wisply Dashboard</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search posts..."
              className="border rounded px-3 py-1 pl-8 focus:outline-none focus:ring-2 focus:ring-[#c9ac8b]"
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={20} className="text-[#5a4730]" />
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow rounded p-2 z-50">
                <h4 className="font-semibold mb-2 text-[#5a4730]">Notifications</h4>
                {notifications.map((note, idx) => (
                  <p key={idx} className="text-sm border-b last:border-b-0 py-1 text-[#5a4730]">
                    {note}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Profile menu */}
          <div className="relative">
            <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#c9ac8b] flex items-center justify-center text-white font-bold">
                P
              </div>
              <ChevronDown size={16} className="text-[#5a4730]" />
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow rounded p-2 z-50">
                <Link href="/profile" className="block py-1 px-2 hover:bg-[#f0e6d8] rounded text-[#5a4730]">
                  Profile
                </Link>
                <Link href="/settings" className="block py-1 px-2 hover:bg-[#f0e6d8] rounded text-[#5a4730]">
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-1 px-2 hover:bg-[#f0e6d8] rounded text-[#5a4730]"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <Link
            href="/new-post"
            className="bg-[#c9ac8b] text-white px-4 py-2 rounded hover:bg-[#d9bfa6] transition"
          >
            New Post
          </Link>
        </div>
      </header>

      {/* Dashboard layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        {/* Sidebar */}
        <aside className="lg:col-span-1 h-[calc(100vh-64px)] overflow-y-auto sticky top-[64px]">
          <Sidebar />
        </aside>

        {/* Main content */}
        <section className="lg:col-span-3 space-y-8">
          {/* Analytics chart */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-4 text-[#5a4730]">Analytics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#5a4730" />
                <YAxis stroke="#5a4730" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="posts" stroke="#c9ac8b" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="likes" stroke="#d9bfa6" />
              </LineChart>
            </ResponsiveContainer>

            {/* Total posts & likes */}
            <div className="flex gap-6 mt-6">
              <div className="flex-1 bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center border border-[#e8d8c3]">
                <h3 className="text-sm text-gray-500 uppercase">Total Posts</h3>
                <p className="text-3xl font-bold text-[#c9ac8b] mt-2">{totalPosts}</p>
              </div>
              <div className="flex-1 bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center border border-[#d9bfa6]">
                <h3 className="text-sm text-gray-500 uppercase">Total Likes</h3>
                <p className="text-3xl font-bold text-[#d9bfa6] mt-2">{totalLikes}</p>
              </div>
            </div>
          </div>

          {/* Recent posts */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-[#5a4730]">Recent Posts</h2>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-lg text-[#5a4730]">{post.title}</h3>
                    <p className="text-gray-500 text-sm">
                      {post.date} | {post.views} views | {post.likes} likes
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/posts/${post.id}`} className="text-[#c9ac8b] hover:underline">
                      View
                    </Link>
                    <Link href={`/edit-post/${post.id}`} className="text-[#d9bfa6] hover:underline">
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending posts */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-[#5a4730]">Trending Posts</h2>
            <div className="space-y-4">
              {recentPosts
                .sort((a, b) => b.likes - a.likes)
                .slice(0, 3)
                .map((post) => (
                  <div key={post.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-lg text-[#5a4730]">{post.title}</h3>
                      <p className="text-gray-500 text-sm">
                        {post.date} | {post.views} views | {post.likes} likes
                      </p>
                    </div>
                    <Link href={`/posts/${post.id}`} className="text-[#c9ac8b] hover:underline">
                      View
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
