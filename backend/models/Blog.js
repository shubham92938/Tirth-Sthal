const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  slug:      { type: String, unique: true   },
  category:  String,
  author:    String,
  authorAvatar: String,
  thumbnail: String,
  excerpt:   String,
  content:   String,
  tags:      [String],
  relatedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
  views:     { type: Number, default: 0 },
  isPublished:{ type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Blog", BlogSchema);