import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiHome, FiChevronRight, FiMapPin, FiClock,
  FiHeart, FiShare2, FiCamera, FiInfo,
  FiNavigation, FiPhone, FiCalendar
} from "react-icons/fi";
import { getTempleBySlug } from "../../data/temple";
import "../../styles/temple/templeDetail.css";

const tabs = ["Overview", "Gallery", "Location", "Festivals", "Nearby"];

export default function TempleDetail() {
  const { slug }                    = useParams();
  const temple                      = getTempleBySlug(slug);
  const [activeTab, setActiveTab]   = useState("Overview");
  const [isFav,     setIsFav]       = useState(false);
  const [imgIndex,  setImgIndex]    = useState(0);

  if (!temple) {
    return (
      <div className="temple-detail__not-found">
        <span>🛕</span>
        <h2>Temple not found</h2>
        <Link to="/temples">Back to Temples</Link>
      </div>
    );
  }

  return (
    <div className="temple-detail">

      {/* ── Breadcrumb ── */}
      <div className="temple-detail__breadcrumb">
        <Link to="/" className="breadcrumb__item">
          <FiHome size={13} /> Home
        </Link>
        <FiChevronRight size={13} className="breadcrumb__sep" />
        <Link to="/temples" className="breadcrumb__item">Temples</Link>
        <FiChevronRight size={13} className="breadcrumb__sep" />
        <span className="breadcrumb__item breadcrumb__item--active">{temple.name}</span>
      </div>

      {/* ── Hero Image ── */}
      <div className="temple-detail__hero">
        <motion.img
          key={imgIndex}
          src={temple.images?.[imgIndex] || temple.image}
          alt={temple.name}
          className="temple-detail__hero-img"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
        <div className="temple-detail__hero-overlay" />

        {/* Image Thumbnails */}
        {temple.images?.length > 1 && (
          <div className="temple-detail__thumbnails">
            {temple.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className={`temple-detail__thumb ${i === imgIndex ? "active" : ""}`}
                onClick={() => setImgIndex(i)}
              />
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="temple-detail__hero-actions">
          <button
            className={`temple-detail__fav-btn ${isFav ? "active" : ""}`}
            onClick={() => setIsFav(!isFav)}
          >
            <FiHeart size={17} />
            {isFav ? "Saved" : "Save"}
          </button>
          <button className="temple-detail__share-btn">
            <FiShare2 size={17} />
            Share
          </button>
        </div>

        {/* Hero Badge */}
        <div className="temple-detail__hero-badge">
          <span
            className="temple-detail__deity-tag"
            style={{ background: `${temple.deityColor}22`, color: temple.deityColor }}
          >
            {temple.deity}
          </span>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="temple-detail__body">

        {/* ── Left ── */}
        <div className="temple-detail__left">

          {/* Title */}
          <motion.div
            className="temple-detail__title-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="temple-detail__title">{temple.name}</h1>
            <div className="temple-detail__meta">
              <span className="temple-detail__location">
                <FiMapPin size={14} />
                {temple.city}, {temple.district}
              </span>
              <span className="temple-detail__timing">
                <FiClock size={14} />
                {temple.timing || "5:00 AM – 10:00 PM"}
              </span>
              <span className="temple-detail__rating">
                ⭐ {temple.rating} / 5
              </span>
            </div>
          </motion.div>

          {/* ── Tabs ── */}
          <div className="temple-detail__tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`temple-detail__tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ── Tab Content ── */}
          <motion.div
            key={activeTab}
            className="temple-detail__tab-content"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >

            {/* Overview */}
            {activeTab === "Overview" && (
              <div className="temple-detail__overview">
                <h3>About the Temple</h3>
                <p>{temple.description || "This is one of the most sacred temples in India, attracting millions of devotees every year. The temple is known for its magnificent architecture and divine spiritual atmosphere."}</p>

                <h3>History</h3>
                <p>{temple.history || "The temple has a rich history dating back centuries. It has been a center of religious and cultural significance, with many legends and stories associated with it."}</p>

                <h3>Significance</h3>
                <p>{temple.significance || "This temple holds immense significance for devotees of all ages. It is believed that prayers offered here are answered and devotees experience divine blessings."}</p>

                {/* Quick Info Cards */}
                <div className="temple-detail__info-cards">
                  <div className="temple-detail__info-card">
                    <FiClock size={18} className="info-card__icon" />
                    <span className="info-card__label">Timings</span>
                    <span className="info-card__value">{temple.timing || "5 AM – 10 PM"}</span>
                  </div>
                  <div className="temple-detail__info-card">
                    <FiCalendar size={18} className="info-card__icon" />
                    <span className="info-card__label">Best Time</span>
                    <span className="info-card__value">{temple.bestTime || "Oct – Mar"}</span>
                  </div>
                  <div className="temple-detail__info-card">
                    <FiInfo size={18} className="info-card__icon" />
                    <span className="info-card__label">Entry Fee</span>
                    <span className="info-card__value">{temple.entryFee || "Free"}</span>
                  </div>
                  <div className="temple-detail__info-card">
                    <FiCamera size={18} className="info-card__icon" />
                    <span className="info-card__label">Photography</span>
                    <span className="info-card__value">{temple.photography || "Allowed"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Gallery */}
            {activeTab === "Gallery" && (
              <div className="temple-detail__gallery">
                {(temple.images || [temple.image]).map((img, i) => (
                  <motion.img
                    key={i}
                    src={img}
                    alt={`${temple.name} ${i + 1}`}
                    className="temple-detail__gallery-img"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setImgIndex(i)}
                  />
                ))}
              </div>
            )}

            {/* Location */}
            {activeTab === "Location" && (
              <div className="temple-detail__location-tab">
                <div className="temple-detail__map-placeholder">
                  <FiMapPin size={32} />
                  <p>{temple.name}</p>
                  <span>{temple.city}, {temple.district}</span>
                  <a
                    href={`https://maps.google.com/?q=${temple.name} ${temple.city}`}
                    target="_blank"
                    rel="noreferrer"
                    className="temple-detail__maps-btn"
                  >
                    <FiNavigation size={15} />
                    Open in Google Maps
                  </a>
                </div>
                <div className="temple-detail__address-card">
                  <h4>Address</h4>
                  <p>{temple.address || `${temple.name}, ${temple.city}, ${temple.district}`}</p>
                  <h4>How to Reach</h4>
                  <p>{temple.howToReach || "Well connected by road, rail and air. Nearest railway station and bus stand are within 5 km."}</p>
                </div>
              </div>
            )}

            {/* Festivals */}
            {activeTab === "Festivals" && (
              <div className="temple-detail__festivals">
                {(temple.festivals || [
                  { name: "Mahashivratri",  month: "February",  desc: "Grand celebration with lakhs of devotees." },
                  { name: "Navratri",       month: "October",   desc: "Nine days of devotion and cultural programs." },
                  { name: "Diwali",         month: "November",  desc: "Temple decorated with thousands of lamps." },
                ]).map((f, i) => (
                  <div key={i} className="temple-detail__festival-card">
                    <div className="festival-card__month">{f.month}</div>
                    <div className="festival-card__info">
                      <h4>{f.name}</h4>
                      <p>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Nearby */}
            {activeTab === "Nearby" && (
              <div className="temple-detail__nearby">
                <p className="temple-detail__nearby-sub">
                  Other temples near {temple.city}
                </p>
                <div className="temple-detail__nearby-grid">
                  {(temple.nearby || []).slice(0, 4).map((t, i) => (
                    <Link
                      key={i}
                      to={`/temples/${t.slug}`}
                      className="temple-detail__nearby-card"
                    >
                      <img src={t.image} alt={t.name} />
                      <div>
                        <p className="nearby-card__name">{t.name}</p>
                        <p className="nearby-card__dist">
                          <FiMapPin size={11} /> {t.distance} km away
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="temple-detail__sidebar">

          {/* Contact Card */}
          <div className="temple-detail__sidebar-card">
            <h4 className="sidebar-card__title">Temple Contact</h4>
            <ul className="sidebar-card__list">
              <li>
                <FiPhone size={14} />
                <span>{temple.phone || "+91 98765 43210"}</span>
              </li>
              <li>
                <FiMapPin size={14} />
                <span>{temple.city}, {temple.district}</span>
              </li>
              <li>
                <FiClock size={14} />
                <span>{temple.timing || "5:00 AM – 10:00 PM"}</span>
              </li>
            </ul>
            <a
              href={`https://maps.google.com/?q=${temple.name} ${temple.city}`}
              target="_blank"
              rel="noreferrer"
              className="sidebar-card__directions-btn"
            >
              <FiNavigation size={14} />
              Get Directions
            </a>
          </div>

          {/* Visit Info */}
          <div className="temple-detail__sidebar-card">
            <h4 className="sidebar-card__title">Visit Information</h4>
            <ul className="sidebar-card__info-list">
              <li>
                <span className="info-list__label">Entry Fee</span>
                <span className="info-list__value">{temple.entryFee || "Free"}</span>
              </li>
              <li>
                <span className="info-list__label">Dress Code</span>
                <span className="info-list__value">{temple.dressCode || "Traditional"}</span>
              </li>
              <li>
                <span className="info-list__label">Best Season</span>
                <span className="info-list__value">{temple.bestTime || "Oct – Mar"}</span>
              </li>
              <li>
                <span className="info-list__label">Photography</span>
                <span className="info-list__value">{temple.photography || "Allowed"}</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}