const Review = require("../models/Review");
const Temple = require("../models/Temple");

// ── Temple ke reviews ──
exports.getTempleReviews = async (req, res, next) => {
  try {
    const reviews = await Review
      .find({ temple: req.params.templeId })
      .populate("user", "name avatar")
      .sort("-createdAt");

    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

// ── Review add karo ──
exports.addReview = async (req, res, next) => {
  try {
    const { rating, comment, visitType, visitMonth } = req.body;
    const templeId = req.params.templeId;

    // Already reviewed check
    const existing = await Review.findOne({ temple: templeId, user: req.user.id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this temple",
      });
    }

    const review = await Review.create({
      temple: templeId,
      user:   req.user.id,
      rating,
      comment,
      visitType,
      visitMonth,
    });

    // Temple ki average rating update karo
    await updateTempleRating(templeId);

    await review.populate("user", "name avatar");
    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

// ── Review update karo ──
exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const { rating, comment, visitType, visitMonth } = req.body;
    review.rating     = rating     || review.rating;
    review.comment    = comment    || review.comment;
    review.visitType  = visitType  || review.visitType;
    review.visitMonth = visitMonth || review.visitMonth;
    await review.save();

    await updateTempleRating(review.temple);

    res.status(200).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

// ── Review delete karo ──
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    // Admin ya apna hi review delete kar sakta
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const templeId = review.temple;
    await review.deleteOne();
    await updateTempleRating(templeId);

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    next(error);
  }
};

// ── Helpful mark ──
exports.markHelpful = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful: 1 } },
      { new: true }
    );
    res.status(200).json({ success: true, helpful: review.helpful });
  } catch (error) {
    next(error);
  }
};

// ── Internal helper: temple rating recalculate ──
const updateTempleRating = async (templeId) => {
  const result = await Review.aggregate([
    { $match: { temple: templeId } },
    { $group: { _id: "$temple", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  if (result.length > 0) {
    await Temple.findByIdAndUpdate(templeId, {
      rating:  Math.round(result[0].avgRating * 10) / 10,
      reviews: result[0].count,
    });
  } else {
    await Temple.findByIdAndUpdate(templeId, { rating: 0, reviews: 0 });
  }
};