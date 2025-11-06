"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";

type AboutData = {
  name: string;
  description: string;
  mission: string;
  vision: string;
};

export default function AboutPage() {
  const [about, setAbout] = useState<AboutData | null>(null);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const res = await fetch("/api/about");
        const data = await res.json();
        setAbout(data);
      } catch (error) {
        console.error("Failed to fetch about data", error);
      }
    }
    fetchAbout();
  }, []);

  return (
    <main className="bg-[#f8f5f2] min-h-screen">
   
      <Navbar />

      
      <section className="relative h-[75vh] flex items-center justify-center text-center overflow-hidden mt-20">
        <Image
          src="/hero.png" 
          alt="Whisply Background"
          fill
          priority
          className="object-cover brightness-75"
        />

       
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

       
      </section>

    
      <section className="max-w-5xl mx-auto py-24 px-6 text-center">
        {about ? (
          <>
            <h2 className="text-4xl font-bold text-[#7f5539] mb-6">
              {about.name}
            </h2>
            <p className="text-[#7f5539]/80 text-lg mb-10 leading-relaxed">
              {about.description}
            </p>

            <div className="grid md:grid-cols-2 gap-10 text-left">
              <div className="bg-white p-8 rounded-2xl shadow-md border border-[#e6ccb2]/50 hover:shadow-xl transition">
                <h3 className="text-2xl font-semibold text-[#9c6644] mb-3">
                  Our Mission
                </h3>
                <p className="text-[#7f5539]/80 leading-relaxed">
                  {about.mission}
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-md border border-[#e6ccb2]/50 hover:shadow-xl transition">
                <h3 className="text-2xl font-semibold text-[#9c6644] mb-3">
                  Our Vision
                </h3>
                <p className="text-[#7f5539]/80 leading-relaxed">
                  {about.vision}
                </p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-[#7f5539]/70">Loading...</p>
        )}
      </section>

    
      <footer className="bg-[#e6ccb2]/60 text-center py-6 text-[#7f5539] border-t border-[#d9bfa6]">
        © 2025 Whisply — Crafted with passion and creativity
      </footer>
    </main>
  );
}
