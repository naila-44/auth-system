"use client";

import Sidebar from "@/app/components/sidebar";
import DashboardHeader from "@/app/dashboard/DashboardHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-gradient-to-br from-[#fdf7f0] to-[#f7efe6] min-h-screen">
      {/* Header (appears once) */}
      <DashboardHeader />

      {/* Sidebar + Main Content */}
      <div className="flex">
        {/* Sidebar (fixed left) */}
        <aside className="w-56 h-screen sticky top-13 border-r ">
          <Sidebar />
        </aside>

        {/* Page Content */}
        <section className="flex-1 p-5 overflow-y-auto">{children}</section>
      </div>
    </main>
  );
}
