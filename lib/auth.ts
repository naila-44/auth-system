import { NextRequest } from "next/server";
import { verifyToken, JwtPayload } from "./jwt"; // adjust path if needed

export async function getUserFromToken(req: NextRequest | Request): Promise<JwtPayload | null> {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) return null;

    const user = verifyToken(token);
    return user;
  } catch (err) {
    console.error("Error verifying token:", err);
    return null;
  }
}
