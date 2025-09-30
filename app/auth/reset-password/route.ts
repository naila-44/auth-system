import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();
    await connectDB();

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });
    if (!user) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

    user.passwordHash = await hashPassword(newPassword);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
