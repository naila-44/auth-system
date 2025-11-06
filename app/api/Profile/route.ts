import { NextResponse } from "next/server";
import {connect} from "@/lib/db";
import User from "@/lib/models/User";


export async function GET() {
  try {
    await connect();


    const users = await User.find({}, "-password"); 

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load profile data" },
      { status: 500 }
    );
  }
}
