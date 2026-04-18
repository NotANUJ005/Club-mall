import { Router } from "express";
import mongoose from "mongoose";
import { seedDeals, seedEvents, seedStores } from "../data/seedData.js";
import Deal from "../models/Deal.js";
import Event from "../models/Event.js";
import Store from "../models/Store.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();

function withDemoIds(items, prefix) {
  return items.map((item, index) => ({ ...item, _id: `${prefix}-${index + 1}` }));
}

// ─── DEALS ───────────────────────────────────────────────────────────────────

router.get("/deals", async (req, res, next) => {
  try {
    const data = mongoose.connection.readyState === 1
      ? await Deal.find().sort({ createdAt: -1 })
      : withDemoIds(seedDeals, "deal");
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

router.get("/deals/:id", async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const deal = await Deal.findById(req.params.id);
      if (!deal) return res.status(404).json({ message: "Deal not found" });
      res.json({ data: deal });
    } else {
      const allDeals = withDemoIds(seedDeals, "deal");
      const deal = allDeals.find(d => d._id === req.params.id);
      if (!deal) return res.status(404).json({ message: "Deal not found" });
      res.json({ data: deal });
    }
  } catch (error) {
    next(error);
  }
});

// Admin: create deal
router.post("/deals", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { title, category, description, price, savings, members, badge, eta } = req.body;
    if (!title || !category || !description || price == null || savings == null || !badge || !eta) {
      return res.status(400).json({ message: "All deal fields are required." });
    }
    if (mongoose.connection.readyState === 1) {
      const deal = await Deal.create({ title, category, description, price: Number(price), savings: Number(savings), members: Number(members) || 0, badge, eta });
      return res.status(201).json({ data: deal });
    }
    return res.status(503).json({ message: "Database not connected. Cannot create deals in demo mode." });
  } catch (error) {
    next(error);
  }
});

// Admin: update deal
router.put("/deals/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { title, category, description, price, savings, members, badge, eta } = req.body;
    if (mongoose.connection.readyState === 1) {
      const deal = await Deal.findByIdAndUpdate(
        req.params.id,
        { title, category, description, price: Number(price), savings: Number(savings), members: Number(members) || 0, badge, eta },
        { new: true, runValidators: true }
      );
      if (!deal) return res.status(404).json({ message: "Deal not found." });
      return res.json({ data: deal });
    }
    return res.status(503).json({ message: "Database not connected." });
  } catch (error) {
    next(error);
  }
});

// Admin: delete deal
router.delete("/deals/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const deal = await Deal.findByIdAndDelete(req.params.id);
      if (!deal) return res.status(404).json({ message: "Deal not found." });
      return res.json({ message: "Deal deleted." });
    }
    return res.status(503).json({ message: "Database not connected." });
  } catch (error) {
    next(error);
  }
});

// ─── STORES ──────────────────────────────────────────────────────────────────

router.get("/stores", async (req, res, next) => {
  try {
    const data = mongoose.connection.readyState === 1
      ? await Store.find().sort({ createdAt: -1 })
      : withDemoIds(seedStores, "store");
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

router.get("/stores/:id", async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const store = await Store.findById(req.params.id);
      if (!store) return res.status(404).json({ message: "Store not found" });
      res.json({ data: store });
    } else {
      const allStores = withDemoIds(seedStores, "store");
      const store = allStores.find(s => s._id === req.params.id);
      if (!store) return res.status(404).json({ message: "Store not found" });
      res.json({ data: store });
    }
  } catch (error) {
    next(error);
  }
});

// Admin: create store
router.post("/stores", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { title, floor, type, description, hours } = req.body;
    if (!title || !floor || !type || !description || !hours) {
      return res.status(400).json({ message: "All store fields are required." });
    }
    if (mongoose.connection.readyState === 1) {
      const store = await Store.create({ title, floor, type, description, hours });
      return res.status(201).json({ data: store });
    }
    return res.status(503).json({ message: "Database not connected." });
  } catch (error) {
    next(error);
  }
});

// Admin: update store
router.put("/stores/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { title, floor, type, description, hours } = req.body;
    if (mongoose.connection.readyState === 1) {
      const store = await Store.findByIdAndUpdate(req.params.id, { title, floor, type, description, hours }, { new: true });
      if (!store) return res.status(404).json({ message: "Store not found." });
      return res.json({ data: store });
    }
    return res.status(503).json({ message: "Database not connected." });
  } catch (error) {
    next(error);
  }
});

// Admin: delete store
router.delete("/stores/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const store = await Store.findByIdAndDelete(req.params.id);
      if (!store) return res.status(404).json({ message: "Store not found." });
      return res.json({ message: "Store deleted." });
    }
    return res.status(503).json({ message: "Database not connected." });
  } catch (error) {
    next(error);
  }
});

// ─── EVENTS ──────────────────────────────────────────────────────────────────

router.get("/events", async (req, res, next) => {
  try {
    const data = mongoose.connection.readyState === 1
      ? await Event.find().sort({ createdAt: -1 })
      : withDemoIds(seedEvents, "event");
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

// Admin: create event
router.post("/events", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { time, title, description } = req.body;
    if (!time || !title || !description) {
      return res.status(400).json({ message: "All event fields are required." });
    }
    if (mongoose.connection.readyState === 1) {
      const event = await Event.create({ time, title, description });
      return res.status(201).json({ data: event });
    }
    return res.status(503).json({ message: "Database not connected." });
  } catch (error) {
    next(error);
  }
});

// Admin: delete event
router.delete("/events/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const event = await Event.findByIdAndDelete(req.params.id);
      if (!event) return res.status(404).json({ message: "Event not found." });
      return res.json({ message: "Event deleted." });
    }
    return res.status(503).json({ message: "Database not connected." });
  } catch (error) {
    next(error);
  }
});

export default router;
