import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    await connectDB();
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ success: true }); // Do not reveal email

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    // Send email (replace with your SMTP or service)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${token}`;
    await transporter.sendMail({
      to: user.email,
      from: process.env.SMTP_USER,
      subject: "Password Reset",
      html: `Click <a href="${resetUrl}">here</a> to reset your password.`,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
