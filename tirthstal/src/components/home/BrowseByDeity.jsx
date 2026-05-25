import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import "../../styles/home/browseByDeity.css";

const deities = [
  { name: "Shiva",    icon: "🔱" },
  { name: "Vishnu",   icon: "🪷" },
  { name: "Devi",     icon: "🌸" },
  { name: "Ganesh",   icon: "🐘" },
  { name: "Hanuman",  icon: "🙏" },
  { name: "Sai Baba", icon: "✨" },
  { name: "Surya",    icon: "☀️" },
  { name: "More",     icon: "⊕" },
];

export default function BrowseByDeity() {
  return (
    <section className="deity">

      {/* ── Header ── */}
      <div className="deity__header">
        <h2 className="deity__title">Browse by Deity</h2>
        <button className="deity__view-all">
          View All <FiArrowRight size={15} />
        </button>
      </div>

      {/* ── Cards ── */}
      <div className="deity__grid">
        {deities.map((deity, i) => (
          <motion.div
            key={deity.name}
            className="deity__card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            whileHover={{ y: -4 }}
          >
            <div className="deity__icon-wrap">
              <span className="deity__icon">{deity.icon}</span>
            </div>
            <span className="deity__name">{deity.name}</span>
          </motion.div>
        ))}
      </div>

    </section>
  );
}