import { useState } from "react";
import { toggleFavorite } from "../services/templeService";
import { useAuth } from "../context/AuthContext";

export const useFavorites = (initialFavorites = []) => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState(initialFavorites);
  const [loading,   setLoading]   = useState(false);

  const toggle = async (templeId) => {
    if (!isAuthenticated) return { requiresLogin: true };

    try {
      setLoading(true);
      const data = await toggleFavorite(templeId);
      setFavorites(data.favorites);
      return { message: data.message };
    } catch (err) {
      console.error("Favorite toggle error:", err);
      return { error: true };
    } finally {
      setLoading(false);
    }
  };

  const isFavorited = (templeId) =>
    favorites.some((id) => id.toString() === templeId.toString());

  return { favorites, loading, toggle, isFavorited };
};