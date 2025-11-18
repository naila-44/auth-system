import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  email: string;
  name?: string;
}

const SECRET = process.env.NEXTAUTH_SECRET || "dev_secret_key";

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload;
}
