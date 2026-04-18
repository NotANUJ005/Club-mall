import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    floor: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    hours: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Store", storeSchema);
