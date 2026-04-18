import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    wishlist: { type: [String], default: [] },
    planner: { type: [String], default: [] },
    resetPasswordToken: { type: String, default: "" },
    resetPasswordExpires: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
