
import mongoose from "mongoose";

let isConnected = false;

export const connect = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "AUTH-SYSTEM",
    });
    isConnected = true;
    console.log("MongoDB connected ✅");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};
