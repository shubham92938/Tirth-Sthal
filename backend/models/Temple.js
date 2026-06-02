const mongoose = require("mongoose");

const TempleSchema = new mongoose.Schema({
  name: {
    type:     String,
    required: [true, "Temple name is required"],
    trim:     true,
  },
  slug: {
    type:   String,
    unique: true,
  },
  deity: {
    type:     String,
    required: true,
  },
  // deityColor: String,
  // type:       String,
  // address: {
  //   type:     String,
  //   required: true,
  // },
  district: {
    type:     String,
    required: true,
  },
  state: {
    type:     String,
    required: true,
  },
//   description: String,
//   history:     String,
//   timings: {
//     morning: String,
//     evening: String,
//   },
//   aartiTimings: {
//     type:    Map,
//     of:      String,
//   },
//   festivals:  [String],
//   images:     [String],
//   coordinates: {
//     lat: Number,
//     lng: Number,
//   },
//   rating: {
//     type:    Number,
//     default: 0,
//     min:     0,
//     max:     5,
//   },
//   reviews: {
//     type:    Number,
//     default: 0,
//   },
//   facilities:    [String],
//   nearbyTemples: [String],
//   officialWebsite: String,
//   isActive: {
//     type:    Boolean,
//     default: true,
//   },
// }, 
},{ timestamps: true }); 

// ── Auto slug generate ──
TempleSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// ── Search Index ──
TempleSchema.index({
  name:     "text",
  deity:    "text",
  district: "text",
  state:    "text",
  type:     "text",
});

module.exports = mongoose.model("Temple", TempleSchema);