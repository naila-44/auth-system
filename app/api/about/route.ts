import { NextResponse } from "next/server";

export async function GET() {
  const aboutData = {
    name: "Whisply",
    tagline: "Write. Inspire. Whisply.",
    description:
      "Whisply is a modern writing and storytelling platform where creativity meets community. It’s a serene digital space for thinkers, dreamers, and writers to express their ideas freely — from personal blogs to inspirational essays.",
    mission:
      "To empower every voice to be heard through beautiful words and thoughtful storytelling. Whisply aims to make writing effortless, elegant, and emotionally impactful.",
    vision:
      "To build a creative universe where writers inspire, readers connect, and stories create lasting echoes — one whisper at a time.",
    founded: "2025",
  };

  return NextResponse.json(aboutData);
}
