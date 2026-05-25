import { useState } from "react";
import { FiSearch, FiChevronDown, FiRefreshCw } from "react-icons/fi";
import "../../styles/temple/templeFilters.css";

const deityFilters = [
  { name: "Shiva",   count: 1200 },
  { name: "Vishnu",  count: 980  },
  { name: "Devi",    count: 1106 },
  { name: "Ganesh",  count: 742  },
  { name: "Hanuman", count: 640  },
];

const districtOptions = [
  "All Districts", "Ujjain", "Indore", "Bhopal",
  "Khajuraho", "Orchha", "Amarkantak",
  "Omkareshwar", "Chitrakoot", "Maihar", "Datia",
];

const sortOptions = [
  "Popularity", "Name A-Z", "Name Z-A", "Rating", "Most Visited",
];

export default function TempleFilters({ onFilterChange }) {
  const [search,           setSearch]           = useState("");
  const [selectedDeities,  setSelectedDeities]  = useState([]);
  const [showMoreDeities,  setShowMoreDeities]  = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [districtOpen,     setDistrictOpen]     = useState(false);
  const [selectedSort,     setSelectedSort]     = useState("Popularity");
  const [sortOpen,         setSortOpen]         = useState(false);

  const toggleDeity = (name) => {
    const updated = selectedDeities.includes(name)
      ? selectedDeities.filter((d) => d !== name)
      : [...selectedDeities, name];
    setSelectedDeities(updated);
    onFilterChange?.({ search, deities: updated, district: selectedDistrict, sort: selectedSort });
  };

  const handleSearch = (val) => {
    setSearch(val);
    onFilterChange?.({ search: val, deities: selectedDeities, district: selectedDistrict, sort: selectedSort });
  };

  const handleDistrict = (val) => {
    setSelectedDistrict(val);
    setDistrictOpen(false);
    onFilterChange?.({ search, deities: selectedDeities, district: val, sort: selectedSort });
  };

  const handleSort = (val) => {
    setSelectedSort(val);
    setSortOpen(false);
    onFilterChange?.({ search, deities: selectedDeities, district: selectedDistrict, sort: val });
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedDeities([]);
    setSelectedDistrict("All Districts");
    setSelectedSort("Popularity");
    onFilterChange?.({ search: "", deities: [], district: "All Districts", sort: "Popularity" });
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

        {/* More / Less toggle */}
        <button
          className="tfilter__more-btn"
          onClick={() => setShowMoreDeities(!showMoreDeities)}
        >
          {showMoreDeities ? "Less ▲" : "More ▼"}
        </button>
      </div>

      {/* ── District ── */}
      <div className="tfilter__section">
        <p className="tfilter__label">District</p>
        <div
          className="tfilter__dropdown"
          onClick={() => setDistrictOpen(!districtOpen)}
        >
          <span>{selectedDistrict}</span>
          <FiChevronDown
            size={14}
            className={`tfilter__dropdown-arrow ${districtOpen ? "open" : ""}`}
          />
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
        <div
          className="tfilter__dropdown"
          onClick={() => setSortOpen(!sortOpen)}
        >
          <span>{selectedSort}</span>
          <FiChevronDown
            size={14}
            className={`tfilter__dropdown-arrow ${sortOpen ? "open" : ""}`}
          />
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