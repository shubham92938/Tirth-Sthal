// ── Seed / update gaushalas for the Goseva page ──
// Usage (from backend/):  npm run seed:goseva
// Idempotent: upserts by `slug`, so it is safe to run again
// after editing seeds/gaushalaData.js. Requires MONGO_URI in .env.

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const Gaushala = require("../models/Gaushala");
const gaushalas = require("./gaushalaData");

(async () => {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not set. Copy .env.example to .env and fill it first.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);

    let created = 0;
    let updated = 0;

    for (const item of gaushalas) {
      const existing = await Gaushala.findOne({ slug: item.slug });
      if (existing) {
        await Gaushala.updateOne({ slug: item.slug }, { $set: item });
        updated += 1;
      } else {
        await Gaushala.create(item);
        created += 1;
      }
    }

    console.log(`🐄 Gaushalas seeded — created: ${created}, updated: ${updated}, total: ${gaushalas.length}`);
  } catch (error) {
    console.error(`❌ Seed failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
