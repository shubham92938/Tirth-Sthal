import { useState , useEffect } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FiHome, FiChevronRight, FiSearch, FiChevronDown,
         FiRefreshCw, FiList, FiMapPin, FiNavigation,
         FiBookmark, FiX, FiFilter } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { getAllTemples } from "../../data/temple";
import "../../styles/map/mapPage.css";
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

const createIcon = (color) => L.divIcon({
  className: "",
  html: `<div style="
    width:36px; height:36px;
    background:${color};
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    border:3px solid #fff;
    box-shadow:0 2px 8px rgba(0,0,0,0.3);
    display:flex; align-items:center; justify-content:center;
  ">
    <span style="transform:rotate(45deg); font-size:14px;">🛕</span>
  </div>`,
  iconSize:   [36, 36],
  iconAnchor: [18, 36],
  popupAnchor:[0, -36],
});

const typeColors = {
  "Jyotirlinga":          "#f97316",
  "Shakti Peeth":         "#ec4899",
  "UNESCO Heritage Temple":"#8b5cf6",
  "Royal Palace Temple":  "#f59e0b",
  "Buddhist Temple":      "#f59e0b",
  "default":              "#c8610a",
};

const stateOptions    = ["All States", "Madhya Pradesh", "Maharashtra", "Rajasthan"];
const districtOptions = ["All Districts", "Ujjain", "Indore", "Bhopal", "Khajuraho", "Orchha"];
const typeOptions     = ["All Types", "Jyotirlinga", "Shakti Peeth", "UNESCO Heritage Temple", "Royal Palace Temple"];
const deityOptions    = ["All Deities", "Lord Shiva", "Lord Vishnu", "Goddess Durga", "Lord Ganesh", "Lord Ram"];

const popularFilters = [
  { label: "Jyotirlinga",    color: "#f97316", icon: "🔱" },
  { label: "Shakti Peeth",   color: "#ec4899", icon: "⚔️" },
  { label: "Char Dham",      color: "#f59e0b", icon: "🏛️" },
  { label: "Vishnu Temples", color: "#8b5cf6", icon: "🪷" },
  { label: "Shiva Temples",  color: "#3b82f6", icon: "🕉️" },
  { label: "Famous Temples", color: "#10b981", icon: "⭐" },
];

const nearbyTemples = [
  { name: "Tungnath Temple",        dist: "3.5 km"  },
  { name: "Madhyamaheshwar Temple", dist: "16 km"   },
  { name: "Rudranath Temple",       dist: "22 km"   },
];

// ── Fly to location helper ──
function FlyTo({ center }) {
  const map = useMap();
  if (center) map.flyTo(center, 12, { duration: 1.2 });
  return null;
}

export default function MapPage() {
  const allTemples = getAllTemples("Madhya Pradesh");

  const [search,          setSearch]          = useState("");
  const [selState,        setSelState]        = useState("All States");
  const [selDistrict,     setSelDistrict]     = useState("All Districts");
  const [selType,         setSelType]         = useState("All Types");
  const [selDeity,        setSelDeity]        = useState("All Deities");
  const [stateOpen,       setStateOpen]       = useState(false);
  const [districtOpen,    setDistrictOpen]    = useState(false);
  const [typeOpen,        setTypeOpen]        = useState(false);
  const [deityOpen,       setDeityOpen]       = useState(false);
  const [selectedTemple,  setSelectedTemple]  = useState(allTemples[0]);
  const [flyCenter,       setFlyCenter]       = useState(null);
  const [showList,        setShowList]        = useState(false);
  const [activeFilters,   setActiveFilters]   = useState([]);
  const [filterOpen,      setFilterOpen]      = useState(false);

  // Lock scroll when filter drawer open on mobile
  useEffect(() => {
    document.body.style.overflow = filterOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [filterOpen]);

  const activeFilterCount =
    (search ? 1 : 0) +
    (selState !== "All States" ? 1 : 0) +
    (selDistrict !== "All Districts" ? 1 : 0) +
    (selType !== "All Types" ? 1 : 0) +
    (selDeity !== "All Deities" ? 1 : 0) +
    activeFilters.length;

  // ── Filter logic ──
  const filtered = allTemples.filter((t) => {
    const q  = search.toLowerCase();
    const ms = t.name.toLowerCase().includes(q) || t.deity.toLowerCase().includes(q);
    const mt = selType     === "All Types"     || t.type     === selType;
    const md = selDeity    === "All Deities"   || t.deity    === selDeity;
    const mdi= selDistrict === "All Districts" || t.district === selDistrict;
    return ms && mt && md && mdi;
  });

  const handleSelectTemple = (temple) => {
    setSelectedTemple(temple);
    if (temple.coordinates) {
      setFlyCenter([temple.coordinates.lat, temple.coordinates.lng]);
    }
  };

  const resetFilters = () => {
    setSearch(""); setSelState("All States");
    setSelDistrict("All Districts");
    setSelType("All Types"); setSelDeity("All Deities");
    setActiveFilters(["MadhyaPradesh"]);
  };

  const togglePopularFilter = (label) => {
    setActiveFilters((prev) =>
      prev.includes(label) ? prev.filter((f) => f !== label) : [...prev, label]
    );
  };

  const Dropdown = ({ value, options, open, setOpen, onSelect }) => (
    <div className="map-filter__dropdown" onClick={() => setOpen(!open)}>
      <span>{value}</span>
      <FiChevronDown size={13} className={open ? "rotated" : ""} />
      {open && (
        <ul className="map-filter__list">
          {options.map((o) => (
            <li
              key={o}
              className={value === 0 ? "selected" : ""}
              onClick={(e) => { e.stopPropagation(); onSelect(o); setOpen(false); }}
            >
              {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="map-page">

      {/* ── Breadcrumb ── */}
      <div className="map-page__breadcrumb">
        <Link to="/"><FiHome size={13} /> Home</Link>
        <FiChevronRight size={13} />
        <span>Temple Map</span>
      </div>

      {/* ── Header ── */}
      <div className="map-page__header">
        <div className="map-page__header-left">
          <h1 className="map-page__title">Temple Map of India</h1>
          <p className="map-page__sub">
            Explore temples across India. Use filters to find temples<br />
            by state, category or temple type.
          </p>
        </div>
        <div className="map-page__header-img">
          <img src="/images/hero-temples.jpeg" alt="hellow"
            onError={(e) => e.target.style.display = "flex"} />
        </div>
      </div>

      {/* ── Mobile Filter Button ── */}
      <div className="map-page__mobile-bar">
        <button
          className="map-page__filter-btn"
          onClick={() => setFilterOpen(true)}
        >
          <FiFilter size={15} />
          Filters
          {activeFilterCount > 0 && (
            <span className="map-page__filter-badge">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* ── Main Body ── */}
      <div className="map-page__body">

        {/* ── Left Filters (desktop only) ── */}
        <aside className="map-filter map-filter--desktop">
          <div className="map-filter__top">
            <h3>Filters</h3>
            <button className="map-filter__reset" onClick={resetFilters}>
              <FiRefreshCw size={13} /> Reset
            </button>
          </div>

          {/* Search */}
          <div className="map-filter__section">
            <p className="map-filter__label">Search Temple</p>
            <div className="map-filter__search">
              <input
                type="text"
                placeholder="Search temple name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <FiSearch size={14} />
            </div>
          </div>

          {/* State */}
          <div className="map-filter__section">
            <p className="map-filter__label">Select State</p>
            <Dropdown value={selState} options={stateOptions}
              open={stateOpen} setOpen={setStateOpen} onSelect={setSelState} />
          </div>

          {/* District */}
          <div className="map-filter__section">
            <p className="map-filter__label">Select District</p>
            <Dropdown value={selDistrict} options={districtOptions}
              open={districtOpen} setOpen={setDistrictOpen} onSelect={setSelDistrict} />
          </div>

          {/* Type */}
          <div className="map-filter__section">
            <p className="map-filter__label">Temple Type</p>
            <Dropdown value={selType} options={typeOptions}
              open={typeOpen} setOpen={setTypeOpen} onSelect={setSelType} />
          </div>

          {/* Deity */}
          <div className="map-filter__section">
            <p className="map-filter__label">Deity</p>
            <Dropdown value={selDeity} options={deityOptions}
              open={deityOpen} setOpen={setDeityOpen} onSelect={setSelDeity} />
          </div>

          {/* Popular Filters */}
          <div className="map-filter__section">
            <p className="map-filter__label">Popular Filters</p>
            <div className="map-filter__popular">
              {popularFilters.map((f) => (
                <button
                  key={f.label}
                  className={`map-filter__popular-btn ${activeFilters.includes(f.label) ? "active" : ""}`}
                  style={{ "--accent": f.color }}
                  onClick={() => togglePopularFilter(f.label)}
                >
                  <span>{f.icon}</span>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Apply */}
          <button className="map-filter__apply">Apply Filters</button>
        </aside>

        {/* ── Map ── */}
        <div className="map-page__map-wrap">

          {/* View List toggle */}
          <button
            className="map-page__list-btn"
            onClick={() => setShowList(!showList)}
          >
            <FiList size={15} />
            {showList ? "Hide List" : "View List"}
          </button>

          <MapContainer
            center={[22.9734, 78.6569]}
            zoom={5}
            className="map-page__map"
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />

            {flyCenter && <FlyTo center={flyCenter} />}

            {filtered.map((temple) => {
              if (!temple.coordinates) return null;
              const color = typeColors[temple.type] || typeColors.default;
              return (
                <Marker
                  key={temple.id}
                  position={[temple.coordinates.lat, temple.coordinates.lng]}
                  icon={createIcon(color)}
                  eventHandlers={{ click: () => handleSelectTemple(temple) }}
                >
                  <Popup>
                    <div className="map-popup">
                      <strong>{temple.name}</strong>
                      <p>{temple.district}, {temple.state}</p>
                      <span style={{ color: temple.deityColor }}>{temple.deity}</span>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Legend */}
          <div className="map-page__legend">
            <p className="map-page__legend-title">Temple Type</p>
            {Object.entries(typeColors).filter(([k]) => k !== "default").map(([type, color]) => (
              <div key={type} className="map-page__legend-item">
                <span className="map-page__legend-dot" style={{ background: color }} />
                <span>{type}</span>
              </div>
            ))}
          </div>

          {/* Temple List Overlay */}
          <AnimatePresence>
            {showList && (
              <motion.div
                className="map-page__list-overlay"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3 }}
              >
                <div className="map-page__list-header">
                  <h4>All Temples ({filtered.length})</h4>
                  <button onClick={() => setShowList(false)}><FiX size={16} /></button>
                </div>
                <div className="map-page__list-items">
                  {filtered.map((temple) => (
                    <div
                      key={temple.id}
                      className={`map-page__list-item ${selectedTemple?.id === temple.id ? "active" : ""}`}
                      onClick={() => { handleSelectTemple(temple); setShowList(false); }}
                    >
                      <div className="list-item__dot" style={{ background: typeColors[temple.type] || typeColors.default }} />
                      <div>
                        <p className="list-item__name">{temple.name}</p>
                        <p className="list-item__loc">{temple.district}</p>
                      </div>
                      <span className="list-item__rating">⭐ {temple.rating}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right Sidebar ── */}
        <aside className="map-sidebar">

          {/* Selected Temple */}
          {selectedTemple && (
            <div className="map-sidebar__selected">
              <p className="map-sidebar__section-title">Selected Temple</p>

              <div className="map-sidebar__temple-img">
                <img
                  src={selectedTemple.images?.[0] || "/images/placeholder-temple.jpg"}
                  alt={selectedTemple.name}
                  onError={(e) => { e.target.src = "/images/placeholder-temple.jpg"; }}
                />
                <button className="map-sidebar__bookmark"><FiBookmark size={15} /></button>
              </div>

              <h3 className="map-sidebar__temple-name">{selectedTemple.name}</h3>

              <p className="map-sidebar__temple-loc">
                <FiMapPin size={13} />
                {selectedTemple.district}, {selectedTemple.state}
              </p>

              <span
                className="map-sidebar__deity-tag"
                style={{
                  background: `${selectedTemple.deityColor}18`,
                  color: selectedTemple.deityColor
                }}
              >
                {selectedTemple.type}
              </span>

              <p className="map-sidebar__temple-desc">
                {selectedTemple.description?.slice(0, 120)}...
              </p>

              <div className="map-sidebar__temple-meta">
                <div className="meta-item">
                  <span className="meta-item__icon">⭐</span>
                  <span className="meta-item__label">Rating</span>
                  <span className="meta-item__val">{selectedTemple.rating}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-item__icon">🕐</span>
                  <span className="meta-item__label">Opens</span>
                  <span className="meta-item__val">
                    {selectedTemple.timings?.morning?.split(" - ")[0] || "5:00 AM"}
                  </span>
                </div>
              </div>

              <div className="map-sidebar__btns">
                <Link
                  to={`/temples/${selectedTemple.slug}`}
                  className="map-sidebar__details-btn"
                >
                  View Details
                </Link>
                <a
                  href={`https://maps.google.com/?q=${selectedTemple.name} ${selectedTemple.district}`}
                  target="_blank"
                  rel="noreferrer"
                  className="map-sidebar__directions-btn"
                >
                  <FiNavigation size={14} />
                  Get Directions
                </a>
              </div>
            </div>
          )}

          {/* Nearby Temples */}
          <div className="map-sidebar__nearby">
            <div className="map-sidebar__nearby-header">
              <p className="map-sidebar__section-title">Nearby Temples</p>
              <button className="map-sidebar__view-all">View All</button>
            </div>
            <div className="map-sidebar__nearby-list">
              {nearbyTemples.map((t, i) => (
                <div key={i} className="map-sidebar__nearby-item">
                  <div className="nearby-item__img">
                    <img src="/images/hero-temples.jpeg" alt={t.name}
                      onError={(e) => { e.target.src = "/images/placeholder-temple.jpg"; }} />
                  </div>
                  <div className="nearby-item__info">
                    <p className="nearby-item__name">{t.name}</p>
                    <p className="nearby-item__dist">
                      <FiMapPin size={11} /> {t.dist}
                    </p>
                  </div>
                  <FiChevronRight size={15} className="nearby-item__arrow" />
                </div>
              ))}
            </div>
          </div>

        </aside>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              className="map-page__filter-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
            />
            <motion.div
              className="map-page__filter-drawer"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="map-page__drawer-header">
                <h3>Filters</h3>
                <button onClick={() => setFilterOpen(false)}><FiX size={20} /></button>
              </div>
              <div className="map-page__drawer-body">
                {/* Search */}
                <div className="map-filter__section">
                  <p className="map-filter__label">Search Temple</p>
                  <div className="map-filter__search">
                    <input type="text" placeholder="Search temple name..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    <FiSearch size={14} />
                  </div>
                </div>
                <div className="map-filter__section">
                  <p className="map-filter__label">Select State</p>
                  <Dropdown value={selState} options={stateOptions} open={stateOpen} setOpen={setStateOpen} onSelect={setSelState} />
                </div>
                <div className="map-filter__section">
                  <p className="map-filter__label">Select District</p>
                  <Dropdown value={selDistrict} options={districtOptions} open={districtOpen} setOpen={setDistrictOpen} onSelect={setSelDistrict} />
                </div>
                <div className="map-filter__section">
                  <p className="map-filter__label">Temple Type</p>
                  <Dropdown value={selType} options={typeOptions} open={typeOpen} setOpen={setTypeOpen} onSelect={setSelType} />
                </div>
                <div className="map-filter__section">
                  <p className="map-filter__label">Deity</p>
                  <Dropdown value={selDeity} options={deityOptions} open={deityOpen} setOpen={setDeityOpen} onSelect={setSelDeity} />
                </div>
                <div className="map-filter__section">
                  <p className="map-filter__label">Popular Filters</p>
                  <div className="map-filter__popular">
                    {popularFilters.map((f) => (
                      <button key={f.label} className={`map-filter__popular-btn ${activeFilters.includes(f.label) ? "active" : ""}`}
                        style={{ "--accent": f.color }} onClick={() => togglePopularFilter(f.label)}>
                        <span>{f.icon}</span>{f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="map-page__drawer-footer">
                <button className="map-page__drawer-apply" onClick={() => setFilterOpen(false)}>
                  Apply Filters ({filtered.length} temples)
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}