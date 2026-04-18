import mongoose from "mongoose";

export async function connectDB() {
  if (!process.env.MONGO_URI) {
    console.warn("MONGO_URI not set. Starting in demo mode without MongoDB.");
    return false;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected.");
    return true;
  } catch (error) {
    console.error("MongoDB connection failed. Continuing in demo mode.", error.message);
    return false;
  }
}
