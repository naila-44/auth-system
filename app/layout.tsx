import "./globals.css";
import SessionProviderWrapper from "@/app/Providers/SessionProviderWrapper";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Whisply — Share Your Voice",
  description: "A warm, creative space for bloggers built with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f8f5f2] text-[#3e2723] font-sans scroll-smooth">
        <SessionProviderWrapper>
          <Navbar />
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}

