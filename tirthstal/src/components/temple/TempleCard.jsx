import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMapPin, FiHeart, FiStar } from "react-icons/fi";
import "../../styles/temple/templeCard.css";

export default function TempleCard({ temple, index }) {
  const [isFav, setIsFav] = useState(false);

  return (
    <motion.div
      className="tcard"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -5 }}
    >
      {/* ── Image ── */}
      <div className="tcard__img-wrap">
        <img
          src={temple.images?.[0] || "/images/placeholder-temple.jpg"}
          alt={temple.name}
          className="tcard__img"
        />

        {/* Favorite Button */}
        <button
          className={`tcard__fav ${isFav ? "active" : ""}`}
          onClick={(e) => { e.preventDefault(); setIsFav(!isFav); }}
        >
          <FiHeart size={14} />
        </button>

        {/* Type Badge */}
        {temple.type && (
          <span className="tcard__type">{temple.type}</span>
        )}
      </div>

      {/* ── Info ── */}
      <Link to={`/temples/${temple.slug}`} className="tcard__info">

        {/* Name */}
        <h3 className="tcard__name">{temple.name}</h3>

        {/* Location */}
        <div className="tcard__location">
          <FiMapPin size={12} />
          <span>{temple.city || temple.address}</span>
        </div>

        {/* Bottom Row */}
        <div className="tcard__bottom">

          {/* Rating */}
          <div className="tcard__rating">
            <FiStar size={12} className="tcard__star" />
            <span>{temple.rating}</span>
            <span className="tcard__reviews">({temple.reviews?.toLocaleString()})</span>
          </div>

          {/* Deity Badge */}
          <span
            className="tcard__deity"
            style={{
              background: `${temple.deityColor}18`,
              color: temple.deityColor
            }}
          >
            {temple.deity?.replace("Lord ", "").replace("Goddess ", "")}
          </span>

        </div>
      </Link>
    </motion.div>
  );
}