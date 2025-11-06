
import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Post from "@/lib/models/Post";

export async function GET() {
  try {
    await connect();
    const posts = await Post.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, posts });
  } catch (err) {
    console.error("Error fetching posts:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connect();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "Post ID required" }, { status: 400 });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { published: true },
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (err) {
    console.error("Error publishing post:", err);
    return NextResponse.json({ success: false, error: "Failed to publish post" }, { status: 500 });
  }
}
