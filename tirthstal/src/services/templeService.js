import API from "./api";

// ── सभी temples (with filters & pagination) ──
export const getTemples = async (params = {}) => {
  const { data } = await API.get("/temples", { params });
  return data; // { temples, total, page, totalPages }
};

// ── Single temple by slug ──
export const getTempleBySlug = async (slug) => {
  const { data } = await API.get(`/temples/${slug}`);
  return data.temple;
};

// ── Search suggestions (live search) ──
export const searchTemples = async (q) => {
  if (!q || q.length < 2) return [];
  const { data } = await API.get("/temples/search", { params: { q } });
  return data.suggestions;
};

// ── Favorite toggle ──
export const toggleFavorite = async (templeId) => {
  const { data } = await API.post(`/temples/${templeId}/favorite`);
  return data; // { message, favorites }
};

// ── Admin: Temple create ──
export const createTemple = async (templeData) => {
  const { data } = await API.post("/temples/api/login", templeData);
  return data.temple;
};

// ── Admin: Temple update ──
export const updateTemple = async (id, templeData) => {
  const { data } = await API.put(`/temples/${id}`, templeData);
  return data.temple;
};

// ── Admin: Temple delete ──
export const deleteTemple = async (id) => {
  const { data } = await API.delete(`/temples/${id}`);
  return data;
};