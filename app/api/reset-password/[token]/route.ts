import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connect } from "@/lib/db";
import User from "@/lib/models/User";
import { z } from "zod";

const resetPasswordSchema = z.object({
  password: z.string().min(6),
});

export async function POST(req: Request, { params }: { params: { token: string } }) {
  try {
    const { token } = params;
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Password invalid", details: parsed.error.flatten() }, { status: 400 });

    await connect();

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

    user.password = await bcrypt.hash(parsed.data.password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
