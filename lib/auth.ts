import ms from "ms";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET: Secret = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN: ms.StringValue = (process.env.JWT_EXPIRES_IN as ms.StringValue) || "7d"; 
const SALT_ROUNDS = 12;

export interface JwtPayload {
  sub: string;
  email?: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Compare password
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Sign token
export function signToken(payload: JwtPayload): Promise<string> {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, options, (err, token) => {
      if (err || !token) return reject(err);
      resolve(token);
    });
  });
}

// Verify token
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
