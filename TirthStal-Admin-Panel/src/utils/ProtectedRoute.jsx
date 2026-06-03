export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("admin_token");
  if (!token) {
    window.location.href = (import.meta.env.VITE_TIRTHSTAL_URL || "http://localhost:5173") + "/auth/login";
    return null;
  }
  return children;
}