const Temple = require("../models/Temple");

// ── सभी temples ──
exports.getAllTemples = async (req, res, next) => {
  try {
    const {
      search, state, district, deity,
      type, sort, page = 1, limit = 12
    } = req.query;

    const query = { isActive: true };

    // Search
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (state    && state    !== "All States")    query.state    = state;
    if (district && district !== "All Districts") query.district = district;
    if (deity    && deity    !== "All Deities")   query.deity    = new RegExp(deity,    "i");
    if (type     && type     !== "All Types")     query.type     = new RegExp(type,     "i");

    // Sort
    let sortBy = "-createdAt";
    if (sort === "Name A-Z") sortBy = "name";
    if (sort === "Name Z-A") sortBy = "-name";
    if (sort === "Rating")   sortBy = "-rating";

    const skip  = (page - 1) * limit;
    const total = await Temple.countDocuments(query);

    const temples = await Temple
      .find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page:       Number(page),
      totalPages: Math.ceil(total / limit),
      temples,
    });
  } catch (error) {
    next(error);
  }
};

// ── Single temple by slug ──
exports.getTempleBySlug = async (req, res, next) => {
  try {
    const temple = await Temple.findOne({ slug: req.params.slug });
    if (!temple) {
      return res.status(404).json({ success: false, message: "Temple not found" });
    }
    res.status(200).json({ success: true, temple });
  } catch (error) {
    next(error);
  }
};

// ── Temple add करो (Admin) ──
exports.createTemple = async (req, res, next) => {
  try {
    const temple = await Temple.create(req.body);
    console.log("hello")
    res.status(201).json({ success: true, temple });
  } catch (error) {
    next(error);
  }
};

// ── Temple update करो (Admin) ──
exports.updateTemple = async (req, res, next) => {
  try {
    const temple = await Temple.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!temple) {
      return res.status(404).json({ success: false, message: "Temple not found" });
    }
    res.status(200).json({ success: true, temple });
  } catch (error) {
    next(error);
  }
};

// ── Temple delete करो (Admin) ──
exports.deleteTemple = async (req, res, next) => {
  try {
    const temple = await Temple.findByIdAndUpdate(
      req.params.id, { isActive: false }, { new: true }
    );
    if (!temple) {
      return res.status(404).json({ success: false, message: "Temple not found" });
    }
    res.status(200).json({ success: true, message: "Temple deleted" });
  } catch (error) {
    next(error);
  }
};

// ── Search suggestions ──
exports.searchSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.status(200).json({ success: true, suggestions: [] });
    }

    const temples = await Temple.find({
      $or: [
        { name:     new RegExp(q, "i") },
        { deity:    new RegExp(q, "i") },
        { district: new RegExp(q, "i") },
        { type:     new RegExp(q, "i") },
      ],
      isActive: true,
    })
    .select("name slug deity district state type images")
    .limit(8);

    res.status(200).json({ success: true, suggestions: temples });
  } catch (error) {
    next(error);
  }
};

// ── Favorites ──
exports.addToFavorites = async (req, res, next) => {
  try {
    const User   = require("../models/User");
    const user   = await User.findById(req.user.id);
    const templeId = req.params.id;

    if (user.favorites.includes(templeId)) {
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== templeId
      );
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Removed from favorites",
        favorites: user.favorites,
      });
    }

    user.favorites.push(templeId);
    await user.save();
    res.status(200).json({
      success: true,
      message: "Added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    next(error);
  }
};