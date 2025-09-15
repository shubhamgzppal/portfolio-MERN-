import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    console.log("Using existing database connection.");
    return;
  }

  try {
    console.log("Creating new database connection.");
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

