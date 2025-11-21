
import mongoose, { Schema, models } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    desc: String,
    content: { type: String, required: true },
    imageUrl: String,
    author: { type: String, default: "Admin" },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Post = models.Post || mongoose.model("Post", PostSchema);
export default Post;
