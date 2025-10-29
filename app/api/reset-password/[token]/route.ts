// app/api/reset-password/[token]/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connect } from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(
  req: Request,
  { params }: { params: { token: string } } // ✅ Destructure params here
) {
  try {
    await connect();

    const { token } = params; // ✅ token is available now
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
