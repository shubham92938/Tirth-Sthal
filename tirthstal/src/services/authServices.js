import API from "./api";

export const register = async (name, email, password) => {
  const { data } = await API.post("/auth/register", { name, email, password });
  if (data.token) {
    localStorage.setItem("tirthstal_token", data.token);
    localStorage.setItem("tirthstal_user",  JSON.stringify(data.user));
  }
  return data;
};

export const login = async (email, password) => {
  const { data } = await API.post("/auth/login", { email, password });
  if (data.token) {
    localStorage.setItem("tirthstal_token", data.token);
    localStorage.setItem("tirthstal_user",  JSON.stringify(data.user));
  }
  return data;
};

export const googleLogin = async ({ name, email, avatar, googleId }) => {
  const { data } = await API.post("/auth/google", { name, email, avatar, googleId });
  if (data.token) {
    localStorage.setItem("tirthstal_token", data.token);
    localStorage.setItem("tirthstal_user",  JSON.stringify(data.user));
  }
  return data;
};

export const logout = async () => {
  try { await API.post("/auth/logout"); }
  finally {
    localStorage.removeItem("tirthstal_token");
    localStorage.removeItem("tirthstal_user");
  }
};

export const getProfile      = async () => { const { data } = await API.get("/auth/profile"); return data.user; };
export const updateProfile   = async (updates) => { const { data } = await API.put("/auth/profile", updates); localStorage.setItem("tirthstal_user", JSON.stringify(data.user)); return data.user; };
export const forgotPasswordAPI = async (email) => { const { data } = await API.post("/auth/forgot-password", { email }); return data; };
export const resetPasswordAPI  = async (token, password) => { const { data } = await API.post(`/auth/reset-password/${token}`, { password }); return data; };
export const getCurrentUser  = () => { try { return JSON.parse(localStorage.getItem("tirthstal_user")); } catch { return null; } };
export const isAuthenticated = () => !!localStorage.getItem("tirthstal_token");