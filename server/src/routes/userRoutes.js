import { Router } from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

function cleanArray(items = []) {
  return [...new Set(items.filter(Boolean).map(String))];
}

function sanitizeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    wishlist: user.wishlist || [],
    planner: user.planner || []
  };
}

router.patch("/users/preferences", requireAuth, async (req, res, next) => {
  try {
    const { wishlist, planner } = req.body;

    req.user.wishlist = Array.isArray(wishlist) ? cleanArray(wishlist) : req.user.wishlist || [];
    req.user.planner = Array.isArray(planner) ? cleanArray(planner) : req.user.planner || [];

    if (mongoose.connection.readyState === 1) {
      await User.findByIdAndUpdate(req.user._id, {
        wishlist: req.user.wishlist,
        planner: req.user.planner
      });

      const freshUser = await User.findById(req.user._id);
      return res.json({ user: sanitizeUser(freshUser) });
    }

    return res.json({ user: sanitizeUser(req.user) });
  } catch (error) {
    next(error);
  }
});

export default router;
