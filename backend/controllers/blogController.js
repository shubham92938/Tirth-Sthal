const Blog = require("../models/Blog");

// ── सभी Blogs ──
exports.getAllBlogs = async (req, res, next) => {
  try {
    const { category, tag, search, page = 1, limit = 9 } = req.query;
    const query = { isPublished: true };

    if (category) query.category = category;
    if (tag)      query.tags     = tag;
    if (search)   query.$text    = { $search: search };

    const skip  = (page - 1) * limit;
    const total = await Blog.countDocuments(query);

    const blogs = await Blog
      .find(query)
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit))
      .select("-content"); // list me content mat bhejo, heavy hai

    res.status(200).json({
      success: true,
      total,
      page:       Number(page),
      totalPages: Math.ceil(total / limit),
      blogs,
    });
  } catch (error) {
    next(error);
  }
};

// ── Single Blog by slug ──
exports.getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true })
      .populate("relatedPosts", "title slug thumbnail excerpt category");

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // View count badhao
    blog.views += 1;
    await blog.save();

    res.status(200).json({ success: true, blog });
  } catch (error) {
    next(error);
  }
};

// ── Featured Blogs (top 3 by views) ──
exports.getFeaturedBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog
      .find({ isPublished: true })
      .sort("-views")
      .limit(3)
      .select("-content");

    res.status(200).json({ success: true, blogs });
  } catch (error) {
    next(error);
  }
};

// ── Blog create (Admin) ──
exports.createBlog = async (req, res, next) => {
  try {
    // Auto slug
    if (!req.body.slug) {
      req.body.slug = req.body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
    const blog = await Blog.create(req.body);
    res.status(201).json({ success: true, blog });
  } catch (error) {
    next(error);
  }
};

// ── Blog update (Admin) ──
exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.status(200).json({ success: true, blog });
  } catch (error) {
    next(error);
  }
};

// ── Blog delete (Admin) ──
exports.deleteBlog = async (req, res, next) => {
  try {
    await Blog.findByIdAndUpdate(req.params.id, { isPublished: false });
    res.status(200).json({ success: true, message: "Blog deleted" });
  } catch (error) {
    next(error);
  }
};

// ── All Categories list ──
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Blog.distinct("category", { isPublished: true });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};