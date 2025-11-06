
import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Post from "@/lib/models/Post";

export async function GET() {
  try {
    await connect();
    const posts = await Post.find({ published: true }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, posts });
  } catch (err) {
    console.error("Error fetching published posts:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch published posts" },
      { status: 500 }
    );
  }
}
