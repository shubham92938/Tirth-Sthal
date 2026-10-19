const express = require("express");
const router  = express.Router();
const {
  getAllGaushalas,
  getGaushalaBySlug,
  createGaushala,
  updateGaushala,
  deleteGaushala,
  getGosevaStats,
  createPledge,
  getMyPledges,
  getAllPledges,
  updatePledgeStatus,
} = require("../controllers/gosevaController");
const { protect, adminOnly, optionalAuth } = require("../middleware/auth");

// ── Public ──
router.get("/stats",               getGosevaStats);
router.get("/gaushalas",           getAllGaushalas);
router.get("/gaushalas/:slug",     getGaushalaBySlug);

// ── Pledges ── ("/pledges/mine" must stay above admin "/pledges")
router.post("/pledges",            optionalAuth, createPledge);
router.get( "/pledges/mine",       protect, getMyPledges);
router.get( "/pledges",            protect, adminOnly, getAllPledges);
router.put( "/pledges/:id/status", protect, adminOnly, updatePledgeStatus);

// ── Gaushala management (Admin) ──
router.post(  "/gaushalas",     protect, adminOnly, createGaushala);
router.put(   "/gaushalas/:id", protect, adminOnly, updateGaushala);
router.delete("/gaushalas/:id", protect, adminOnly, deleteGaushala);

module.exports = router;
