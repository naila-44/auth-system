import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/lib/models/User";

export async function GET(req: Request) {
  try {
    await connect();

    // ✅ Get user_session cookie
    const cookieHeader = req.headers.get("cookie");
    const match = cookieHeader?.match(/user_session=([^;]+)/);
    if (!match) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const session = JSON.parse(decodeURIComponent(match[1]));
    const user = await User.findById(session.id).select("name email");

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
