import API from "./api";

// ── Register ──
export const register = async (name, email, password) => {
  const { data } = await API.post("/auth/register", { name, email, password });
  if (data.token) {
    localStorage.setItem("tirthstal_token", data.token);
    localStorage.setItem("tirthstal_user", JSON.stringify(data.user));
  }
  return data;
};

// ── Login ──
export const login = async (email, password) => {
  const { data } = await API.post("/auth/login", { email, password });
  if (data.token) {
    localStorage.setItem("tirthstal_token", data.token);
    localStorage.setItem("tirthstal_user", JSON.stringify(data.user));
  }
  return data;
};

// ── Check Email ── (signup: email pehle se registered hai ya nahi)
export const checkEmail = async (email) => {
  const { data } = await API.post("/auth/check-email", { email });
  return data; // { success, exists }
};

// ── Logout ──
export const logout = async () => {
  try {
    await API.post("/auth/logout");
  } finally {
    localStorage.removeItem("tirthstal_token");
    localStorage.removeItem("tirthstal_user");
  }
};

// ── Get Profile ──
export const getProfile = async () => {
  const { data } = await API.get("/auth/profile");
  return data.user;
};

// ── Update Profile ──
export const updateProfile = async (updates) => {
  const { data } = await API.put("/auth/profile", updates);
  localStorage.setItem("tirthstal_user", JSON.stringify(data.user));
  return data.user;
};

// ── Get current user from localStorage ──
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("tirthstal_user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null; // corrupted storage par app crash na ho
  }
};

// Forgot Password
export const forgotPasswordAPI = async (email) => {
  const { data } = await API.post("/auth/forgot-password", { email });
  return data;
};

// Reset Password
export const resetPasswordAPI = async (token, password) => {
  const { data } = await API.post(`/auth/reset-password/${token}`, { password });
  return data;
};

export const isAuthenticated = () => !!localStorage.getItem("tirthstal_token");
