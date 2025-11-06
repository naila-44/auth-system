
import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/lib/models/User";
import { changePasswordSchema } from "@/validators/authSchemas";
import { getTokenFromRequest } from "@/lib/cookie";
import { verifyToken, comparePassword, hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = changePasswordSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connect();
    const user = await User.findById(payload.sub);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const ok = await comparePassword(parsed.data.currentPassword, user.passwordHash);
    if (!ok) return NextResponse.json({ error: "Current password incorrect" }, { status: 401 });

    user.passwordHash = await hashPassword(parsed.data.newPassword);
    await user.save();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
