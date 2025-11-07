import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    await connect(); 

    const reqBody: { token?: string } = await req.json();
    const { token } = reqBody;

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const currentTime = new Date();

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: currentTime },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error: any) {
    console.error("Error in verify email route:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
