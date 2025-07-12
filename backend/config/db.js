import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database Connected")
    );
    await mongoose.connect(`${process.env.MONGODB_URL}`); 
  } catch (error) {
    console.log("MongoDB connection error:", error);
    process.exit(1);
  }
};