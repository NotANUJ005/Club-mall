import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    dealId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 500 }
  },
  { timestamps: true }
);

// One review per user per deal
reviewSchema.index({ dealId: true, userId: true }, { unique: true });

export default mongoose.model("Review", reviewSchema);
