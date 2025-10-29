import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connect } from "@/lib/db";
import User from "@/lib/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

export async function GET(req: Request) {
  try {
    await connect();
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Sample dashboard data
    const data = {
      name: user.name,
      summaryStats: [
        { title: "Total Posts", value: 24 },
        { title: "Total Likes", value: 78 },
      ],
    };

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
