// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { signupSchema } from "@/validators/authSchemas";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    await connectDB();
    const { email, username, password } = parsed.data;

    const exists = await User.findOne({ email });
    if (exists) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

    const passwordHash = await hashPassword(password);
    const user = await User.create({ email, username, passwordHash });

    return NextResponse.json({ success: true, user: { id: user._id, email: user.email, username: user.username } }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
