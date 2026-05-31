import { motion } from "framer-motion";
import { FiSearch, FiMapPin, FiChevronDown, FiArrowRight } from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { templesData } from "../../data/temple";
import "../../styles/home/hero.css";
import SearchBar from "../common/SearchBar";
import { useTranslation } from "react-i18next";

const popularSearches = [
  "Shiva Temples", "Vishnu Temples",
  "Devi Temples", "Jyotirlingas", "Sai Temples",
];

export default function Hero() {
  const navigate = useNavigate();
  const {
    searchQuery,   setSearchQuery,
    selectedState, setSelectedState,
    setSearchResults, setHasSearched,
  } = useSearch();
  const {t} = useTranslation();

  const [stateOpen, setStateOpen] = useState(false);

  // Get all states from data
  const states = ["All States", ...Object.keys(templesData)];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    // Get temples based on selected state
    let templeList = [];
    if (selectedState === "All States") {
      templeList = Object.values(templesData).flatMap((s) =>
        Object.values(s).flat()
      );
    } else {
      const stateData = templesData[selectedState] || {};
      templeList = Object.values(stateData).flat();
    }

    // Filter by search query
    const q = searchQuery.toLowerCase();
    const results = templeList.filter((t) =>
      t.name.toLowerCase().includes(q)     ||
      t.deity.toLowerCase().includes(q)    ||
      t.district.toLowerCase().includes(q) ||
      t.type.toLowerCase().includes(q)     ||
      t.description.toLowerCase().includes(q)
    );

    setSearchResults(results);
    setHasSearched(true);

    // Navigate to temples page with search
    navigate(`/temples?search=${encodeURIComponent(searchQuery)}&state=${encodeURIComponent(selectedState)}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handlePopularSearch = (tag) => {
    setSearchQuery(tag);

    // Filter temples
    let templeList = Object.values(templesData).flatMap((s) =>
      Object.values(s).flat()
    );
    const q = tag.toLowerCase();
    const results = templeList.filter((t) =>
      t.name.toLowerCase().includes(q)  ||
      t.deity.toLowerCase().includes(q) ||
      t.type.toLowerCase().includes(q)
    );
    setSearchResults(results);
    setHasSearched(true);

    navigate(`/temples?search=${encodeURIComponent(tag)}&state=All States`);
  };

  return (
    <section className="hero">
      <img
        src="https://png.pngtree.com/thumb_back/fh260/background/20251027/pngtree-ornate-hindu-temple-complex-in-golden-sunset-light-image_20057957.webp"
        alt="Temple"
        className="hero__bg"
        onError={(e) => e.target.src = "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200"}
      />
      <div className="hero__overlay" />

      <div className="hero__content">

        {/* Badge */}
        <motion.div 
          className="hero__badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span>🛕</span>
          <span>{t("hero.badge")}</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="hero__heading"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t("hero.heading1")} <br />
          <span className="hero__heading-orange">{t("hero.heading2")}</span> {t("hero.heading3")}
        </motion.h1>
         

        {/* Sub */}
        <motion.p
          className="hero__sub"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t("hero.sub1")} <br />
        {t("hero.sub2")}
        </motion.p>

       <SearchBar placeholder= {t("hero.searchBtn")} />

        {/* Popular Searches */}
        <motion.div
          className="hero__popular"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <span className="hero__popular-label">{t("hero.popular")}</span>
          <div className="hero__popular-tags">
            {popularSearches.map((tag) => (
              <button
                key={tag}
                className="hero__popular-tag"
                onClick={() => handlePopularSearch(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}