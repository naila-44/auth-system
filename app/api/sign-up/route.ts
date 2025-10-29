import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connect } from "@/lib/db";
import User from "@/lib/models/User";

connect();

export async function POST(req: NextRequest) {
  try {
    const { username, email, password, confirmPassword } = await req.json();

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "✅ Signup successful!" });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "⚠️ Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

