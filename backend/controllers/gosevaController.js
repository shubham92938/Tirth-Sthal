const Gaushala     = require("../models/Gaushala");
const GosevaPledge = require("../models/GosevaPledge");
const escapeRegex  = require("../utils/escapeRegex");

const SEVA_TYPES       = ["donation", "fodder", "adopt-cow", "medical", "volunteer", "other"];
const PLEDGE_STATUSES  = ["pending", "confirmed", "completed", "cancelled"];

// Auto slug — same helper style as blogController.createBlog
const makeSlug = (name = "") =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ════════════════════════════════════════════
// GAUSHALAS
// ════════════════════════════════════════════

// ── All Gaushalas (search + filters + pagination) ──
exports.getAllGaushalas = async (req, res, next) => {
  try {
    const {
      search, state, district, need, sort,
      page = 1, limit = 12,
    } = req.query;

    const query = { isActive: true };

    if (search) {
      const rx = new RegExp(escapeRegex(search), "i");
      query.$or = [
        { name: rx }, { district: rx }, { state: rx }, { location: rx },
      ];
    }
    if (state    && state    !== "All States")    query.state    = new RegExp(`^${escapeRegex(state)}$`, "i");
    if (district && district !== "All Districts") query.district = new RegExp(`^${escapeRegex(district)}$`, "i");
    if (need) query.needs = need;

    // Verified shelters first, then by herd size (unless sorted otherwise)
    let sortBy = { isVerified: -1, cowsCount: -1 };
    if (sort === "name")  sortBy = { name: 1 };
    if (sort === "cows")  sortBy = { cowsCount: -1 };
    if (sort === "newest") sortBy = { createdAt: -1 };

    const pageNum  = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(50, Math.max(1, Number(limit) || 12));
    const skip     = (pageNum - 1) * limitNum;

    const [total, gaushalas] = await Promise.all([
      Gaushala.countDocuments(query),
      Gaushala.find(query).sort(sortBy).skip(skip).limit(limitNum),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      gaushalas,
    });
  } catch (error) {
    next(error);
  }
};

// ── Single Gaushala by slug ──
exports.getGaushalaBySlug = async (req, res, next) => {
  try {
    const gaushala = await Gaushala.findOne({ slug: req.params.slug, isActive: true });
    if (!gaushala) {
      return res.status(404).json({ success: false, message: "Gaushala not found" });
    }
    res.status(200).json({ success: true, gaushala });
  } catch (error) {
    next(error);
  }
};

// ── Gaushala create (Admin) ──
exports.createGaushala = async (req, res, next) => {
  try {
    if (!req.body.slug && req.body.name) {
      req.body.slug = makeSlug(req.body.name);
    }
    const gaushala = await Gaushala.create(req.body);
    res.status(201).json({ success: true, gaushala });
  } catch (error) {
    next(error);
  }
};

// ── Gaushala update (Admin) ──
exports.updateGaushala = async (req, res, next) => {
  try {
    const gaushala = await Gaushala.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!gaushala) {
      return res.status(404).json({ success: false, message: "Gaushala not found" });
    }
    res.status(200).json({ success: true, gaushala });
  } catch (error) {
    next(error);
  }
};

// ── Gaushala delete (Admin) — soft delete, same as Temples ──
exports.deleteGaushala = async (req, res, next) => {
  try {
    const gaushala = await Gaushala.findByIdAndUpdate(
      req.params.id, { isActive: false }, { new: true }
    );
    if (!gaushala) {
      return res.status(404).json({ success: false, message: "Gaushala not found" });
    }
    res.status(200).json({ success: true, message: "Gaushala deleted" });
  } catch (error) {
    next(error);
  }
};

// ── Goseva stats for the page header / home CTA ──
exports.getGosevaStats = async (req, res, next) => {
  try {
    const [gaushalaAgg, totalPledges, pledgeAgg, volunteers] = await Promise.all([
      Gaushala.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, totalGaushalas: { $sum: 1 }, totalCows: { $sum: "$cowsCount" } } },
      ]),
      GosevaPledge.countDocuments({ status: { $ne: "cancelled" } }),
      GosevaPledge.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ]),
      GosevaPledge.countDocuments({ sevaType: "volunteer", status: { $ne: "cancelled" } }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalGaushalas:  gaushalaAgg[0]?.totalGaushalas || 0,
        totalCows:       gaushalaAgg[0]?.totalCows || 0,
        totalPledges,
        totalPledgedAmount: pledgeAgg[0]?.totalAmount || 0,
        volunteers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ════════════════════════════════════════════
// SEVA PLEDGES
// ════════════════════════════════════════════

// ── Create a pledge (public; logged-in user is attached if token sent) ──
exports.createPledge = async (req, res, next) => {
  try {
    const {
      name, email, phone,
      gaushalaId, gaushalaSlug, gaushalaName,
      sevaType = "donation", amount = 0,
      preferredDate, message,
    } = req.body;

    // ── Basic validation (clear messages for the form) ──
    if (!name || String(name).trim().length < 2) {
      return res.status(400).json({ success: false, message: "Please enter your name" });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }
    if (phone && !/^[+\d][\d\s-]{9,15}$/.test(String(phone).trim())) {
      return res.status(400).json({ success: false, message: "Please enter a valid phone number" });
    }
    if (!SEVA_TYPES.includes(sevaType)) {
      return res.status(400).json({ success: false, message: "Invalid seva type" });
    }

    const amountNum = Number(amount) || 0;
    if (amountNum < 0) {
      return res.status(400).json({ success: false, message: "Amount cannot be negative" });
    }
    if (sevaType === "donation" && amountNum < 1) {
      return res.status(400).json({
        success: false,
        message: "Please enter a donation amount (minimum ₹1)",
      });
    }

    let preferred;
    if (preferredDate) {
      preferred = new Date(preferredDate);
      if (Number.isNaN(preferred.getTime())) {
        return res.status(400).json({ success: false, message: "Invalid preferred date" });
      }
    }

    // ── Resolve gaushala by id/slug when possible; keep a name snapshot ──
    let gaushalaDoc = null;
    if (gaushalaId)   gaushalaDoc = await Gaushala.findById(gaushalaId).catch(() => null);
    if (!gaushalaDoc && gaushalaSlug) {
      gaushalaDoc = await Gaushala.findOne({ slug: gaushalaSlug });
    }

    const pledge = await GosevaPledge.create({
      user:         req.user?._id || null, // set by optionalAuth when logged in
      name:         String(name).trim(),
      email:        String(email).trim().toLowerCase(),
      phone:        phone ? String(phone).trim() : undefined,
      gaushala:     gaushalaDoc?._id || null,
      gaushalaName: gaushalaDoc?.name || gaushalaName || "Any Gaushala",
      sevaType,
      amount:       sevaType === "volunteer" ? 0 : amountNum,
      preferredDate: preferred,
      message:      message ? String(message).trim() : undefined,
    });

    res.status(201).json({
      success: true,
      message: "🙏 Dhanyavaad! Your Goseva pledge has been recorded.",
      pledge,
    });
  } catch (error) {
    next(error);
  }
};

// ── My pledges (logged-in user) ──
exports.getMyPledges = async (req, res, next) => {
  try {
    const pledges = await GosevaPledge
      .find({ user: req.user._id })
      .sort("-createdAt")
      .limit(50);

    res.status(200).json({ success: true, count: pledges.length, pledges });
  } catch (error) {
    next(error);
  }
};

// ── All pledges (Admin) — filter by status / sevaType, paginated ──
exports.getAllPledges = async (req, res, next) => {
  try {
    const { status, sevaType, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status   && PLEDGE_STATUSES.includes(status)) query.status   = status;
    if (sevaType && SEVA_TYPES.includes(sevaType))    query.sevaType = sevaType;

    const pageNum  = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
    const skip     = (pageNum - 1) * limitNum;

    const [total, pledges] = await Promise.all([
      GosevaPledge.countDocuments(query),
      GosevaPledge.find(query)
        .populate("user", "name email")
        .populate("gaushala", "name slug location")
        .sort("-createdAt")
        .skip(skip)
        .limit(limitNum),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      pledges,
    });
  } catch (error) {
    next(error);
  }
};

// ── Update pledge status (Admin): pending → confirmed → completed ──
exports.updatePledgeStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!PLEDGE_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const pledge = await GosevaPledge.findByIdAndUpdate(
      req.params.id, { status }, { new: true, runValidators: true }
    );
    if (!pledge) {
      return res.status(404).json({ success: false, message: "Pledge not found" });
    }

    res.status(200).json({ success: true, pledge });
  } catch (error) {
    next(error);
  }
};
