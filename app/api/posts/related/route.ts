import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Post from "@/lib/models/Post";

export async function GET(req: Request) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { success: false, error: "Missing postId parameter" },
        { status: 400 }
      );
    }

    // ✅ 1. Find current post
    const currentPost = await Post.findById(postId);
    if (!currentPost) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // ✅ 2. Build a filter for related content
    const query: any = { _id: { $ne: postId } };

    // Try to find posts with similar tags or category if available
    if (currentPost.category) query.category = currentPost.category;
    if (currentPost.tags && currentPost.tags.length > 0)
      query.tags = { $in: currentPost.tags };

    // ✅ 3. Fetch related posts (fallback: most recent ones)
    const relatedPosts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    return NextResponse.json({ success: true, relatedPosts }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching related posts:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch related posts" },
      { status: 500 }
    );
  }
}
