import { useState, useMemo } from "react";
import { FiSearch, FiChevronDown, FiRefreshCw } from "react-icons/fi";
import { templesData } from "../../data/temple";
import "../../styles/temple/templeFilters.css";
import { useSearchParams } from "react-router-dom";
const deityFilters = [
  { name: "Shiva",   count: 1200 },
  { name: "Vishnu",  count: 980  },
  { name: "Devi",    count: 1106 },
  { name: "Ganesh",  count: 742  },
  { name: "Hanuman", count: 640  },
];

const stateOptions = ["All States", ...Object.keys(templesData)];

const sortOptions = [
  "Popularity", "Name A-Z", "Name Z-A", "Rating", "Most Visited",
];

export default function TempleFilters({ onFilterChange }) {
  const [search,           setSearch]           = useState("");
  const [selectedState,    setSelectedState]    = useState("All States");
  const [stateOpen,        setStateOpen]        = useState(false);
  const [selectedDeities,  setSelectedDeities]  = useState([]);
  const [showMoreDeities,  setShowMoreDeities]  = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [districtOpen,     setDistrictOpen]     = useState(false);
  const [selectedSort,     setSelectedSort]     = useState("Popularity");
  const [sortOpen,         setSortOpen]         = useState(false);

  // ✅ Dynamic district options based on selected state
  const districtOptions = useMemo(() => {
    if (selectedState === "All States") {
      const all = new Set();
      Object.values(templesData).forEach((stateData) => {
        Object.keys(stateData).forEach((d) => all.add(d));
      });
      return ["All Districts", ...all];
    }
    const stateData = templesData[selectedState] || {};
    return ["All Districts", ...Object.keys(stateData)];
  }, [selectedState]);

  const toggleDeity = (name) => {
    const updated = selectedDeities.includes(name)
      ? selectedDeities.filter((d) => d !== name)
      : [...selectedDeities, name];
    setSelectedDeities(updated);
    onFilterChange?.({ search, deities: updated, state: selectedState, district: selectedDistrict, sort: selectedSort });
  };

  const handleSearch = (val) => {
    setSearch(val);
    onFilterChange?.({ search: val, deities: selectedDeities, state: selectedState, district: selectedDistrict, sort: selectedSort });
  };

  const handleState = (val) => {
    setSelectedState(val);
    setStateOpen(false);
    setSelectedDistrict("All Districts"); // ✅ reset district
    onFilterChange?.({ search, deities: selectedDeities, state: val, district: "All Districts", sort: selectedSort });
  };

  const handleDistrict = (val) => {
    setSelectedDistrict(val);
    setDistrictOpen(false);
    onFilterChange?.({ search, deities: selectedDeities, state: selectedState, district: val, sort: selectedSort });
  };

  const handleSort = (val) => {
    setSelectedSort(val);
    setSortOpen(false);
    onFilterChange?.({ search, deities: selectedDeities, state: selectedState, district: selectedDistrict, sort: val });
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedDeities([]);
    setSelectedState("All States");
    setSelectedDistrict("All Districts");
    setSelectedSort("Popularity");
    onFilterChange?.({ search: "", deities: [], state: "All States", district: "All Districts", sort: "Popularity" });
  };

  const visibleDeities = showMoreDeities ? deityFilters : deityFilters.slice(0, 5);

  return (
    <aside className="tfilter">

      <h3 className="tfilter__title">Filters</h3>

      {/* ── Search ── */}
      <div className="tfilter__section">
        <p className="tfilter__label">Search Temples</p>
        <div className="tfilter__search">
          <input
            type="text"
            placeholder="Search by name, deity, place..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="tfilter__search-input"
          />
          <FiSearch size={15} className="tfilter__search-icon" />
        </div>
      </div>

      {/* ── Deity ── */}
      <div className="tfilter__section">
        <p className="tfilter__label">Deity</p>
        <div className="tfilter__deity-list">
          {visibleDeities.map((deity) => (
            <label key={deity.name} className="tfilter__check-row">
              <input
                type="checkbox"
                className="tfilter__checkbox"
                checked={selectedDeities.includes(deity.name)}
                onChange={() => toggleDeity(deity.name)}
              />
              <span className="tfilter__check-name">{deity.name}</span>
              <span className="tfilter__check-count">({deity.count.toLocaleString()})</span>
            </label>
          ))}
        </div>
        <button
          className="tfilter__more-btn"
          onClick={() => setShowMoreDeities(!showMoreDeities)}
        >
          {showMoreDeities ? "Less ▲" : "More ▼"}
        </button>
      </div>

      {/* ── State ── */}
      <div className="tfilter__section">
        <p className="tfilter__label">State</p>
        <div className="tfilter__dropdown" onClick={() => setStateOpen(!stateOpen)}>
          <span>{selectedState}</span>
          <FiChevronDown size={14} className={`tfilter__dropdown-arrow ${stateOpen ? "open" : ""}`} />
          {stateOpen && (
            <ul className="tfilter__dropdown-list">
              {stateOptions.map((s) => (
                <li
                  key={s}
                  className={selectedState === s ? "selected" : ""}
                  onClick={(e) => { e.stopPropagation(); handleState(s); }}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── District ── */}
      <div className="tfilter__section">
        <p className="tfilter__label">District</p>
        <div className="tfilter__dropdown" onClick={() => setDistrictOpen(!districtOpen)}>
          <span>{selectedDistrict}</span>
          <FiChevronDown size={14} className={`tfilter__dropdown-arrow ${districtOpen ? "open" : ""}`} />
          {districtOpen && (
            <ul className="tfilter__dropdown-list">
              {districtOptions.map((d) => (
                <li
                  key={d}
                  className={selectedDistrict === d ? "selected" : ""}
                  onClick={(e) => { e.stopPropagation(); handleDistrict(d); }}
                >
                  {d}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Sort By ── */}
      <div className="tfilter__section">
        <p className="tfilter__label">Sort By</p>
        <div className="tfilter__dropdown" onClick={() => setSortOpen(!sortOpen)}>
          <span>{selectedSort}</span>
          <FiChevronDown size={14} className={`tfilter__dropdown-arrow ${sortOpen ? "open" : ""}`} />
          {sortOpen && (
            <ul className="tfilter__dropdown-list">
              {sortOptions.map((s) => (
                <li
                  key={s}
                  className={selectedSort === s ? "selected" : ""}
                  onClick={(e) => { e.stopPropagation(); handleSort(s); }}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Clear Filters ── */}
      <button className="tfilter__clear" onClick={clearFilters}>
        <FiRefreshCw size={14} />
        Clear Filters
      </button>

    </aside>
  );
}