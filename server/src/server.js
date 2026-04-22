import "dotenv/config";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { ensureSeedData } from "./services/seedService.js";

const app = express();
const port = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "https://ClubMall.vercel.app,http://localhost:5173,http://localhost:5174")
  .split(",")
  .map((o) => o.trim());

app.use(cors({
  origin: ['https://ClubMall.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// ─── Security Headers ─────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (isProduction) {
    res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }
  next();
});

// ─── Rate Limiting ────────────────────────────────────────────────────────────
// Global limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." }
});

// Strict limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many authentication attempts, please try again in 15 minutes." }
});

app.use(globalLimiter);
app.use(express.json({ limit: "1mb" }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api", authLimiter, authRoutes);
app.use("/api", contentRoutes);
app.use("/api", reviewRoutes);
app.use("/api", subscriberRoutes);
app.use("/api", userRoutes);

// ─── 404 for unknown /api/* routes ────────────────────────────────────────────
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "API endpoint not found." });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((error, req, res, next) => {
  const status = error.status || error.statusCode || 500;

  if (isProduction) {
    // Never expose stack traces in production
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} → ${status}: ${error.message}`);
    return res.status(status).json({ message: status === 500 ? "Something went wrong on the server." : error.message });
  }

  console.error(error);
  return res.status(status).json({ message: error.message, stack: error.stack });
});

// ─── Boot ─────────────────────────────────────────────────────────────────────
const connected = await connectDB();

if (connected) {
  await ensureSeedData();
}

app.listen(port, () => {
  console.log(`[${process.env.NODE_ENV || "development"}] Club District API running at http://localhost:${port}`);
});
