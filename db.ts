import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {

  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/app");
    console.log("MongoDB connected!");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
console.log(process.env.MONGO_URI);
export default connectDB;