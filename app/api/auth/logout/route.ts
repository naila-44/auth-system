import { NextResponse } from "next/server";

export async function POST() {
  try {
    
    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    response.cookies.set("user_session", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0), 
    });

    return response;
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
