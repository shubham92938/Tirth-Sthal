const express = require("express");
const router  = express.Router({ mergeParams: true }); // templeId access karne ke liye
const {
  getTempleReviews,
  addReview,
  updateReview,
  deleteReview,
  markHelpful,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

// /api/temples/:templeId/reviews
router.get(  "/",             getTempleReviews);
router.post( "/",             protect, addReview);
router.put(  "/:id",          protect, updateReview);
router.delete("/:id",         protect, deleteReview);
router.post( "/:id/helpful",  protect, markHelpful);

module.exports = router;