const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  temple: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  "Temple",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  "User",
    required: true,
  },
  rating:     { type: Number, required: true, min: 1, max: 5 },
  comment:    { type: String, required: true },
  visitType:  String,
  visitMonth: String,
  helpful:    { type: Number, default: 0 },
}, { timestamps: true });

// ── एक user एक temple पर एक ही review ──
ReviewSchema.index({ temple: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", ReviewSchema);