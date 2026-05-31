import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiSearch, FiCalendar, FiMapPin, FiHeart,
  FiChevronDown, FiRefreshCw, FiArrowRight, FiChevronRight
} from "react-icons/fi";
import { festivals } from "../../data/festivals";
import "../../styles/pages/festivals.css";

const months = [
  "All Months","January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const states = ["All States","Madhya Pradesh","Maharashtra","Rajasthan","Uttar Pradesh"];
const types  = [
  "All Types","National Festival","Regional Festival",
  "Cultural Festival","Major Pilgrimage Mela","Monthly Observance","State Festival"
];

const upcomingList = [
  { month:"MAY", day:"25", name:"Char Dham Yatra Begins", location:"Uttarakhand",  days:5  },
  { month:"JUN", day:"07", name:"Jagannath Rath Yatra",   location:"Puri, Odisha", days:18 },
  { month:"JUL", day:"21", name:"Shravan Somvar Begins",  location:"Across India", days:62 },
];

const guideItems = [
  { icon:"🪔", title:"How to Participate",  sub:"Learn the rituals and significance"      },
  { icon:"🧳", title:"Travel & Stay",        sub:"Tips for a comfortable journey"          },
  { icon:"🛡️", title:"Do's & Don'ts",        sub:"Follow guidelines and respect traditions"},
];

function Dropdown({ value, options, open, setOpen, onSelect }) {
  return (
    <div className="fest-filter__dropdown" onClick={() => setOpen(!open)}>
      <span>{value}</span>
      <FiChevronDown size={13} className={`fest-filter__arrow ${open ? "open" : ""}`} />
      {open && (
        <ul className="fest-filter__list">
          {options.map((o) => (
            <li
              key={o}
              className={value === o ? "selected" : ""}
              onClick={(e) => { e.stopPropagation(); onSelect(o); setOpen(false); }}
            >
              {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Festivals() {
  const [search,    setSearch]    = useState("");
  const [selMonth,  setSelMonth]  = useState("All Months");
  const [selState,  setSelState]  = useState("All States");
  const [selType,   setSelType]   = useState("All Types");
  const [monthOpen, setMonthOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [typeOpen,  setTypeOpen]  = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [visible,   setVisible]   = useState(8);

  const toggleFav = (id) =>
    setFavorites((p) => p.includes(id) ? p.filter((f) => f !== id) : [...p, id]);

  const filtered = festivals.filter((f) => {
    const q   = search.toLowerCase();
    const ms  = f.name.toLowerCase().includes(q) || f.location.toLowerCase().includes(q);
    const mm  = selMonth === "All Months" || f.month.toLowerCase().includes(selMonth.toLowerCase());
    const mt  = selType  === "All Types"  || f.type  === selType;
    const mst = selState === "All States" || f.state === selState;
    return ms && mm && mt && mst;
  });

  const reset = () => {
    setSearch(""); setSelMonth("All Months");
    setSelState("All States"); setSelType("All Types");
  };

  return (
    <div className="fest-page">

      {/* ── Breadcrumb ── */}
      <div className="fest-page__breadcrumb">
        <Link to="/">Home</Link>
        <FiChevronRight size={13} />
        <span>Festivals</span>
      </div>

      {/* ── Hero Header ── */}
      <div className="fest-page__hero">
          <img src="/images/hero-temples.jpeg" class="dist-main__hero-bg" alt="Festivals"
            onError={(e) => e.target.style.display = "none"} />
            <div className="dist-main__hero-overlay" />
        <div className="fest-page__hero-left">
          <h1 className="fest-page__title">Festivals</h1>
          <p className="fest-page__sub">
            Celebrating devotion, culture and traditions.<br />
            Explore festivals at temples across India.
          </p>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="fest-filter">
        <div className="fest-filter__search">
          <FiSearch size={15} />
          <input
            type="text"
            placeholder="Search festivals, temples..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Dropdown
          value={selMonth} options={months}
          open={monthOpen} setOpen={setMonthOpen} onSelect={setSelMonth}
        />
        <Dropdown
          value={selState} options={states}
          open={stateOpen} setOpen={setStateOpen} onSelect={setSelState}
        />
        <Dropdown
          value={selType} options={types}
          open={typeOpen} setOpen={setTypeOpen} onSelect={setSelType}
        />
        <button className="fest-filter__apply-btn">Apply Filters</button>
        <button className="fest-filter__reset-btn" onClick={reset}>
          <FiRefreshCw size={13} /> Reset
        </button>
      </div>

      {/* ── Body ── */}
      <div className="fest-page__body">

        {/* ── Left Main ── */}
        <div className="fest-page__main">

          {/* Section Header */}
          <div className="fest-page__section-header">
            <h2 className="fest-page__section-title">Popular Festivals</h2>
            <button className="fest-page__view-all">
              View All Festivals <FiArrowRight size={14} />
            </button>
          </div>

          {/* Festival Grid */}
          <div className="fest-grid">
            {filtered.slice(0, visible).map((f, i) => (
              <motion.div
                key={f.id}
                className="fest-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                whileHover={{ y: -4 }}
              >
                {/* Image */}
                <div className="fest-card__img-wrap">
                  <img
                    src={f.image}
                    alt={f.name}
                    className="fest-card__img"
                    onError={(e) => { e.target.src = "/images/placeholder-temple.jpg"; }}
                  />
                  <span className="fest-card__month-badge">{f.month}</span>
                  <button
                    className={`fest-card__fav ${favorites.includes(f.id) ? "active" : ""}`}
                    onClick={() => toggleFav(f.id)}
                  >
                    <FiHeart size={14} />
                  </button>
                </div>

                {/* Info */}
                <div className="fest-card__info">
                  <div className="fest-card__top-row">
                    <span className="fest-card__deity-icon">🪔</span>
                    <h3 className="fest-card__name">{f.name}</h3>
                  </div>
                  <div className="fest-card__location">
                    <FiMapPin size={11} />
                    <span>{f.location}</span>
                  </div>
                  <div className="fest-card__bottom">
                    <span className="fest-card__date">
                      <FiCalendar size={11} />
                      {f.month}
                    </span>
                    <span
                      className="fest-card__type-badge"
                      style={{ background: `${f.deityColor}18`, color: f.deityColor }}
                    >
                      {f.type.split(" ").pop()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          {visible < filtered.length && (
            <div className="fest-page__load-more">
              <button onClick={() => setVisible((v) => v + 8)}>
                Load More <FiChevronDown size={15} />
              </button>
            </div>
          )}
        </div>

        {/* ── Right Sidebar ── */}
        <div className="fest-page__sidebar">

          {/* Upcoming Festivals */}
          <div className="fest-sidebar__box">
            <div className="fest-sidebar__box-header">
              <h3>Upcoming Festivals</h3>
              <button className="fest-sidebar__view-cal">
                View Calendar <FiArrowRight size={13} />
              </button>
            </div>
            <div className="fest-sidebar__upcoming-list">
              {upcomingList.map((u, i) => (
                <div key={i} className="fest-sidebar__upcoming-item">
                  <div className="fest-sidebar__date-box">
                    <span className="fest-sidebar__date-month">{u.month}</span>
                    <span className="fest-sidebar__date-day">{u.day}</span>
                  </div>
                  <div className="fest-sidebar__upcoming-info">
                    <p className="fest-sidebar__upcoming-name">{u.name}</p>
                    <p className="fest-sidebar__upcoming-loc">{u.location}</p>
                    <p className="fest-sidebar__upcoming-days">
                      Starts in {u.days} days
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="fest-sidebar__box fest-sidebar__newsletter">
            <div className="fest-sidebar__news-icon">📅</div>
            <h3>Never Miss a Festival</h3>
            <p>Subscribe to get festival alerts, dates and special updates.</p>
            <div className="fest-sidebar__news-input">
              <input type="email" placeholder="Enter your email" />
              <button>Subscribe</button>
            </div>
          </div>

          {/* Festival Guide */}
          <div className="fest-sidebar__box">
            <h3 className="fest-sidebar__guide-title">Festival Guide</h3>
            <div className="fest-sidebar__guide-list">
              {guideItems.map((g, i) => (
                <div key={i} className="fest-sidebar__guide-item">
                  <span className="fest-sidebar__guide-icon">{g.icon}</span>
                  <div className="fest-sidebar__guide-text">
                    <p className="fest-sidebar__guide-name">{g.title}</p>
                    <p className="fest-sidebar__guide-sub">{g.sub}</p>
                  </div>
                  <FiChevronRight size={15} className="fest-sidebar__guide-arrow" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}