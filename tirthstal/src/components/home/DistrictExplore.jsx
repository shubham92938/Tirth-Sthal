import { motion } from "framer-motion";
import { FiArrowRight, FiMapPin } from "react-icons/fi";
import "../../styles/home/districtExplore.css";
import { districts } from "../../data/districts";
import { useState } from "react";

// const districts = [
//   { name: "Nashik",       temples: 124, image: "/images/districts/nashik.jpg" },
//   { name: "Pune",         temples: 98,  image: "/images/districts/pune.jpg" },
//   { name: "Solapur",      temples: 87,  image: "/images/districts/solapur.jpg" },
//   { name: "Aurangabad",   temples: 76,  image: "/images/districts/aurangabad.jpg" },
//   { name: "Kolhapur",     temples: 65,  image: "/images/districts/kolhapur.jpg" },
//   { name: "Nagpur",       temples: 54,  image: "/images/districts/nagpur.jpg" },
//   { name: "Satara",       temples: 48,  image: "/images/districts/satara.jpg" },
//   { name: "Raigad",       temples: 42,  image: "/images/districts/raigad.jpg" },
// ];

export default function DistrictExplore() {

const [visibleCards, setVisibleCards] = useState(8 )

const viewAll = ()=>{
  setVisibleCards((prev) = prev + 8) ;
}



  return (
    <section className="district">

      {/* ── Header ── */}
      <div className="district__header">
        <h2 className="district__title">Explore by District</h2>
        <button className="district__view-all">
          View All Districts <FiArrowRight size={15} />
        </button>
      </div>

      {/* ── Grid ── */}
      <div className="district__grid">
        {districts.slice(0,visibleCards).map((district, i) => (
          <motion.div
            key={district.name}
            className="district__card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            whileHover={{ y: -5 }}
          >
            {/* Image */}
            <div className="district__img-wrap">
              <img
                src={district.image}
                alt={district.name}
                className="district__img"
              />
              {/* Overlay */}
              <div className="district__overlay" />

              {/* Text on image */}
              <div className="district__text">
                <span className="district__name">
                  <FiMapPin size={13} />
                  {district.name}
                </span>
                <span className="district__count">
                  {district.temples} Temples
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
}