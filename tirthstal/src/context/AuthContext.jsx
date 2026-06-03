import { createContext, useContext, useState } from "react";
import {
  login       as loginService,
  register    as registerService,
  logout      as logoutService,
  googleLogin as googleLoginService,
  getCurrentUser,
} from "../services/authServices";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const ADMIN_PANEL_URL = import.meta.env.VITE_ADMIN_PANEL_URL || "http://localhost:5174";
  const redirectAdmin   = (token) => { window.location.href = `${ADMIN_PANEL_URL}/auth?token=${token}`; };

  const login = async (email, password) => {
    try {
      setLoading(true); setError(null);
      const data = await loginService(email, password);
      setUser(data.user);
      if (data.user.role === "admin") { redirectAdmin(data.token); return { ...data, isAdmin: true }; }
      return { ...data, isAdmin: false };
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg); throw new Error(msg);
    } finally { setLoading(false); }
  };

  const googleLogin = async (firebaseUser) => {
    try {
      setLoading(true); setError(null);
      const data = await googleLoginService({
        name: firebaseUser.displayName, email: firebaseUser.email,
        avatar: firebaseUser.photoURL,  googleId: firebaseUser.uid,
      });
      setUser(data.user);
      if (data.user.role === "admin") { redirectAdmin(data.token); return { ...data, isAdmin: true }; }
      return { ...data, isAdmin: false };
    } catch (err) {
      const msg = err.response?.data?.message || "Google login failed";
      setError(msg); throw new Error(msg);
    } finally { setLoading(false); }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true); setError(null);
      const data = await registerService(name, email, password);
      setUser(data.user); return data;
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg); throw new Error(msg);
    } finally { setLoading(false); }
  };

  const logout = async () => { await logoutService(); setUser(null); };

  return (
    <AuthContext.Provider value={{
      user, loading, error,
      isAuthenticated: !!user,
      isAdmin:         user?.role === "admin",
      isLoggedIn:      !!user,
      login, googleLogin, register, logout,
      clearError: () => setError(null),
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};