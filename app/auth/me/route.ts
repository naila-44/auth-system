// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { forgotSchema } from "@/validators/authSchemas";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = forgotSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    await connectDB();
    const user = await User.findOne({ email: parsed.data.email });
    if (!user) {
      // don't leak info
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashed = await bcrypt.hash(token, 10);
    user.resetToken = hashed;
    user.resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset/${token}`;
    await sendEmail(user.email, "Reset your password", `<p>Reset link (1 hour): <a href="${resetUrl}">${resetUrl}</a></p>`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
