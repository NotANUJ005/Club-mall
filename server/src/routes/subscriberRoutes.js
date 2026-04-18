import { Router } from "express";
import mongoose from "mongoose";
import Subscriber from "../models/Subscriber.js";
import { demoStore } from "../services/demoStore.js";

const router = Router();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post("/subscribers", async (req, res, next) => {
  try {
    const { name, email, interest } = req.body;

    if (!name || !email || !interest) {
      return res.status(400).json({ message: "Please complete your name, email, and interest." });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      interest: interest.trim()
    };

    if (mongoose.connection.readyState === 1) {
      // Check for duplicate
      const existing = await Subscriber.findOne({ email: payload.email });
      if (existing) {
        return res.status(409).json({ message: "You're already on the list! We'll keep you updated." });
      }
      await Subscriber.create(payload);
    } else {
      // Check for duplicate in demo store
      const existing = demoStore.subscribers.find((s) => s.email === payload.email);
      if (existing) {
        return res.status(409).json({ message: "You're already on the list! We'll keep you updated." });
      }
      demoStore.subscribers.push({ ...payload, createdAt: new Date().toISOString() });
    }

    return res.status(201).json({
      message: `Thanks, ${payload.name}. You're on the list for ${payload.interest} updates.`
    });
  } catch (error) {
    next(error);
  }
});

router.get("/subscribers", async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const data = await Subscriber.find().sort({ createdAt: -1 });
      return res.json({ data });
    }

    return res.json({ data: demoStore.subscribers });
  } catch (error) {
    next(error);
  }
});

export default router;
