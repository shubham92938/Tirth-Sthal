import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
  timeout: 15000, // kabhi bhi request hamesha ke liye atki na rahe
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

// ── Response interceptor: session expire (401) pe logout + login page ──
// Lekin: galat password par login API bhi 401 deti hai — wahan redirect
// karne se page reload ho jata tha aur error message gayab ho jata tha.
// Isliye auth pages / login-register calls par redirect skip karo,
// error ko form tak jaane do.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      const isAuthCall =
        url.includes("/auth/login") || url.includes("/auth/register");
      const onAuthPage = window.location.pathname.startsWith("/auth/");

      if (!isAuthCall && !onAuthPage) {
        localStorage.removeItem("tirthstal_token");
        localStorage.removeItem("tirthstal_user");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
