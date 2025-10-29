
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/db"; // your connect function
import Post from "@/lib/models/Post";

export async function POST(req: NextRequest) {
  try {
    await connect();

    const data = await req.json();
    const { title, content, imageUrl, author } = data;

    const newPost = new Post({ title, content, imageUrl, author });
    await newPost.save();

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

