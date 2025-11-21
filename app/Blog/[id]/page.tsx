"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Eye, Heart, Share2, Copy } from "lucide-react";

export default function BlogDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(false);

  
  useEffect(() => {
    if (!id) return;
    const fetchPostData = async () => {
      try {
        const postRes = await fetch(`/api/posts/${id}`);
        const postData = await postRes.json();
        setPost(postData.post);

        const relatedRes = await fetch(`/api/posts/related?postId=${id}`);
        const relatedData = await relatedRes.json();
        setRelated(relatedData.related || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchPostData();
  }, [id]);

  if (!post)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#4e342e]">
        Loading post...
      </div>
    );


  const sharePost = (platform: string) => {
    const url = window.location.href;
    const text = encodeURIComponent(post.title);

    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
        break;
      case "whatsapp":
        window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, "_blank");
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
        break;
    }
  };

  return (
   <main className="bg-gradient-to-br  min-h-screen p-4 md:p-10 ">
  <div className="max-w-5xl mx-auto rounded-2xl shadow-md overflow-hidden  mt-8">

   
    {post.imageUrl && (
      <div className="relative w-full h-96">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          unoptimized
          priority
          className="object-cover"
        />
      </div>
    )}

      
        <div className="p-6">
          <h1 className="text-3xl font-bold text-[#4e342e] mb-2">{post.title}</h1>
          <p className="text-sm text-gray-500 mb-4">
            Posted by <span className="font-semibold">{post.authorEmail || "Unknown"}</span> •{" "}
            {new Date(post.createdAt).toLocaleDateString()}
          </p>

         
          <div className="flex items-center gap-6 text-gray-600 mb-6">
            <span className="flex items-center gap-1">
              <Eye size={18} /> {post.views || 0}
            </span>
            <span className="flex items-center gap-1 cursor-pointer hover:text-[#7f5539] transition">
              <Heart size={18} /> {post.likes || 0}
            </span>
            <span
              className="flex items-center gap-1 cursor-pointer hover:text-[#7f5539] transition"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle size={18} /> {post.comments?.length || 0}
            </span>
          </div>

         
          <div
            className="prose max-w-none text-[#3e2723] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="flex flex-wrap gap-4 mt-8 border-t pt-4">
            <button
              onClick={() => sharePost("twitter")}
              className="flex items-center gap-2 bg-[#1DA1F2] text-white px-4 py-2 rounded-xl hover:opacity-90 transition"
            >
              <Share2 size={18} /> Twitter
            </button>
            <button
              onClick={() => sharePost("facebook")}
              className="flex items-center gap-2 bg-[#1877F2] text-white px-4 py-2 rounded-xl hover:opacity-90 transition"
            >
              <Share2 size={18} /> Facebook
            </button>
            <button
              onClick={() => sharePost("whatsapp")}
              className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-xl hover:opacity-90 transition"
            >
              <Share2 size={18} /> WhatsApp
            </button>
            <button
              onClick={() => sharePost("copy")}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-xl hover:opacity-90 transition"
            >
              <Copy size={18} /> Copy Link
            </button>
          </div>

         
          {showComments && (
            <div className="mt-10 border-t pt-6">
              <h3 className="text-xl font-semibold text-[#4e342e] mb-4">Comments</h3>
              {post.comments?.length ? (
                post.comments.map((c: any, idx: number) => (
                  <div key={idx} className="mb-3">
                    <p className="text-[#3e2723]">{c.text}</p>
                    <p className="text-sm text-gray-500">– {c.author}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No comments yet.</p>
              )}
            </div>
          )}

   
{related.length > 0 && (
  <div className="mt-10 border-t pt-6">
    <h3 className="text-xl font-semibold text-[#4e342e] mb-4">
      Related Posts
    </h3>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {related.map((r) => (
        <Link
          href={`/Blog/${r._id}`}
          key={r._id}
          className="border rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300 group"
        >
        
          {r.image && (
            <div className="relative w-full h-44 bg-gray-100">
              <Image
                src={r.image}
                alt={r.title}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

       
          <div className="p-4">
            <h4 className="font-semibold mb-2 text-[#4e342e] group-hover:text-[#7f5539] transition-colors">
              {r.title}
            </h4>
            <p className="text-sm text-gray-600 line-clamp-3">
              {r.content?.replace(/<[^>]+>/g, "").slice(0, 120)}...
            </p>
          </div>
        </Link>
      ))}
    </div>
  </div>
)}

        </div>
      </div>
    </main>
  );
}

