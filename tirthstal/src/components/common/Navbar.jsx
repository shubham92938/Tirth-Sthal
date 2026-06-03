import { useState, useRef, useEffect } from "react";
import { Link, useLocation }           from "react-router-dom";
import { motion, AnimatePresence }     from "framer-motion";
import { FiHeart, FiGlobe, FiChevronDown,
         FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import { useAuth }                     from "../../context/AuthContext";
import "../../styles/common/navbar.css";

const navLinks = [
  { label: "Home",       path: "/"          },
  { label: "Temples",    path: "/temples"   },
  { label: "Districts",  path: "/districts" },
  { label: "Festivals",  path: "/festivals" },
  { label: "Temple Map", path: "/map"       },
  { label: "Blog",       path: "/blog"      },
  { label: "About Us",   path: "/about"     },
  { label: "Contact",    path: "/contact"   },
];

const languages = [
  { code: "en", label: "English"  },
  { code: "hi", label: "हिंदी"    },
  { code: "mr", label: "मराठी"    },
  { code: "gu", label: "ગુજરાતી"  },
];

export default function Navbar() {
  const { pathname }              = useLocation();
  const { user, isLoggedIn, logout } = useAuth();

  const [langOpen,    setLangOpen]    = useState(false);
  const [activeLang,  setActiveLang]  = useState("English");
  const [userMenuOpen,setUserMenuOpen]= useState(false);
  const userMenuRef                   = useRef(null);

  // Click outside pe user menu band karo
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(true);
  };


  const loginDetails = JSON.parse(
  localStorage.getItem("tirthstal_user")
);

 

  const userInitial = user?.name?.charAt(0).toUpperCase() || "U";

  
  return (
    <motion.nav
      className="navbar"
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {/* ── Logo ── */}
      <Link to="/" className="navbar__logo">
        <div className="navbar__logo-icon">🛕</div>
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
          <FiChevronDown size={14} />
          <AnimatePresence>
            {langOpen && (
              <motion.ul
                className="navbar__lang-dropdown"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{    opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
              >
                {languages.map((lang) => (
                  <li
                    key={lang.code}
                    className={activeLang === lang.label ? "selected" : ""}
                    onClick={() => { setActiveLang(lang.label); setLangOpen(false); }}
                  >
                    {lang.label}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* ── User Section ── */}
        {isLoggedIn ? (

          // ✅ Logged in — User details dikhao
          <div className="navbar__user" ref={userMenuRef}>
            <div
              className="navbar__user-trigger"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              {/* Avatar */}
              <div className="navbar__user-avatar">
                {user?.name
                  ? <img src="./images/AuthorImage.jpg" alt={user.name} />
                  : <span>{userInitial}</span>
                }
              </div>
              <div className="navbar__user-info">
                <span className="navbar__user-name">{loginDetails.name?.split(" ")[0]}</span>
                {/* <span className="navbar__user-email">{user?.email}</span> */}
              </div>
              <FiChevronDown
                size={14}
                className={`navbar__user-arrow ${userMenuOpen ? "open" : ""}`}
              />
            </div>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  className="navbar__user-dropdown"
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1   }}
                  exit={{    opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* User Info Header */}
                  <div className="navbar__user-dropdown-header">
                    <div className="navbar__user-dropdown-avatar">
                      {userInitial}
                    </div>
                    <div>
                      <p className="navbar__user-dropdown-name">{user?.name}</p>
                      <p className="navbar__user-dropdown-email">{user?.email}</p>
                    </div>
                  </div>

                  <div className="navbar__user-dropdown-divider" />

                  {/* Menu Items */}
                  <Link
                    to="/favorites"
                    className="navbar__user-dropdown-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <FiHeart size={15} />
                    My Favorites
                  </Link>

                  <Link
                    to="/profile"
                    className="navbar__user-dropdown-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <FiUser size={15} />
                    My Profile
                  </Link>

                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="navbar__user-dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FiSettings size={15} />
                      Admin Panel
                    </Link>
                  )}

                  <div className="navbar__user-dropdown-divider" />

                  <button
                    className="navbar__user-dropdown-logout"
                    onClick={handleLogout}
                  >
                    <FiLogOut size={15} />
                    Logout
                  </button>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

        ) : (

          // ✅ Not logged in — Login button dikhao
          <Link to="/auth/login" className="navbar__login-btn">
            Login
          </Link>

        )}

        {/* Favorites */}
        <Link to="/favorites" className="navbar__fav-btn">
          <FiHeart size={15} />
          <span>My Favorites</span>
        </Link>

      </div>
    </motion.nav>
  );
}