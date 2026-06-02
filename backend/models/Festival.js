const mongoose = require("mongoose");

const FestivalSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  slug:        { type: String, unique: true   },
  deity:       String,
  deityColor:  String,
  month:       String,
  date:        String,
  duration:    String,
  type:        String,
  state:       String,
  location:    String,
  image:       String,
  images:      [String],
  description: String,
  history:     String,
  importance:  String,
  howToCelebrate: String,
  templesCelebrated: [String],
  upcomingDate: Date,
  isUpcoming:  { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Festival", FestivalSchema);