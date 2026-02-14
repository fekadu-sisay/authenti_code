import env from "./env";
import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect(env.MONGO_URI);
};
