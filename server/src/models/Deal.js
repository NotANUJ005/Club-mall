import mongoose from "mongoose";

const dealSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    savings: { type: Number, required: true },
    members: { type: Number, required: true },
    badge: { type: String, required: true },
    eta: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Deal", dealSchema);
