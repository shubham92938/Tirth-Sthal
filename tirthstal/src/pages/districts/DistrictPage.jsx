import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiSearch, FiMapPin, FiHeart, FiChevronRight,
  FiHome, FiChevronDown, FiChevronLeft
} from "react-icons/fi";
import { districts } from "../../data/districts";
import { templesData } from "../../data/temple";
import "../../styles/pages/districtsPage.css";

const ITEMS_PER_PAGE = 8;

const sortOptions = ["Popularity","Name A-Z","Rating","Most Visited"];

export default function DistrictPage() {
  const { district: slug } = useParams();
  const navigate           = useNavigate();

  const [search,    setSearch]    = useState("");
  const [page,      setPage]      = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [sortOpen,  setSortOpen]  = useState(false);
  const [sortBy,    setSortBy]    = useState("Popularity");

  const currentDistrict = districts.find((d) => d.slug === slug) || districts[0];
  const stateTemples    = templesData?.[currentDistrict?.state] || {};
  const distTemples     = stateTemples?.[currentDistrict?.name] || [];

  const filteredDistricts = districts.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(distTemples.length / ITEMS_PER_PAGE);
  const paginated  = distTemples.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const toggleFav = (id) =>
    setFavorites((p) => p.includes(id) ? p.filter((f) => f !== id) : [...p, id]);

  useEffect(() => { setPage(1); }, [slug]);

  const getPaginationPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3);
      if (page > 4) pages.push("...");
      if (page > 3 && page < totalPages - 2) pages.push(page);
      if (page < totalPages - 3) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="dist-page">

      {/* ── Layout ── */}
      <div className="dist-page__layout">

        {/* ── Left Sidebar ── */}
        <aside className="dist-sidebar">
          <div className="dist-sidebar__header">
            <span className="dist-sidebar__header-icon">🛕</span>
            <h3>Districts in {currentDistrict?.state}</h3>
          </div>

          {/* Search */}
          <div className="dist-sidebar__search">
            <input
              type="text"
              placeholder="Search district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FiSearch size={15} className="dist-sidebar__search-icon" />
          </div>

          {/* District List */}
          <ul className="dist-sidebar__list">
            {filteredDistricts.map((d) => (
              <li key={d.id}>
                <Link
                  to={`/districts/${d.slug}`}
                  className={`dist-sidebar__item ${d.slug === slug ? "active" : ""}`}
                >
                  <span className="dist-sidebar__item-name">{d.name}</span>
                  <span className="dist-sidebar__item-count">{d.templeCount}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* View All */}
          <button className="dist-sidebar__view-all">
            <FiMapPin size={14} />
            View All Districts
          </button>
        </aside>

        {/* ── Main Content ── */}
        <main className="dist-main">

          {/* Breadcrumb */}
          <div className="dist-main__breadcrumb">
            <Link to="/"><FiHome size={13} /> Home</Link>
            <FiChevronRight size={13} />
            <Link to="/districts">{currentDistrict?.state}</Link>
            <FiChevronRight size={13} />
            <span>{currentDistrict?.name} District</span>
          </div>

          {/* Hero */}
 
<div className="dist-main__hero">
  <img
    // src={currentDistrict?.image || "./images/hero-temples.jpeg"}
    // alt={currentDistrict?.name}
    src="./images/hero-temples.jpeg"
    alt={currentDistrict?.name}
    className="dist-main__hero-bg"
    onError={(e) => e.target.src = "./images/hero-temples.jpeg"}
  />
  <div className="dist-main__hero-overlay" />
  <div className="dist-main__hero-content">
    <motion.h1
      className="dist-main__title"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {currentDistrict?.name} District
      <span className="dist-main__title-state">, {currentDistrict?.state}</span>
    </motion.h1>
    <motion.p
      className="dist-main__desc"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      Explore {distTemples.length} temples in {currentDistrict?.name} district.
      Discover ancient temples, spiritual places and seek blessings from the divine.
    </motion.p>

    {/* Quick Info Pills */}
    <motion.div
      className="dist-main__hero-pills"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <span className="hero-pill">🛕 {distTemples.length} Temples</span>
      <span className="hero-pill">📍 {currentDistrict?.state}</span>
      <span className="hero-pill">🗺️ {currentDistrict?.bestTimeToVisit || "Oct - Mar"}</span>
    </motion.div>
  </div>
</div>

          {/* Stats Bar */}
          <div className="dist-main__stats">
            <div className="dist-main__stats-left">
              <div className="dist-stat">
                <span className="dist-stat__icon">🛕</span>
                <div>
                  <p className="dist-stat__num">{distTemples.length}</p>
                  <p className="dist-stat__label">Total Temples</p>
                </div>
              </div>
              <div className="dist-stat__divider" />
              <div className="dist-stat">
                <span className="dist-stat__icon">🗺️</span>
                <div>
                  <p className="dist-stat__num">8</p>
                  <p className="dist-stat__label">Tehsils</p>
                </div>
              </div>
              <div className="dist-stat__divider" />
              <div className="dist-stat">
                <span className="dist-stat__icon">📍</span>
                <div>
                  <p className="dist-stat__num">1,234</p>
                  <p className="dist-stat__label">Villages Covered</p>
                </div>
              </div>
              <div className="dist-stat__divider" />
              <div className="dist-stat">
                <span className="dist-stat__icon">👥</span>
                <div>
                  <p className="dist-stat__num">58K+</p>
                  <p className="dist-stat__label">Devotees Visited</p>
                </div>
              </div>
            </div>

            {/* Sort */}
            <div className="dist-main__sort" onClick={() => setSortOpen(!sortOpen)}>
              <span>Sort by: {sortBy}</span>
              <FiChevronDown size={14} className={sortOpen ? "rotated" : ""} />
              {sortOpen && (
                <ul className="dist-main__sort-dropdown">
                  {sortOptions.map((s) => (
                    <li
                      key={s}
                      className={sortBy === s ? "selected" : ""}
                      onClick={(e) => { e.stopPropagation(); setSortBy(s); setSortOpen(false); }}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Temple Grid */}
          <div className="dist-grid">
            {paginated.map((temple, i) => (
              <motion.div
                key={temple.id}
                className="dist-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                {/* Image */}
                <div className="dist-card__img-wrap">
                  <img
                    src={temple.images?.[0] || "/images/placeholder-temple.jpg"}
                    alt={temple.name}
                    className="dist-card__img"
                    onError={(e) => { e.target.src = "/images/placeholder-temple.jpg"; }}
                  />
                  <button
                    className={`dist-card__fav ${favorites.includes(temple.id) ? "active" : ""}`}
                    onClick={() => toggleFav(temple.id)}
                  >
                    <FiHeart size={14} />
                  </button>
                </div>

                {/* Info */}
                <div className="dist-card__info">
                  <h3 className="dist-card__name">{temple.name}</h3>
                  <span
                    className="dist-card__type"
                    style={{ background: `${temple.deityColor}18`, color: temple.deityColor }}
                  >
                    {temple.type}
                  </span>
                  <div className="dist-card__location">
                    <FiMapPin size={12} />
                    <span>{temple.address}</span>
                  </div>
                  <Link
                    to={`/temples/${temple.slug}`}
                    className="dist-card__btn"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="dist-pagination">
              <button
                className="dist-pagination__arrow"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <FiChevronLeft size={16} />
              </button>

              {getPaginationPages().map((p, i) => (
                <button
                  key={i}
                  className={`dist-pagination__btn ${p === page ? "active" : ""} ${p === "..." ? "dots" : ""}`}
                  onClick={() => p !== "..." && setPage(p)}
                >
                  {p}
                </button>
              ))}

              <button
                className="dist-pagination__arrow"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}