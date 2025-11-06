"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type User = {
  _id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) return <p className="p-4 text-[#5a4730]">Loading profile...</p>;
  if (!user) return <p className="p-4 text-[#5a4730]">No user found.</p>;

  return (
    <div className="p-6 bg-[#f8f5f2] min-h-screen">
      <div className="bg-white rounded-2xl shadow p-6 max-w-md mx-auto text-center">
        <div className="w-24 h-24 mx-auto relative mb-4">
          <Image
            src={user.avatar}
            alt={user.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <h1 className="text-2xl font-semibold text-[#5a4730]">{user.name}</h1>
        <p className="text-sm text-[#8c7a5c]">{user.email}</p>
        <p className="mt-3 text-[#5a4730]">{user.bio}</p>
      </div>
    </div>
  );
}
