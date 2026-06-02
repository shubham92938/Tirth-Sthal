const express = require("express");
const router  = express.Router();
const {
  getAllFestivals,
  getUpcomingFestivals,
  getFestivalBySlug,
  createFestival,
  updateFestival,
  deleteFestival,
} = require("../controllers/festivalController");
const { protect, adminOnly } = require("../middleware/auth");

router.get(   "/",           getAllFestivals);
router.get(   "/upcoming",   getUpcomingFestivals);
router.get(   "/:slug",      getFestivalBySlug);
router.post(  "/",           protect, adminOnly, createFestival);
router.put(   "/:id",        protect, adminOnly, updateFestival);
router.delete("/:id",        protect, adminOnly, deleteFestival);

module.exports = router;