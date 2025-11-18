import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/lib/models/User";
import { changePasswordSchema } from "@/validators/authSchemas";
import { comparePassword, hashPassword } from "@/lib/auth";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const userPayload = await getUserFromToken(req);
    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const user = await User.findById(userPayload.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const valid = await comparePassword(parsed.data.currentPassword, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Current password incorrect" }, { status: 401 });
    }

    user.password = await hashPassword(parsed.data.newPassword);
    await user.save();

    return NextResponse.json(
      { success: true, message: "Password changed successfully" },
      { status: 200 }
    );

  } catch (err: any) {
    console.error("Change-password error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
