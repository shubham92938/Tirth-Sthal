import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiGlobe, FiChevronDown } from "react-icons/fi";
import "../../styles/common/navbar.css";

const navLinks = [
  { label: "Home",       path: "/" },
  { label: "Temples",    path: "/temples" },
  { label: "Districts",  path: "/districts" },
  { label: "Festivals",  path: "/festivals" },
  { label: "Temple Map", path: "/map" },
  { label: "Blog",       path: "/blog" },
  { label: "About Us",   path: "/about" },
  { label: "Contact",    path: "/contact" },
];

const languages = ["English", "हिंदी", "मराठी", "ગુજરાતી"];

export default function Navbar() {
  const { pathname } = useLocation();
  const [langOpen, setLangOpen]     = useState(false);
  const [activeLang, setActiveLang] = useState("English");

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {/* ── Logo ── */}
      <Link to="/" className="navbar__logo">
        <img src="/icons/tirthstal.png" alt="Tirthstal" className="navbar__logo-img" />
        <div>
          <p className="navbar__logo-name">Tirthstal</p>
          <p className="navbar__logo-sub">Sacred Temples, Divine Journey</p>
        </div>
      </Link>

      {/* ── Nav Links ── */}
      <ul className="navbar__links">
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`navbar__link ${pathname === link.path ? "active" : ""}`}
            >
              {link.label}
              {pathname === link.path && (
                <motion.span
                  className="navbar__underline"
                  layoutId="underline"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          </li>
        ))}
      </ul>

      {/* ── Right Side ── */}
      <div className="navbar__right">

        {/* Language Selector */}
        <div className="navbar__lang" onClick={() => setLangOpen(!langOpen)}>
          <FiGlobe size={16} />
          <span>{activeLang}</span>
          <motion.span
            animate={{ rotate: langOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <FiChevronDown size={14} />
          </motion.span>

          <AnimatePresence>
            {langOpen && (
              <motion.ul
                className="navbar__lang-dropdown"
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{    opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                {languages.map((lang) => (
                  <li
                    key={lang}
                    className={activeLang === lang ? "selected" : ""}
                    onClick={() => { setActiveLang(lang); setLangOpen(false); }}
                  >
                    {lang}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* My Favorites */}
        <Link to="/favorites" className="navbar__fav-btn">
          <FiHeart size={15} />
          <span>My Favorites</span>
        </Link>

      </div>
    </motion.nav>
  );
}