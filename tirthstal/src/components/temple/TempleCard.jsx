import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMapPin, FiHeart, FiStar } from "react-icons/fi";
import { useFavorites } from "../../context/FavoritesContext";
import "../../styles/temple/templeCard.css";

export default function TempleCard({ temple, index }) {

  const { isFavorite, toggleFavorite } = useFavorites();

  const handleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({
      id:         temple.id,
      name:       temple.name,
      image:      temple.images?.[0] || "/images/placeholder-temple.jpg",
      location:   `${temple.district}, ${temple.state}`,
      deity:      temple.deity,
      deityColor: temple.deityColor,
      rating:     temple.rating,
      slug:       temple.slug,
      type:       "temple",
    });
  };

  return (
    <motion.div
      className="tcard"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -5 }}
    >
      <div className="tcard__img-wrap">
        <img
          src={temple.images?.[0] || "/images/placeholder-temple.jpg"}
          alt={temple.name}
          className="tcard__img"
          onError={(e) => { e.target.src = "/images/placeholder-temple.jpg"; }}
        />

        <button
          className={`tcard__fav ${isFavorite(temple.id) ? "active" : ""}`}
          onClick={handleFav}
        >
          <FiHeart size={14} />
        </button>

        {temple.type && (
          <span className="tcard__type">{temple.type}</span>
        )}
      </div>

      <Link to={`/temples/${temple.slug}`} className="tcard__info">
        <h3 className="tcard__name">{temple.name}</h3>
        <div className="tcard__location">
          <FiMapPin size={12} />
          <span>{temple.district}, {temple.state}</span>
        </div>
        <div className="tcard__bottom">
          <div className="tcard__rating">
            <FiStar size={12} className="tcard__star" />
            <span>{temple.rating}</span>
            <span className="tcard__reviews">({temple.reviews?.toLocaleString()})</span>
          </div>
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