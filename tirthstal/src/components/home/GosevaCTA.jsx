import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { gaushalas } from "../../data/gaushalas";
import "../../styles/home/gosevaCTA.css";

const sevaPoints = [
  { icon: "🌾", label: "Chara Seva" },
  { icon: "🐄", label: "Adopt a Cow" },
  { icon: "💉", label: "Medical Seva" },
  { icon: "🙋", label: "Volunteer" },
];

export default function GosevaCTA() {
  const totalCows = gaushalas.reduce((sum, g) => sum + (g.cowsCount || 0), 0);

  return (
    <section className="goseva-cta">
      <motion.div
        className="goseva-cta__banner"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        <img
          src="/images/goseva/gaushala-3.jpg"
          alt="Cows returning at dusk — godhuli"
          className="goseva-cta__bg"
          loading="lazy"
          onError={(e) => { e.target.src = "/images/placeholder-temple.jpg"; }}
        />
        <div className="goseva-cta__overlay" />

        <div className="goseva-cta__content">
          <span className="goseva-cta__badge">🐄 New · Goseva</span>
          <h2 className="goseva-cta__title">
            Serve Gau Mata, Earn Punya <span>गौसेवा</span>
          </h2>
          <p className="goseva-cta__sub">
            {gaushalas.length} gaushalas near sacred temples are sheltering{" "}
            {totalCows.toLocaleString("en-IN")}+ cows. Offer fodder, adopt a
            cow, support medical care or volunteer your time.
          </p>

          <div className="goseva-cta__points">
            {sevaPoints.map((p) => (
              <span key={p.label} className="goseva-cta__point">
                {p.icon} {p.label}
              </span>
            ))}
          </div>

          <Link to="/goseva" className="goseva-cta__btn">
            🙏 Start Your Seva <FiArrowRight size={15} />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
