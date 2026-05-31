import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3300/api",
  withCredentials: true,
});

// ── Request interceptor: har request me JWT attach karo ──
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("tirthstal_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: 401 pe auto logout ──
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("tirthstal_token");
      localStorage.removeItem("tirthstal_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;