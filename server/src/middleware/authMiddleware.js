import mongoose from "mongoose";
import User from "../models/User.js";
import { demoStore } from "../services/demoStore.js";
import { verifyAuthToken } from "../utils/auth.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const payload = verifyAuthToken(token);

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(payload.userId);
      if (!user) {
        return res.status(401).json({ message: "Session is no longer valid." });
      }
      req.user = user;
      req.authMode = "database";
      return next();
    }

    const user = demoStore.users.find((item) => item._id === payload.userId);
    if (!user) {
      return res.status(401).json({ message: "Session is no longer valid." });
    }

    req.user = user;
    req.authMode = "demo";
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication required." });
  }
}
