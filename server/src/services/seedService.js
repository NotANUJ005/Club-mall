import mongoose from "mongoose";
import { seedDeals, seedEvents, seedStores } from "../data/seedData.js";
import Deal from "../models/Deal.js";
import Event from "../models/Event.js";
import Store from "../models/Store.js";

export async function ensureSeedData() {
  if (mongoose.connection.readyState !== 1) {
    return;
  }

  const [dealCount, storeCount, eventCount] = await Promise.all([Deal.countDocuments(), Store.countDocuments(), Event.countDocuments()]);

  if (!dealCount) {
    await Deal.insertMany(seedDeals);
  }

  if (!storeCount) {
    await Store.insertMany(seedStores);
  }

  if (!eventCount) {
    await Event.insertMany(seedEvents);
  }
}
