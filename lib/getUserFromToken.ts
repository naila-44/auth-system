import { NextRequest } from "next/server";
import { verifyToken, JwtPayload } from "./jwt";

export async function getUserFromToken(req: NextRequest | Request): Promise<JwtPayload | null> {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) return null;

    return verifyToken(token);
  } catch (err) {
    console.error("Token verification error:", err);
    return null;
  }
}
