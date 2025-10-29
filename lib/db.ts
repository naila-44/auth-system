import mongoose from "mongoose";

let isConnected = false;

export async function connect() {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URL!, {
      dbName: "authDB",
      // Optional: add these for safer connection
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
    
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error; // rethrow to catch in API route if needed
  }
}
