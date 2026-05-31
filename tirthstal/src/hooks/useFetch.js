import { useState, useEffect, useCallback } from "react";

// Generic data-fetching hook
// Usage: const { data, loading, error, refetch } = useFetch(getFestivals, { month: "Shravan" })
export const useFetch = (fetchFn, params = null, deps = []) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = params !== null ? await fetchFn(params) : await fetchFn();
      setData(result);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

// Convenience: fetch by single string param (slug / id)
export const useFetchOne = (fetchFn, param) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!param) return;
    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFn(param);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled)
          setError(err.response?.data?.message || "Not found");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [fetchFn, param]);

  return { data, loading, error };
};