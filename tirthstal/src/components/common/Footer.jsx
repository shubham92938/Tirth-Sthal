import { Link } from "react-router-dom";
import { FiHeart, FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook, FiTwitter, FiYoutube } from "react-icons/fi";
import { motion } from "framer-motion";
import "../../styles/common/footer.css";

const quickLinks = [
  { label: "Home",       path: "/" },
  { label: "Temples",    path: "/temples" },
  { label: "Districts",  path: "/districts" },
  { label: "Festivals",  path: "/festivals" },
  { label: "Temple Map", path: "/map" },
  { label: "Blog",       path: "/blog" },
];

const exploreLinks = [
  { label: "Shiva Temples",   path: "/temples" },
  { label: "Vishnu Temples",  path: "/temples" },
  { label: "Devi Temples",    path: "/temples" },
  { label: "Jyotirlingas",    path: "/temples" },
  { label: "Sai Temples",     path: "/temples" },
  { label: "Ganesh Temples",  path: "/temples" },
];

const socials = [
  { icon: <FiInstagram size={18} />, path: "#", label: "Instagram" },
  { icon: <FiFacebook  size={18} />, path: "#", label: "Facebook"  },
  { icon: <FiTwitter   size={18} />, path: "#", label: "Twitter"   },
  { icon: <FiYoutube   size={18} />, path: "#", label: "YouTube"   },
];

export default function Footer() {
  return (
    <footer className="footer">

      {/* ── Top Section ── */}
      <div className="footer__top">

        {/* Brand */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <img src="/icons/tirthstal.png" alt="Tirthstal" className="footer__logo-img" />
            <div>
              <p className="footer__logo-name">Tirthstal</p>
              <p className="footer__logo-sub">Sacred Temples, Divine Journey</p>
            </div>
          </Link>
          <p className="footer__desc">
            Discover and explore thousands of sacred temples across India.
            Your one-stop destination for divine journeys and spiritual experiences.
          </p>

          {/* Socials */}
          <div className="footer__socials">
            {socials.map((s) => (
              <motion.a
                key={s.label}
                href={s.path}
                className="footer__social-btn"
                aria-label={s.label}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                {s.icon}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer__col">
          <h4 className="footer__col-title">Quick Links</h4>
          <ul className="footer__links">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.path} className="footer__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Explore */}
        <div className="footer__col">
          <h4 className="footer__col-title">Explore</h4>
          <ul className="footer__links">
            {exploreLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.path} className="footer__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="footer__col">
          <h4 className="footer__col-title">Contact Us</h4>
          <ul className="footer__contact-list">
            <li>
              <FiMail size={15} className="footer__contact-icon" />
              <span>info@tirthstal.com</span>
            </li>
            <li>
              <FiPhone size={15} className="footer__contact-icon" />
              <span>+91 98765 43210</span>
            </li>
            <li>
              <FiMapPin size={15} className="footer__contact-icon" />
              <span>Indore, Madhya Pradesh, India</span>
            </li>
          </ul>

          {/* Newsletter */}
          <div className="footer__newsletter">
            <p className="footer__newsletter-label">Subscribe to our newsletter</p>
            <div className="footer__newsletter-input">
              <input type="email" placeholder="Enter your email" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>

      </div>

      {/* ── Bottom Bar ── */}
      <div className="footer__bottom">
        <p className="footer__copy">
          © 2025 Tirthstal. All rights reserved. Made with
          <FiHeart size={13} className="footer__heart" />
          for devotees.
        </p>
        <div className="footer__bottom-links">
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Terms of Service</Link>
          <Link to="#">Sitemap</Link>
        </div>
      </div>

    </footer>
  );
}