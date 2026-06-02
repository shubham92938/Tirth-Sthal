const express = require("express");
const router  = express.Router();
const {
  getAllBlogs,
  getBlogBySlug,
  getFeaturedBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getCategories,
} = require("../controllers/blogController");
const { protect, adminOnly } = require("../middleware/auth");

router.get(   "/",            getAllBlogs);
router.get(   "/featured",    getFeaturedBlogs);
router.get(   "/categories",  getCategories);
router.get(   "/:slug",       getBlogBySlug);
router.post(  "/",            protect, adminOnly, createBlog);
router.put(   "/:id",         protect, adminOnly, updateBlog);
router.delete("/:id",         protect, adminOnly, deleteBlog);

module.exports = router;