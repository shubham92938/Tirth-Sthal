import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome, FiCompass } from "react-icons/fi";
import "../styles/pages/notFound.css";

export default function NotFound() {
  return (
    <div className="notfound">
      <motion.div
        className="notfound__card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="notfound__icon">🛕</div>
        <h1 className="notfound__code">404</h1>
        <h2 className="notfound__title">This path leads nowhere… yet</h2>
        <p className="notfound__sub">
          The page you are looking for may have moved or does not exist.
          Let us guide you back to your divine journey.
        </p>
        <div className="notfound__actions">
          <Link to="/" className="notfound__btn notfound__btn--primary">
            <FiHome size={15} /> Back to Home
          </Link>
          <Link to="/temples" className="notfound__btn notfound__btn--ghost">
            <FiCompass size={15} /> Explore Temples
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
