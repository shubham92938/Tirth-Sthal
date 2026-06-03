import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthReceiver() {
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role !== "admin") {
          window.location.href = (import.meta.env.VITE_TIRTHSTAL_URL || "http://localhost:5173") + "/auth/login";
          return;
        }
        localStorage.setItem("admin_token", token);
        localStorage.setItem("admin_user", JSON.stringify({ id: payload.id, email: payload.email, role: "admin" }));
        navigate("/dashboard", { replace: true });
      } catch {
        window.location.href = (import.meta.env.VITE_TIRTHSTAL_URL || "http://localhost:5173") + "/auth/login";
      }
    } else {
      window.location.href = (import.meta.env.VITE_TIRTHSTAL_URL || "http://localhost:5173") + "/auth/login";
    }
  }, []);

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#0f0f0f", color:"#fff", gap:16 }}>
      <div style={{ fontSize: 48 }}>🛕</div>
      <p style={{ fontSize: 16, color: "#888" }}>Verifying admin access...</p>
    </div>
  );
}