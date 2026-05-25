import { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiMapPin, FiHeart } from "react-icons/fi";
import "../../styles/home/popularTemples.css";

const temples = [
  {
    id: 1,
    name: "Trimbakeshwar Temple",
    city: "Nashik",
    deity: "Shiva",
    deityColor: "#3b82f6",
    image: "/images/trimbakeshwar.jpg",
  },
  {
    id: 2,
    name: "Shri Vitthal Rukmini Temple",
    city: "Pandharpur, Solapur",
    deity: "Vishnu",
    deityColor: "#8b5cf6",
    image: "/images/vitthal.jpg",
  },
  {
    id: 3,
    name: "Mahakaleshwar Temple",
    city: "Ujjain",
    deity: "Shiva",
    deityColor: "#3b82f6",
    image: "/images/mahakaleshwar.jpg",
  },
  {
    id: 4,
    name: "Shirdi Sai Baba Temple",
    city: "Shirdi, Ahmednagar",
    deity: "Sai Baba",
    deityColor: "#f59e0b",
    image: "/images/shrdi.jpg",
  },
  {
    id: 5,
    name: "Siddhivinayak Temple",
    city: "Mumbai",
    deity: "Ganesh",
    deityColor: "#10b981",
    image: "/images/Siddhivinayak Temple.jpg",
  },
];

export default function PopularTemples() {
  const [favorites, setFavorites] = useState([]);

  const toggleFav = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <section className="popular">

      {/* ── Header ── */}
      <div className="popular__header">
        <h2 className="popular__title">Popular Temples</h2>
        <button className="popular__view-all">
          View All Temples <FiArrowRight size={15} />
        </button>
      </div>

      {/* ── Cards ── */}
      <div className="popular__grid">
        {temples.map((temple, i) => (
          <motion.div
            key={temple.id}
            className="popular__card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            whileHover={{ y: -5 }}
          >
            {/* Image */}
            <div className="popular__img-wrap">
              <img
                src={temple.image}
                alt={temple.name}
                className="popular__img"
              />

              {/* Favorite Button */}
              <button
                className={`popular__fav ${favorites.includes(temple.id) ? "active" : ""}`}
                onClick={() => toggleFav(temple.id)}
              >
                <FiHeart size={15} />
              </button>
            </div>

            {/* Info */}
            <div className="popular__info">
              <h3 className="popular__name">{temple.name}</h3>
              <div className="popular__bottom">
                <span className="popular__city">
                  <FiMapPin size={12} />
                  {temple.city}
                </span>
                <span
                  className="popular__deity"
                  style={{ background: `${temple.deityColor}18`, color: temple.deityColor }}
                >
                  {temple.deity}
                </span>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Next Arrow */}
        <button className="popular__arrow">
          <FiArrowRight size={20} />
        </button>
      </div>

    </section>
  );
}