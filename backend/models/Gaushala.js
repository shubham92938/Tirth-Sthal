const mongoose = require("mongoose");

// ── Gaushala (cow shelter) listed on the Goseva page ──
const GaushalaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Gaushala name is required"],
      trim: true,
      maxlength: [120, "Name cannot exceed 120 characters"],
    },
    slug: { type: String, unique: true, index: true },

    image: { type: String, default: "" },
    images: [String],

    // Location (same display style as Festival/Temple models)
    location: String, // e.g. "Ujjain, MP"
    address: String,
    district: { type: String, trim: true },
    state: { type: String, trim: true },

    cowsCount: { type: Number, default: 0, min: 0 },
    established: { type: Number }, // year, e.g. 1998
    visitingHours: { type: String, default: "6:00 AM – 8:00 PM" },

    description: String,
    facilities: [String], // e.g. ["Veterinary care", "Fodder bank", ...]

    // What this gaushala currently needs help with
    needs: {
      type: [String],
      enum: ["Fodder", "Medical", "Shelter", "Volunteers", "Funds"],
      default: [],
    },

    contact: {
      phone: String,
      email: String,
    },

    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Text index for search (same approach as Temple/Blog models)
GaushalaSchema.index({ name: "text", district: "text", state: "text", location: "text" });

module.exports = mongoose.model("Gaushala", GaushalaSchema);
