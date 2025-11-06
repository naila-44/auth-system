import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  await connect();
  const { name, bio } = await req.json();

  const updated = await User.findOneAndUpdate({}, { name, bio }, { new: true });
  return NextResponse.json(updated);
}
