import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/profile")) {
    if (!token || !verifyToken(token)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
