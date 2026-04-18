import { Router } from "express";
import mongoose from "mongoose";
import Review from "../models/Review.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

// In-memory demo store for reviews when DB is not connected
const demoReviews = [];

// GET /api/reviews/:dealId – fetch all reviews for a deal
router.get("/reviews/:dealId", async (req, res, next) => {
  try {
    const { dealId } = req.params;

    if (mongoose.connection.readyState === 1) {
      const reviews = await Review.find({ dealId }).sort({ createdAt: -1 });
      return res.json({ data: reviews });
    }

    const reviews = demoReviews.filter(r => r.dealId === dealId);
    return res.json({ data: reviews });
  } catch (error) {
    next(error);
  }
});

// POST /api/reviews/:dealId – submit a review (authenticated)
router.post("/reviews/:dealId", requireAuth, async (req, res, next) => {
  try {
    const { dealId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required." });
    }
    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }
    if (String(comment).trim().length < 5) {
      return res.status(400).json({ message: "Comment must be at least 5 characters." });
    }

    const userId = String(req.user._id);
    const userName = req.user.name;

    if (mongoose.connection.readyState === 1) {
      // Upsert – only one review per user per deal
      const existing = await Review.findOne({ dealId, userId });
      if (existing) {
        return res.status(409).json({ message: "You have already reviewed this deal. Delete your existing review to submit again." });
      }

      const review = await Review.create({
        dealId,
        userId,
        userName,
        rating: Number(rating),
        comment: String(comment).trim()
      });
      return res.status(201).json({ data: review });
    }

    // Demo fallback
    const existing = demoReviews.find(r => r.dealId === dealId && r.userId === userId);
    if (existing) {
      return res.status(409).json({ message: "You have already reviewed this deal." });
    }

    const review = {
      _id: `review-${Date.now()}`,
      dealId,
      userId,
      userName,
      rating: Number(rating),
      comment: String(comment).trim(),
      createdAt: new Date().toISOString()
    };
    demoReviews.push(review);
    return res.status(201).json({ data: review });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/reviews/:reviewId – delete own review
router.delete("/reviews/:reviewId", requireAuth, async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = String(req.user._id);

    if (mongoose.connection.readyState === 1) {
      const review = await Review.findById(reviewId);
      if (!review) return res.status(404).json({ message: "Review not found." });
      if (review.userId !== userId && !req.user.isAdmin) {
        return res.status(403).json({ message: "You can only delete your own reviews." });
      }
      await review.deleteOne();
      return res.json({ message: "Review deleted." });
    }

    // Demo fallback
    const idx = demoReviews.findIndex(r => r._id === reviewId && r.userId === userId);
    if (idx === -1) return res.status(404).json({ message: "Review not found." });
    demoReviews.splice(idx, 1);
    return res.json({ message: "Review deleted." });
  } catch (error) {
    next(error);
  }
});

export default router;
