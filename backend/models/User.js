import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    hostelBlock: { type: String, trim: true },
    enrollmentId: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
