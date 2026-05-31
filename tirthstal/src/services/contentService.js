import API from "./api";

// ═══════════════════════════════════════════
// FESTIVAL SERVICE
// ═══════════════════════════════════════════

export const getFestivals = async (params = {}) => {
  const { data } = await API.get("/festivals", { params });
  return data;
};

export const getUpcomingFestivals = async () => {
  const { data } = await API.get("/festivals/upcoming");
  return data.festivals;
};

export const getFestivalBySlug = async (slug) => {
  const { data } = await API.get(`/festivals/${slug}`);
  return data.festival;
};

export const createFestival = async (festivalData) => {
  const { data } = await API.post("/festivals", festivalData);
  return data.festival;
};

export const updateFestival = async (id, festivalData) => {
  const { data } = await API.put(`/festivals/${id}`, festivalData);
  return data.festival;
};

export const deleteFestival = async (id) => {
  const { data } = await API.delete(`/festivals/${id}`);
  return data;
};


// ═══════════════════════════════════════════
// BLOG SERVICE
// ═══════════════════════════════════════════

export const getBlogs = async (params = {}) => {
  const { data } = await API.get("/blogs", { params });
  return data; // { blogs, total, page, totalPages }
};

export const getFeaturedBlogs = async () => {
  const { data } = await API.get("/blogs/featured");
  return data.blogs;
};

export const getBlogBySlug = async (slug) => {
  const { data } = await API.get(`/blogs/${slug}`);
  return data.blog;
};

export const getBlogCategories = async () => {
  const { data } = await API.get("/blogs/categories");
  return data.categories;
};

export const createBlog = async (blogData) => {
  const { data } = await API.post("/blogs", blogData);
  return data.blog;
};

export const updateBlog = async (id, blogData) => {
  const { data } = await API.put(`/blogs/${id}`, blogData);
  return data.blog;
};

export const deleteBlog = async (id) => {
  const { data } = await API.delete(`/blogs/${id}`);
  return data;
};


// ═══════════════════════════════════════════
// DISTRICT SERVICE
// ═══════════════════════════════════════════

export const getDistricts = async (state) => {
  const params = state ? { state } : {};
  const { data } = await API.get("/districts", { params });
  return data.districts;
};

export const getDistrictBySlug = async (slug) => {
  const { data } = await API.get(`/districts/${slug}`);
  return data; // { district, temples }
};


// ═══════════════════════════════════════════
// REVIEW SERVICE
// ═══════════════════════════════════════════

export const getTempleReviews = async (templeId) => {
  const { data } = await API.get(`/temples/${templeId}/reviews`);
  return data.reviews;
};

export const addReview = async (templeId, reviewData) => {
  const { data } = await API.post(`/temples/${templeId}/reviews`, reviewData);
  return data.review;
};

export const updateReview = async (templeId, reviewId, reviewData) => {
  const { data } = await API.put(`/temples/${templeId}/reviews/${reviewId}`, reviewData);
  return data.review;
};

export const deleteReview = async (templeId, reviewId) => {
  const { data } = await API.delete(`/temples/${templeId}/reviews/${reviewId}`);
  return data;
};

export const markReviewHelpful = async (templeId, reviewId) => {
  const { data } = await API.post(`/temples/${templeId}/reviews/${reviewId}/helpful`);
  return data;
};