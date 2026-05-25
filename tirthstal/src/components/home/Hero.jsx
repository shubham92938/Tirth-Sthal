import { motion } from "framer-motion";
import { FiSearch, FiMapPin, FiChevronDown, FiArrowRight } from "react-icons/fi";
import { useState } from "react";
import "../../styles/home/hero.css";

const popularSearches = ["Shiva Temples", "Vishnu Temples", "Devi Temples", "Jyotirlingas", "Sai Temples"];

const states = [
  "Madhya Pradesh", "Maharashtra", "Rajasthan", "Gujarat",
  "Uttar Pradesh", "Tamil Nadu", "Karnataka", "Andhra Pradesh",
];

export default function Hero() {
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [stateOpen, setStateOpen]         = useState(false);
  const [searchQuery, setSearchQuery]     = useState("");

  return (
    <section className="hero">

      {/* ── Background Image ── */}
      <img src="/images/hero-temples.jpeg" alt="Temple" className="hero__bg" />

      {/* ── Gradient Overlay ── */}
      <div className="hero__overlay" />

      {/* ── Content ── */}
      <div className="hero__content">

        {/* Badge */}
        <motion.div
          className="hero__badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span>🛕</span>
          <span>Explore Divine India</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="hero__heading"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          All Temples. <br />
          <span className="hero__heading-orange">One State.</span> One Sacred Journey.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="hero__sub"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Discover, explore and connect with the divine. <br />
          Find all temples across the state in one place.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          className="hero__search"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* State Selector */}
          <div className="hero__state" onClick={() => setStateOpen(!stateOpen)}>
            <FiMapPin size={15} className="hero__state-icon" />
            <div className="hero__state-text">
              <span className="hero__state-label">Select State</span>
              <span className="hero__state-value">{selectedState}</span>
            </div>
            <FiChevronDown size={14} className="hero__state-arrow" />

            {stateOpen && (
              <motion.ul
                className="hero__state-dropdown"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
              >
                {states.map((s) => (
                  <li
                    key={s}
                    className={s === selectedState ? "selected" : ""}
                    onClick={(e) => { e.stopPropagation(); setSelectedState(s); setStateOpen(false); }}
                  >
                    {s}
                  </li>
                ))}
              </motion.ul>
            )}
          </div>

          <div className="hero__search-divider" />

          {/* Search Input */}
          <div className="hero__search-input-wrap">
            <FiSearch size={15} className="hero__search-icon" />
            <input
              className="hero__search-input"
              type="text"
              placeholder="Search temples, deities, places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Search Button */}
          <button className="hero__search-btn">
            Search <FiArrowRight size={14} />
          </button>
        </motion.div>

        {/* Popular Searches */}
        <motion.div
          className="hero__popular"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <span className="hero__popular-label">Popular Searches:</span>
          <div className="hero__popular-tags">
            {popularSearches.map((tag) => (
              <button key={tag} className="hero__popular-tag">{tag}</button>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}