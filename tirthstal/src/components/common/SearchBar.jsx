import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import { FiSearch, FiMapPin, FiArrowRight, FiX } from "react-icons/fi";
import { getAllTemples } from "../../data/temple";
import { templesData } from "../../data/temple";
import "../../styles/common/searchbar.css";

// ── सारा data तैयार करो searching के लिए ──
const allTemples  = getAllTemples("Madhya Pradesh");
const allStates   = Object.keys(templesData);
const allDistricts = [...new Set(allTemples.map((t) => t.district))];
const allDeities  = [...new Set(allTemples.map((t) =>
  t.deity.replace("Lord ", "").replace("Goddess ", "")
))];

// ── Search Items बनाओ ──
const searchItems = [
  // Temples
  ...allTemples.map((t) => ({
    type:     "temple",
    label:    t.name,
    sub:      `${t.district}, ${t.state}`,
    deity:    t.deity,
    slug:     t.slug,
    icon:     "🛕",
    action:   "navigate",
    path:     `/temples/${t.slug}`,
    keywords: `${t.name} ${t.deity} ${t.district} ${t.type} ${t.state}`,
  })),

  // States
  ...allStates.map((s) => ({
    type:     "state",
    label:    `Temples in ${s}`,
    sub:      `All temples in ${s}`,
    icon:     "📍",
    action:   "filter",
    path:     `/temples?state=${encodeURIComponent(s)}`,
    keywords: `${s} state temples`,
  })),

  // Districts
  ...allDistricts.map((d) => ({
    type:     "district",
    label:    `${d} District`,
    sub:      `Explore temples in ${d}`,
    icon:     "🗺️",
    action:   "filter",
    path:     `/districts/${d.toLowerCase()}`,
    keywords: `${d} district temples`,
  })),

  // Deities
  ...allDeities.map((d) => ({
    type:     "deity",
    label:    `${d} Temples`,
    sub:      `All temples of ${d}`,
    icon:     "🔱",
    action:   "filter",
    path:     `/temples?deity=${encodeURIComponent(d)}`,
    keywords: `${d} deity temples`,
  })),

  // Popular Searches
  { type: "popular", label: "Jyotirlinga Temples",   sub: "12 Sacred Jyotirlingas",    icon: "⭐", path: "/temples?type=Jyotirlinga",   keywords: "jyotirlinga shiva sacred" },
  { type: "popular", label: "Shakti Peeth Temples",  sub: "51 Shakti Peethas",          icon: "⚡", path: "/temples?type=Shakti Peeth",  keywords: "shakti peeth devi goddess" },
  { type: "popular", label: "UNESCO Heritage Sites", sub: "World Heritage Temples",     icon: "🏛️", path: "/temples?type=UNESCO",         keywords: "unesco heritage khajuraho" },
  { type: "popular", label: "Temples near Ujjain",   sub: "Temples in Ujjain district", icon: "📍", path: "/districts/ujjain",           keywords: "ujjain temples nearby" },
];

// ── Fuse.js Setup ──
const fuse = new Fuse(searchItems, {
  keys:              ["keywords", "label", "sub"],
  threshold:         0.4,   // 0 = exact, 1 = anything — 0.4 = spelling mistakes handle
  includeScore:      true,
  minMatchCharLength: 2,
});

// ── Type Colors ──
const typeColors = {
  temple:  { bg: "#fff6f0", color: "#c8610a" },
  state:   { bg: "#f0f7ff", color: "#3b82f6" },
  district:{ bg: "#f0fdf4", color: "#10b981" },
  deity:   { bg: "#fdf4ff", color: "#8b5cf6" },
  popular: { bg: "#fffbeb", color: "#f59e0b" },
};

export default function SearchBar({ placeholder = "Search temples, deities, places..." }) {
  const navigate = useNavigate();

  const [query,       setQuery]       = useState("");
  const [results,     setResults]     = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [correction,  setCorrection]  = useState(null);
  const inputRef  = useRef(null);
  const wrapRef   = useRef(null);

  // ── Search Logic ──
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setCorrection(null);
      return;
    }

    const raw = fuse.search(query.trim());

    // Top 8 results
    const top = raw.slice(0, 8).map((r) => r.item);
    setResults(top);

    // Spelling correction suggest करो
    if (raw.length > 0 && raw[0].score > 0.1) {
      const best = raw[0].item;
      if (best.label.toLowerCase() !== query.toLowerCase()) {
        setCorrection(best.label);
      } else {
        setCorrection(null);
      }
    } else {
      setCorrection(null);
    }

    setShowResults(true);
    setActiveIndex(-1);
  }, [query]);

  // ── Click outside बंद करो ──
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Keyboard Navigation ──
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((p) => Math.min(p + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      setActiveIndex((p) => Math.max(p - 1, -1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && results[activeIndex]) {
        handleSelect(results[activeIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setShowResults(false);
    }
  };

  // ── Item Select ──
  const handleSelect = (item) => {
    setQuery(item.label);
    setShowResults(false);
    navigate(item.path);
  };

  // ── Normal Search ──
  const handleSearch = () => {
    if (!query.trim()) return;
    const params = new URLSearchParams();
    params.set("search", query.trim());
    setShowResults(false);
    navigate(`/temples?${params.toString()}`);
  };

  // ── Clear ──
  const handleClear = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  // ── Default suggestions (empty input) ──
  const defaultSuggestions = [
    { type: "popular", label: "Jyotirlinga Temples",   icon: "⭐", path: "/temples?type=Jyotirlinga"  },
    { type: "popular", label: "Shakti Peeth Temples",  icon: "⚡", path: "/temples?type=Shakti Peeth" },
    { type: "state",   label: "Temples in MP",         icon: "📍", path: "/temples?state=Madhya Pradesh" },
    { type: "deity",   label: "Shiva Temples",         icon: "🔱", path: "/temples?deity=Shiva"        },
    { type: "deity",   label: "Vishnu Temples",        icon: "🪷", path: "/temples?deity=Vishnu"       },
    { type: "district",label: "Ujjain District",       icon: "🗺️", path: "/districts/ujjain"           },
  ];

  const displayResults = query.trim().length >= 2 ? results : [];
  const showDefaults   = showResults && query.trim().length < 2;

  return (
    <div className="smartsearch" ref={wrapRef}>

      {/* ── Input ── */}
      <div className={`smartsearch__input-wrap ${showResults ? "active" : ""}`}>
        <FiSearch size={16} className="smartsearch__icon" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowResults(true)}
          className="smartsearch__input"
        />
        {query && (
          <button className="smartsearch__clear" onClick={handleClear}>
            <FiX size={14} />
          </button>
        )}
        <button className="smartsearch__btn" onClick={handleSearch}>
          Search <FiArrowRight size={14} />
        </button>
      </div>

      {/* ── Dropdown ── */}
      <AnimatePresence>
        {showResults && (showDefaults || displayResults.length > 0) && (
          <motion.div
            className="smartsearch__dropdown"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
          >

            {/* Spelling Correction */}
            {correction && query.trim().length >= 2 && (
              <div
                className="smartsearch__correction"
                onClick={() => { setQuery(correction); }}
              >
                <span>🔍</span>
                <span>क्या आप ढूंढ रहे थे: </span>
                <strong>"{correction}"</strong>
                <span>?</span>
              </div>
            )}

            {/* Default Suggestions */}
            {showDefaults && (
              <>
                <p className="smartsearch__section-title">Popular Searches</p>
                {defaultSuggestions.map((item, i) => (
                  <div
                    key={i}
                    className="smartsearch__item"
                    onClick={() => handleSelect(item)}
                  >
                    <span className="smartsearch__item-icon"
                      style={{ background: typeColors[item.type]?.bg }}>
                      {item.icon}
                    </span>
                    <span className="smartsearch__item-label">{item.label}</span>
                    <FiArrowRight size={13} className="smartsearch__item-arrow" />
                  </div>
                ))}
              </>
            )}

            {/* Search Results */}
            {displayResults.length > 0 && (
              <>
                {/* Group by type */}
                {["temple", "state", "district", "deity", "popular"].map((type) => {
                  const group = displayResults.filter((r) => r.type === type);
                  if (group.length === 0) return null;

                  const titles = {
                    temple:   "🛕 Temples",
                    state:    "📍 States",
                    district: "🗺️ Districts",
                    deity:    "🔱 Deities",
                    popular:  "⭐ Popular",
                  };

                  return (
                    <div key={type}>
                      <p className="smartsearch__section-title">{titles[type]}</p>
                      {group.map((item, i) => {
                        const globalIndex = displayResults.indexOf(item);
                        return (
                          <div
                            key={i}
                            className={`smartsearch__item ${activeIndex === globalIndex ? "active" : ""}`}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setActiveIndex(globalIndex)}
                          >
                            <span
                              className="smartsearch__item-icon"
                              style={{ background: typeColors[type]?.bg, color: typeColors[type]?.color }}
                            >
                              {item.icon}
                            </span>
                            <div className="smartsearch__item-info">
                              <span className="smartsearch__item-label">{item.label}</span>
                              {item.sub && (
                                <span className="smartsearch__item-sub">{item.sub}</span>
                              )}
                            </div>
                            <span
                              className="smartsearch__item-type"
                              style={{ background: typeColors[type]?.bg, color: typeColors[type]?.color }}
                            >
                              {type}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </>
            )}

            {/* No Results */}
            {query.trim().length >= 2 && displayResults.length === 0 && (
              <div className="smartsearch__empty">
                <span>🔍</span>
                <p>कोई result नहीं मिला "<strong>{query}</strong>" के लिए</p>
                <button onClick={handleSearch}>
                  Search anyway <FiArrowRight size={13} />
                </button>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}