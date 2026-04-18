import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { ensureSeedData } from "./services/seedService.js";

const app = express();
const port = process.env.PORT || 5000;

// Restrict CORS to known frontend origins (comma-separated in env var)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:5174")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server (no origin) and listed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true
  })
);

// Basic security headers without helmet dependency
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(express.json({ limit: "1mb" }));


app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", authRoutes);
app.use("/api", contentRoutes);
app.use("/api", reviewRoutes);
app.use("/api", subscriberRoutes);
app.use("/api", userRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Something went wrong on the server." });
});

const connected = await connectDB();

if (connected) {
  await ensureSeedData();
}

app.listen(port, () => {
  console.log(`Club District API running at http://localhost:${port}`);
});
