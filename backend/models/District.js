const mongoose = require("mongoose");

const DistrictSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  slug:        { type: String, unique: true },
  state:       { type: String, required: true },
  description: String,
  image:       String,
  templeCount: { type: Number, default: 0 },
  famousFor:   [String],
  coordinates: {
    lat: Number,
    lng: Number,
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

DistrictSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

module.exports = mongoose.model("District", DistrictSchema);