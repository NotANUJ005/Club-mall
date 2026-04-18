import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { seedDeals, seedEvents, seedStores } from "./data/seedData.js";
import Deal from "./models/Deal.js";
import Event from "./models/Event.js";
import Store from "./models/Store.js";

const connected = await connectDB();

if (!connected) {
  console.error("Seed aborted: MongoDB is not available. Set MONGO_URI in server/.env.");
  process.exit(1);
}

await Promise.all([Deal.deleteMany({}), Store.deleteMany({}), Event.deleteMany({})]);
await Deal.insertMany(seedDeals);
await Store.insertMany(seedStores);
await Event.insertMany(seedEvents);

console.log("Database seeded.");
await mongoose.connection.close();
