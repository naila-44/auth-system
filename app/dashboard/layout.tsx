import Navbar from "@/app/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf7f0] to-[#f7efe6] text-[#3e2723] font-sans">
      <Navbar />
      <main className="pt-4">{children}</main>
    </div>
  );
}
