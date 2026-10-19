import API from "./api";
import { gaushalas as localGaushalas } from "../data/gaushalas";

// ═══════════════════════════════════════════
// GOSEVA SERVICE
// API first, local data fallback — so the Goseva page keeps
// working even when the backend is offline (same philosophy
// as the rest of the site, which reads from src/data/* ).
// Short per-request timeouts keep the fallback snappy.
// ═══════════════════════════════════════════

const LOCAL_PLEDGES_KEY = "tirthstal_goseva_pledges";

// ── Gaushala directory ──
export const getGaushalas = async (params = {}) => {
  try {
    const { data } = await API.get("/goseva/gaushalas", {
      params: { limit: 50, ...params },
      timeout: 4000,
    });
    if (data?.success && Array.isArray(data.gaushalas) && data.gaushalas.length > 0) {
      return { gaushalas: data.gaushalas, total: data.total, source: "api" };
    }
    throw new Error("Empty API response");
  } catch {
    return { gaushalas: localGaushalas, total: localGaushalas.length, source: "local" };
  }
};

export const getGaushalaBySlug = async (slug) => {
  try {
    const { data } = await API.get(`/goseva/gaushalas/${slug}`, { timeout: 4000 });
    if (data?.success) return data.gaushala;
    throw new Error("Not found");
  } catch {
    return localGaushalas.find((g) => g.slug === slug) || null;
  }
};

// ── Stats (API aggregates, or computed locally) ──
export const getGosevaStats = async () => {
  try {
    const { data } = await API.get("/goseva/stats", { timeout: 4000 });
    if (data?.success && data.stats?.totalGaushalas > 0) {
      return { ...data.stats, source: "api" };
    }
    throw new Error("Empty API response");
  } catch {
    const localPledges = getLocalPledges();
    return {
      totalGaushalas: localGaushalas.length,
      totalCows: localGaushalas.reduce((sum, g) => sum + (g.cowsCount || 0), 0),
      totalPledges: localPledges.length,
      totalPledgedAmount: localPledges.reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
      volunteers: localPledges.filter((p) => p.sevaType === "volunteer").length,
      source: "local",
    };
  }
};

// ── Offline pledges (saved on this device when server is unreachable) ──
export const getLocalPledges = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_PLEDGES_KEY)) || [];
  } catch {
    return [];
  }
};

const saveLocalPledge = (pledge) => {
  const all = getLocalPledges();
  all.unshift(pledge);
  localStorage.setItem(LOCAL_PLEDGES_KEY, JSON.stringify(all));
};

// ── Submit a seva pledge ──
// Returns { pledge, offline } — offline=true means the API could not
// be reached and the pledge was saved on this device instead.
// Server validation errors (4xx) are thrown with their message.
export const createPledge = async (pledgeData) => {
  try {
    const { data } = await API.post("/goseva/pledges", pledgeData, { timeout: 8000 });
    return { pledge: data.pledge, offline: false };
  } catch (error) {
    // Server ne jawab diya (validation/auth error) → message upar bhejo
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message, { cause: error });
    }
    // Network/server down → device par save karke aage badho
    const localPledge = {
      ...pledgeData,
      _id: `local-${Date.now()}`,
      status: "pending",
      offline: true,
      createdAt: new Date().toISOString(),
    };
    saveLocalPledge(localPledge);
    return { pledge: localPledge, offline: true };
  }
};

// ── Logged-in user's pledges (API + any offline ones on this device) ──
export const getMyPledges = async () => {
  const local = getLocalPledges().map((p) => ({ ...p, offline: true }));
  // Guest ke paas token nahi hota — protected API call hi mat karo,
  // warna 401 par faltu me login redirect ho jayega.
  if (!localStorage.getItem("tirthstal_token")) return local;
  try {
    const { data } = await API.get("/goseva/pledges/mine", { timeout: 4000 });
    const remote = data?.pledges || [];
    return [...local, ...remote].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } catch {
    return local;
  }
};
