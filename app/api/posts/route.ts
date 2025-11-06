import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Post from "@/lib/models/Post";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});


export async function GET() {
  try {
    await connect();
    const posts = await Post.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, posts });
  } catch (err) {
    console.error("Error fetching posts:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    await connect();

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const status = formData.get("status") as string; 
    const file = formData.get("image") as File | null;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Title and content are required." },
        { status: 400 }
      );
    }

  
    let imageUrl = "";
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadResult: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "posts" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });
      imageUrl = uploadResult.secure_url;
    }

   
    const published = status === "published";

   
    const newPost = new Post({
      title,
      content,
      imageUrl,
      published,
    });

    await newPost.save();

    return NextResponse.json(
      {
        success: true,
        message: published
          ? "Post published successfully!"
          : "Post saved as draft.",
        post: newPost,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error creating post:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create post" },
      { status: 500 }
    );
  }
}
