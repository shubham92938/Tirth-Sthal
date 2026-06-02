const express = require("express");
const router  = express.Router();
const {
  getAllDistricts,
  getDistrictBySlug,
  createDistrict,
  updateDistrict,
  deleteDistrict,
  syncTempleCount,
} = require("../controllers/districtController");
const { protect, adminOnly } = require("../middleware/auth");

router.get(  "/",              getAllDistricts);
router.get(  "/:slug",         getDistrictBySlug);
router.post( "/",              protect, adminOnly, createDistrict);
router.put(  "/:id",           protect, adminOnly, updateDistrict);
router.delete("/:id",          protect, adminOnly, deleteDistrict);
router.post( "/admin/sync",    protect, adminOnly, syncTempleCount);

module.exports = router;