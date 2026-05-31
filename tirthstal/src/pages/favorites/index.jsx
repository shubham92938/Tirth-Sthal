import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHeart, FiGrid, FiList, FiSearch, FiTrash2,
  FiHome, FiChevronRight, FiMapPin, FiStar, FiX
} from "react-icons/fi";
import { useFavorites } from "../../context/FavoritesContext";
import "../../styles/pages/favorites.css";

const sortOptions = ["Recently Added", "Name A-Z", "Rating", "By Deity"];

export default function Favorites() {
  const { favorites, removeFavorite, clearAll, isFavorite } = useFavorites();
  const [view,        setView]        = useState("grid");
  const [search,      setSearch]      = useState("");
  const [sortBy,      setSortBy]      = useState("Recently Added");
  const [showConfirm, setShowConfirm] = useState(false);

  const filtered = favorites
    .filter((f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.location?.toLowerCase().includes(search.toLowerCase()) ||
      f.deity?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "Name A-Z") return a.name.localeCompare(b.name);
      if (sortBy === "Rating")   return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  const handleClearAll = () => {
    clearAll();
    setShowConfirm(false);
  };

  if (favorites.length === 0) {
    return (
      <div className="fav-page">
        <div className="fav-page__breadcrumb">
          <Link to="/"><FiHome size={13} /> Home</Link>
          <FiChevronRight size={13} />
          <span>My Favorites</span>
        </div>
        <div className="fav-empty">
          <motion.div
            className="fav-empty__icon"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            🤍
          </motion.div>
          <h2 className="fav-empty__title">No Favorites Yet</h2>
          <p className="fav-empty__sub">
            Start exploring temples and tap the heart icon to save your favorites here.
          </p>
          <Link to="/temples" className="fav-empty__btn">
            <FiHeart size={15} /> Explore Temples
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fav-page">

      {/* Breadcrumb */}
      <div className="fav-page__breadcrumb">
        <Link to="/"><FiHome size={13} /> Home</Link>
        <FiChevronRight size={13} />
        <span>My Favorites</span>
      </div>

      {/* Header */}
      <div className="fav-page__header">
        <div>
          <h1 className="fav-page__title">
            My Favorites <span className="fav-page__count">{favorites.length}</span>
          </h1>
          <p className="fav-page__sub">Your saved temples and sacred places</p>
        </div>
        <button
          className="fav-page__clear-btn"
          onClick={() => setShowConfirm(true)}
        >
          <FiTrash2 size={14} /> Clear All
        </button>
      </div>

      {/* Stats Bar */}
      <div className="fav-stats">
        <div className="fav-stat">
          <span className="fav-stat__num">{favorites.length}</span>
          <span className="fav-stat__label">Saved Places</span>
        </div>
        <div className="fav-stat__div" />
        <div className="fav-stat">
          <span className="fav-stat__num">
            {[...new Set(favorites.map((f) => f.deity?.split(" ").pop()))].length}
          </span>
          <span className="fav-stat__label">Deities</span>
        </div>
        <div className="fav-stat__div" />
        <div className="fav-stat">
          <span className="fav-stat__num">
            {[...new Set(favorites.map((f) => f.location?.split(",")[1]?.trim()))].filter(Boolean).length}
          </span>
          <span className="fav-stat__label">States</span>
        </div>
        <div className="fav-stat__div" />
        <div className="fav-stat">
          <span className="fav-stat__num">
            {favorites.filter((f) => f.rating >= 4.5).length}
          </span>
          <span className="fav-stat__label">Top Rated</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="fav-toolbar">
        <div className="fav-toolbar__search">
          <FiSearch size={15} />
          <input
            type="text"
            placeholder="Search your favorites..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <FiX size={14} />
            </button>
          )}
        </div>

        <div className="fav-toolbar__right">
          <select
            className="fav-toolbar__sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <div className="fav-toolbar__view">
            <button
              className={view === "grid" ? "active" : ""}
              onClick={() => setView("grid")}
            >
              <FiGrid size={16} />
            </button>
            <button
              className={view === "list" ? "active" : ""}
              onClick={() => setView("list")}
            >
              <FiList size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* No Results */}
      {filtered.length === 0 && search && (
        <div className="fav-no-results">
          <p>No favorites found for "<strong>{search}</strong>"</p>
          <button onClick={() => setSearch("")}>Clear Search</button>
        </div>
      )}

      {/* Grid View */}
      {view === "grid" && (
        <motion.div className="fav-grid" layout>
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                className="fav-card"
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                whileHover={{ y: -4 }}
              >
                <div className="fav-card__img-wrap">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => { e.target.src = "/images/placeholder-temple.jpg"; }}
                  />
                  <button
                    className="fav-card__remove"
                    onClick={() => removeFavorite(item.id)}
                    title="Remove from favorites"
                  >
                    <FiX size={13} />
                  </button>
                  <span
                    className="fav-card__deity"
                    style={{ background: `${item.deityColor}22`, color: item.deityColor }}
                  >
                    {item.deity?.replace("Lord ", "").replace("Goddess ", "")}
                  </span>
                </div>

                <Link to={`/temples/${item.slug}`} className="fav-card__info">
                  <h3 className="fav-card__name">{item.name}</h3>
                  <div className="fav-card__location">
                    <FiMapPin size={12} />
                    <span>{item.location}</span>
                  </div>
                  {item.rating && (
                    <div className="fav-card__rating">
                      <FiStar size={12} className="fav-card__star" />
                      <span>{item.rating}</span>
                    </div>
                  )}
                </Link>

                <div className="fav-card__actions">
                  <Link to={`/temples/${item.slug}`} className="fav-card__view-btn">
                    View Details
                  </Link>
                  <button
                    className="fav-card__fav-btn"
                    onClick={() => removeFavorite(item.id)}
                  >
                    <FiHeart size={14} /> Saved
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="fav-list">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                className="fav-list-item"
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="fav-list-item__img"
                  onError={(e) => { e.target.src = "/images/placeholder-temple.jpg"; }}
                />
                <div className="fav-list-item__info">
                  <div className="fav-list-item__top">
                    <h3 className="fav-list-item__name">{item.name}</h3>
                    <span
                      className="fav-list-item__deity"
                      style={{ background: `${item.deityColor}22`, color: item.deityColor }}
                    >
                      {item.deity?.replace("Lord ", "").replace("Goddess ", "")}
                    </span>
                  </div>
                  <div className="fav-list-item__meta">
                    <span><FiMapPin size={12} /> {item.location}</span>
                    {item.rating && (
                      <span><FiStar size={12} className="fav-card__star" /> {item.rating}</span>
                    )}
                  </div>
                </div>
                <div className="fav-list-item__actions">
                  <Link to={`/temples/${item.slug}`} className="fav-list-item__view">
                    View
                  </Link>
                  <button
                    className="fav-list-item__remove"
                    onClick={() => removeFavorite(item.id)}
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Clear All Confirm Modal */}
      <AnimatePresence>
        {showConfirm && (
          <>
            <motion.div
              className="fav-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
            />
            <motion.div
              className="fav-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="fav-modal__icon">🗑️</div>
              <h3 className="fav-modal__title">Clear All Favorites?</h3>
              <p className="fav-modal__sub">
                This will remove all {favorites.length} saved temples. This action cannot be undone.
              </p>
              <div className="fav-modal__btns">
                <button
                  className="fav-modal__cancel"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="fav-modal__confirm"
                  onClick={handleClearAll}
                >
                  <FiTrash2 size={14} /> Yes, Clear All
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}