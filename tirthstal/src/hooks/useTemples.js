import { useState, useEffect, useCallback } from "react";
import { getTemples, searchTemples } from "../services/templeService";

// ── Temple list with filters ──
export const useTemples = (initialFilters = {}) => {
  const [temples,    setTemples]    = useState([]);
  const [total,      setTotal]      = useState(0);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [filters,    setFilters]    = useState(initialFilters);

  const fetchTemples = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTemples({ ...filters, page });
      setTemples(data.temples);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load temples");
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchTemples();
  }, [fetchTemples]);

  // Filter change pe page reset karo
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({});
    setPage(1);
  };

  return {
    temples, total, page, totalPages,
    loading, error,
    setPage, updateFilters, resetFilters, refetch: fetchTemples,
  };
};

// ── Search suggestions (debounced) ──
export const useTempleSearch = (query, delay = 300) => {
  const [suggestions, setSuggestions] = useState([]);
  const [searching,   setSearching]   = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearching(true);
        const results = await searchTemples(query);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  return { suggestions, searching };
};