import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { hashPassword, signToken } from "@/lib/auth";
import { z } from "zod";

const signupSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8)
    .regex(/[A-Z]/, "1 uppercase")
    .regex(/\d/, "1 number"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    await connectDB();
    const { username, email, password } = parsed.data;

    const exists = await User.findOne({ email });
    if (exists) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

    const passwordHash = await hashPassword(password);
    const user = await User.create({ username, email, passwordHash });

    const token = await signToken({ sub: user._id.toString(), email: user.email });
    const res = NextResponse.json({ success: true }, { status: 201 });
    res.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

