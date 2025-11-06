import { NextRequest } from "next/server";
import { Server as IOServer } from "socket.io";
import { Socket } from "socket.io";

export const config = {
  runtime: "nodejs",
};

let io: IOServer;

export async function GET(req: NextRequest) {
  // Just respond to GET requests so socket can connect
  return new Response("Socket route ready");
}

export async function POST(req: NextRequest) {
  // POST is not used here, just return OK
  return new Response("Use GET to connect Socket.IO");
}

// Initialize Socket.IO once
export async function PATCH(req: NextRequest, res: any) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO server...");
    io = new IOServer(res.socket.server, {
      path: "/api/socket",
      cors: { origin: "*" },
    });

    res.socket.server.io = io;

    io.on("connection", (socket: Socket) => {
      console.log("New client connected:", socket.id);

      socket.on("newComment", (comment) => {
        io.emit("receiveComment", comment);
      });

      socket.on("typing", (username: string) => {
        socket.broadcast.emit("someoneTyping", username);
      });

      socket.on(
        "reactComment",
        ({ commentId, emoji }: { commentId: string | number; emoji: string }) => {
          io.emit("updateReaction", { commentId, emoji });
        }
      );

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }

  return new Response("Socket.IO initialized");
}
