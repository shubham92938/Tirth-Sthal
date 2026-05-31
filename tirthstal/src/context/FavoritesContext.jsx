import { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext({
  favorites:       [],
  addFavorite:     () => {},
  removeFavorite:  () => {},
  toggleFavorite:  () => {},
  isFavorite:      () => false,
  clearAll:        () => {},
});

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tirthstal_favorites")) || [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("tirthstal_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (item) => {
    setFavorites((prev) =>
      prev.find((f) => f.id === item.id) ? prev : [...prev, item]
    );
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const toggleFavorite = (item) => {
    setFavorites((prev) =>
      prev.find((f) => f.id === item.id)
        ? prev.filter((f) => f.id !== item.id)
        : [...prev, item]
    );
  };

  const isFavorite = (id) => favorites.some((f) => f.id === id);

  const clearAll = () => setFavorites([]);

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite, clearAll }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);