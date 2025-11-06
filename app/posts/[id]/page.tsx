"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { io, Socket } from "socket.io-client";

type Post = {
  _id: string;
  title: string;
  desc?: string;
  content: string;
  imageUrl?: string;
};

type Comment = {
  id: string | number;
  text: string;
  author: string;
  createdAt: string;
};

let socket: Socket;

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, "");
}

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [typingUser, setTypingUser] = useState("");
  const [reactions, setReactions] = useState<Record<string, Record<string, number>>>({});
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // Fetch post & comments
  useEffect(() => {
    if (!id) return;

    let cancel = false;

    async function fetchPost() {
      try {
        const res = await axios.get(`/api/posts/${id}`);
        if (!cancel) {
          const fetchedPost = res.data.post;
          fetchedPost.content = stripHtml(fetchedPost.content);
          setPost(fetchedPost);
          setComments(res.data.comments || []);
          setLoading(false);
          scrollToBottom();
        }
      } catch (err) {
        if (!cancel) setLoading(false);
        console.error("Error fetching post:", err);
      }
    }

    fetchPost();

    return () => {
      cancel = true;
    };
  }, [id]);

  // Socket setup
  useEffect(() => {
    if (!socket) socket = io("/", { path: "/api/socket" });

    const handleReceiveComment = (newComment: Comment) => {
      if (newComment && newComment.id && post?._id) {
        setComments((prev) => [...prev, newComment]);
        scrollToBottom();
      }
    };

    const handleSomeoneTyping = (username: string) => {
      setTypingUser(username);
      setTimeout(() => setTypingUser(""), 1500);
    };

    const handleUpdateReaction = ({
      commentId,
      emoji,
    }: {
      commentId: string | number;
      emoji: string;
    }) => {
      setReactions((prev) => ({
        ...prev,
        [commentId]: {
          ...(prev[commentId] || {}),
          [emoji]: (prev[commentId]?.[emoji] || 0) + 1,
        },
      }));
    };

    socket.on("receiveComment", handleReceiveComment);
    socket.on("someoneTyping", handleSomeoneTyping);
    socket.on("updateReaction", handleUpdateReaction);

    return () => {
      socket.off("receiveComment", handleReceiveComment);
      socket.off("someoneTyping", handleSomeoneTyping);
      socket.off("updateReaction", handleUpdateReaction);
      socket.disconnect();
    };
  }, [post?._id]);

  const handleTyping = () => socket.emit("typing", "You");

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !post?._id) return;

    const newComment: Comment = {
      id: Date.now(),
      text: comment,
      author: "You",
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [...prev, newComment]);
    setComment("");
    scrollToBottom();

    socket.emit("newComment", newComment);
    await axios.post(`/api/posts/${post._id}/comments`, newComment);
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-[#7f5539]">Loading post...</p>
    );
  if (!post)
    return (
      <p className="text-center mt-10 text-[#7f5539] font-medium">
        Post not found.
      </p>
    );

  return (
    <main className="bg-gradient-to-br from-[#fdf7f0] to-[#f7efe6] min-h-screen flex flex-col items-center py-20 px-4 sm:px-6 lg:px-20">
      <div className="max-w-3xl w-full flex-1 space-y-4 overflow-y-auto">
        <div className="bg-white/70 backdrop-blur-md border border-[#e6ccb2]/50 shadow-xl rounded-3xl overflow-hidden">
          {post.imageUrl && (
            <div className="relative w-full h-80 overflow-hidden">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          )}
          <div className="p-6 space-y-3">
            <h1 className="text-4xl font-bold text-[#7f5539]">{post.title}</h1>
            <p className="text-[#5a3825]/95 leading-relaxed whitespace-pre-line">
              {post.content}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          {comments.length > 0 ? (
            <AnimatePresence>
              {comments.map((c) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white/50 backdrop-blur-sm border border-[#e6ccb2]/40 p-3 rounded-2xl shadow-sm hover:shadow-md -mt-1"
                >
                  <p className="text-[#5a3825]/90">{c.text}</p>
                  <p className="text-sm text-gray-600 mt-1 text-right">{c.author}</p>
                  <div className="flex gap-2 mt-1">
                    {["❤️", "👍", "😮"].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() =>
                          socket.emit("reactComment", { commentId: c.id, emoji })
                        }
                        className="text-sm hover:scale-110 transition"
                      >
                        {emoji} {reactions[c.id]?.[emoji] || 0}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
              <div ref={commentsEndRef} />
            </AnimatePresence>
          ) : (
            <p className="text-gray-500 italic text-center">
              No comments yet — be the first to share your thoughts!
            </p>
          )}
        </div>
      </div>

      <form
        onSubmit={handleCommentSubmit}
        className="w-full max-w-3xl mt-4 fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-md border border-[#e6ccb2]/50 p-3 rounded-3xl shadow-lg flex gap-2 items-center"
      >
        <textarea
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            handleTyping();
          }}
          placeholder="Write a comment..."
          rows={1}
          className="flex-1 text-gray-800 placeholder:text-gray-500 placeholder:italic border border-[#d6ccc2] rounded-2xl p-2 focus:ring-2 focus:ring-[#9c6644]/60 focus:outline-none resize-none bg-[#fffaf6] shadow-sm"
        />
        <button
          type="submit"
          className="bg-[#7f5539] text-white py-2 px-4 text-sm rounded-lg font-medium hover:bg-[#9c6644] transition-all duration-150 shadow-sm hover:shadow-md"
        >
          Send
        </button>
      </form>

      {typingUser && (
        <p className="fixed bottom-20 left-1/2 transform -translate-x-1/2 text-gray-500 italic text-sm">
          {typingUser} is typing...
        </p>
      )}
    </main>
  );
}
