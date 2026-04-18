import bcrypt from "bcryptjs";
import { Router } from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import { demoStore } from "../services/demoStore.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { createResetToken, signAuthToken } from "../utils/auth.js";

const router = Router();

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

function createDemoUserId() {
  return `user-${Date.now()}-${Math.round(Math.random() * 10000)}`;
}

router.post("/auth/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    if (String(password).length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long." });
    }

    const safeEmail = normalizeEmail(email);
    const passwordHash = await bcrypt.hash(password, 10);

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: safeEmail });
      if (existingUser) {
        return res.status(409).json({ message: "An account with this email already exists." });
      }

      const user = await User.create({
        name: name.trim(),
        email: safeEmail,
        passwordHash
      });

      const token = signAuthToken({ userId: user._id.toString(), email: user.email });
      return res.status(201).json({ token, user: sanitizeUser(user) });
    }

    const existingUser = demoStore.users.find((user) => user.email === safeEmail);
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const user = {
      _id: createDemoUserId(),
      name: name.trim(),
      email: safeEmail,
      passwordHash,
      wishlist: [],
      planner: [],
      resetPasswordToken: "",
      resetPasswordExpires: null,
      isAdmin: false
    };

    demoStore.users.push(user);
    const token = signAuthToken({ userId: user._id, email: user.email });
    return res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
});

router.post("/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const safeEmail = normalizeEmail(email);

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: safeEmail });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      const matches = await bcrypt.compare(password, user.passwordHash);
      if (!matches) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      const token = signAuthToken({ userId: user._id.toString(), email: user.email });
      return res.json({ token, user: sanitizeUser(user) });
    }

    const user = demoStore.users.find((item) => item.email === safeEmail);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signAuthToken({ userId: user._id, email: user.email });
    return res.json({ token, user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
});

router.get("/auth/me", requireAuth, async (req, res, next) => {
  try {
    return res.json({ user: sanitizeUser(req.user) });
  } catch (error) {
    next(error);
  }
});

router.post("/auth/forgot-password", async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    const safeEmail = normalizeEmail(email);
    const token = createResetToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);
    let foundUser = null;

    if (mongoose.connection.readyState === 1) {
      foundUser = await User.findOne({ email: safeEmail });
      if (foundUser) {
        foundUser.resetPasswordToken = token;
        foundUser.resetPasswordExpires = expiresAt;
        await foundUser.save();
      }
    } else {
      foundUser = demoStore.users.find((user) => user.email === safeEmail) || null;
      if (foundUser) {
        foundUser.resetPasswordToken = token;
        foundUser.resetPasswordExpires = expiresAt;
      }
    }

    const response = {
      message: "If an account exists for that email, a reset link has been prepared."
    };

    // Only expose the reset link in development mode (for testing without email delivery)
    if (foundUser && process.env.NODE_ENV !== "production") {
      response.resetToken = token;
      response.resetLink = `/reset-password?token=${token}`;
    }

    return res.json(response);
  } catch (error) {
    next(error);
  }
});

router.post("/auth/reset-password", async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Reset token and new password are required." });
    }

    if (String(password).length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date();

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: now }
      });

      if (!user) {
        return res.status(400).json({ message: "This reset link is invalid or has expired." });
      }

      user.passwordHash = passwordHash;
      user.resetPasswordToken = "";
      user.resetPasswordExpires = null;
      await user.save();
      return res.json({ message: "Password reset successful. You can log in now." });
    }

    const user = demoStore.users.find(
      (item) => item.resetPasswordToken === token && item.resetPasswordExpires && new Date(item.resetPasswordExpires) > now
    );

    if (!user) {
      return res.status(400).json({ message: "This reset link is invalid or has expired." });
    }

    user.passwordHash = passwordHash;
    user.resetPasswordToken = "";
    user.resetPasswordExpires = null;
    return res.json({ message: "Password reset successful. You can log in now." });
  } catch (error) {
    next(error);
  }
});

export default router;
