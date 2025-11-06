import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Post from "@/lib/models/Post";

export async function GET() {
  await connect();

  const totalPosts = await Post.countDocuments();
  const totalLikes = await Post.aggregate([{ $group: { _id: null, likes: { $sum: "$likes" } } }]);
  const mostLiked = await Post.find().sort({ likes: -1 }).limit(3);

  return NextResponse.json({
    totalPosts,
    totalLikes: totalLikes[0]?.likes || 0,
    topPosts: mostLiked,
  });
}
