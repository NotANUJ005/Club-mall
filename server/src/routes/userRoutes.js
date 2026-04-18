import bcrypt from "bcryptjs";
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
    planner: user.planner || [],
    isAdmin: user.isAdmin || false
  };
}

// PATCH /api/users/preferences – sync wishlist + planner
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

// PATCH /api/users/profile – update display name
router.patch("/users/profile", requireAuth, async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "Name cannot be empty." });
    }

    const trimmedName = String(name).trim();

    if (mongoose.connection.readyState === 1) {
      const updated = await User.findByIdAndUpdate(
        req.user._id,
        { name: trimmedName },
        { new: true }
      );
      return res.json({ user: sanitizeUser(updated) });
    }

    // Demo store fallback
    req.user.name = trimmedName;
    return res.json({ user: sanitizeUser(req.user) });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/users/change-password – change password (requires current password)
router.patch("/users/change-password", requireAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required." });
    }

    if (String(newPassword).length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters." });
    }

    const matches = await bcrypt.compare(currentPassword, req.user.passwordHash);
    if (!matches) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    if (mongoose.connection.readyState === 1) {
      await User.findByIdAndUpdate(req.user._id, { passwordHash: newHash });
      return res.json({ message: "Password updated successfully." });
    }

    // Demo store fallback
    req.user.passwordHash = newHash;
    return res.json({ message: "Password updated successfully." });
  } catch (error) {
    next(error);
  }
});

export default router;
