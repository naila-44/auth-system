import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Post from "@/lib/models/Post";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await connect();

    const { id } = params; 
    const body = await req.json();
    const { text, author } = body;

    if (!text || !id) {
      return NextResponse.json(
        { success: false, error: "Missing comment text or post ID." },
        { status: 400 }
      );
    }

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found." },
        { status: 404 }
      );
    }

    if (!Array.isArray(post.comments)) post.comments = [];

    const newComment = { text, author: author || "Anonymous" };
    post.comments.push(newComment);
    await post.save();

    return NextResponse.json(
      { success: true, comment: newComment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add comment." },
      { status: 500 }
    );
  }
}
