const Festival = require("../models/Festival");

// ── सभी Festivals ──
exports.getAllFestivals = async (req, res, next) => {
  try {
    const { month, deity, state, type, upcoming } = req.query;
    const query = {};

    if (month)    query.month = month;
    if (deity)    query.deity = new RegExp(deity, "i");
    if (state)    query.state = new RegExp(state, "i");
    if (type)     query.type  = new RegExp(type,  "i");
    if (upcoming === "true") query.isUpcoming = true;

    const festivals = await Festival.find(query).sort({ upcomingDate: 1 });

    res.status(200).json({ success: true, count: festivals.length, festivals });
  } catch (error) {
    next(error);
  }
};

// ── Upcoming Festivals (next 3 months) ──
exports.getUpcomingFestivals = async (req, res, next) => {
  try {
    const now      = new Date();
    const threeMonths = new Date();
    threeMonths.setMonth(threeMonths.getMonth() + 3);

    const festivals = await Festival.find({
      upcomingDate: { $gte: now, $lte: threeMonths },
    }).sort({ upcomingDate: 1 }).limit(6);

    res.status(200).json({ success: true, festivals });
  } catch (error) {
    next(error);
  }
};

// ── Single Festival by slug ──
exports.getFestivalBySlug = async (req, res, next) => {
  try {
    const festival = await Festival.findOne({ slug: req.params.slug });
    if (!festival) {
      return res.status(404).json({ success: false, message: "Festival not found" });
    }
    res.status(200).json({ success: true, festival });
  } catch (error) {
    next(error);
  }
};

// ── Festival create (Admin) ──
exports.createFestival = async (req, res, next) => {
  try {
    const festival = await Festival.create(req.body);
    res.status(201).json({ success: true, festival });
  } catch (error) {
    next(error);
  }
};

// ── Festival update (Admin) ──
exports.updateFestival = async (req, res, next) => {
  try {
    const festival = await Festival.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!festival) {
      return res.status(404).json({ success: false, message: "Festival not found" });
    }
    res.status(200).json({ success: true, festival });
  } catch (error) {
    next(error);
  }
};

// ── Festival delete (Admin) ──
exports.deleteFestival = async (req, res, next) => {
  try {
    await Festival.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Festival deleted" });
  } catch (error) {
    next(error);
  }
};