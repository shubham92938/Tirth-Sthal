const dotenv       = require("dotenv");
dotenv.config();
const express      = require("express");
const cors         = require("cors");
const helmet       = require("helmet");
const morgan       = require("morgan");
const connectDB    = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// ── Routes ──
const authRoutes     = require("./routes/authRoutes");
const templeRoutes   = require("./routes/templeRoutes");
const districtRoutes = require("./routes/districtRoutes");
const festivalRoutes = require("./routes/festivalRoutes");
const blogRoutes     = require("./routes/blogRoutes");
const reviewRoutes   = require("./routes/reviewRoutes");
const gosevaRoutes   = require("./routes/gosevaRoutes");

connectDB();

const app = express();

// ── Middleware ──
app.use(helmet());

// CLIENT_URL me comma-separated multiple origins diye ja sakte hain
// (e.g. local dev + production domain). Bina env ke local dev origins allow.
const allowedOrigins = (process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
  : ["http://localhost:5173", "http://localhost:4173", "http://127.0.0.1:5173"]
).map((o) => o.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Non-browser tools (curl/Postman) ka origin nahi hota — allow
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes Mount ──
app.use("/api/auth",      authRoutes);
app.use("/api/temples",   templeRoutes);
app.use("/api/districts", districtRoutes);
app.use("/api/festivals", festivalRoutes);
app.use("/api/blogs",     blogRoutes);
app.use("/api/goseva",    gosevaRoutes);

// ── Nested review route: /api/temples/:templeId/reviews ──
app.use("/api/temples/:templeId/reviews", reviewRoutes);

// ── Health Check ──
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🛕 Tirthstal API is running!",
    version: "1.0.0",
    routes: [
      "POST   /api/auth/register",
      "POST   /api/auth/login",
      "POST   /api/auth/check-email",
      "POST   /api/auth/forgot-password",
      "POST   /api/auth/reset-password/:token",
      "GET    /api/auth/profile",
      "PUT    /api/auth/profile",
      "GET    /api/temples",
      "GET    /api/temples/search?q=",
      "GET    /api/temples/:slug",
      "POST   /api/temples/:id/favorite",
      "GET    /api/temples/:templeId/reviews",
      "POST   /api/temples/:templeId/reviews",
      "GET    /api/districts",
      "GET    /api/districts/:slug",
      "GET    /api/festivals",
      "GET    /api/festivals/upcoming",
      "GET    /api/festivals/:slug",
      "GET    /api/blogs",
      "GET    /api/blogs/featured",
      "GET    /api/blogs/categories",
      "GET    /api/blogs/:slug",
      "GET    /api/goseva/stats",
      "GET    /api/goseva/gaushalas",
      "GET    /api/goseva/gaushalas/:slug",
      "POST   /api/goseva/pledges",
      "GET    /api/goseva/pledges/mine",
      "GET    /api/goseva/pledges (admin)",
      "PUT    /api/goseva/pledges/:id/status (admin)",
    ],
  });
});

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Error Handler ──
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔗 Health: http://localhost:${PORT}/api/health`);
  console.log('EveryThing is Working Fine')
});
