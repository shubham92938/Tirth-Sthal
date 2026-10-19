const jwt  = require("jsonwebtoken");
const User = require("../models/User");

// ── Helper: "Bearer <token>" se token nikalo ──
const getToken = (req) => {
  if (req.headers.authorization?.startsWith("Bearer")) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

// ── Login required ──
exports.protect = async (req, res, next) => {
  try {
    const token = getToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// ── Optional login ──
// Public routes (e.g. Goseva pledge) jahan guest bhi allowed hai,
// lekin token ho to user attach kar do. Kabhi 401 nahi deta.
exports.optionalAuth = async (req, res, next) => {
  try {
    const token = getToken(req);
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = (await User.findById(decoded.id)) || null;
    }
  } catch {
    req.user = null; // invalid/expired token → guest ki tarah aage badho
  }
  next();
};

// ── Admin only ── (hamesha `protect` ke baad lagao)
exports.adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
  next();
};
