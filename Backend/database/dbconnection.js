import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Error in DB connection", error.message);
    console.log("⚠️  MongoDB connection failed. Server will still start, but database features won't work.");
  }
};
