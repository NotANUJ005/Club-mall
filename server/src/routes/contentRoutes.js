import { Router } from "express";
import mongoose from "mongoose";
import { seedDeals, seedEvents, seedStores } from "../data/seedData.js";
import Deal from "../models/Deal.js";
import Event from "../models/Event.js";
import Store from "../models/Store.js";

const router = Router();

function withDemoIds(items, prefix) {
  return items.map((item, index) => ({ ...item, _id: `${prefix}-${index + 1}` }));
}

router.get("/deals", async (req, res, next) => {
  try {
    const data = mongoose.connection.readyState === 1 ? await Deal.find().sort({ createdAt: 1 }) : withDemoIds(seedDeals, "deal");
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

router.get("/stores", async (req, res, next) => {
  try {
    const data = mongoose.connection.readyState === 1 ? await Store.find().sort({ createdAt: 1 }) : withDemoIds(seedStores, "store");
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

router.get("/events", async (req, res, next) => {
  try {
    const data = mongoose.connection.readyState === 1 ? await Event.find().sort({ createdAt: 1 }) : withDemoIds(seedEvents, "event");
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

export default router;
