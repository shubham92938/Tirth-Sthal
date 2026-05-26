import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiClock, FiEye, FiArrowRight } from "react-icons/fi";
import { blogs } from "../../data/blogs";
import "../../styles/pages/blog.css";

const categories = ["All", "Temple History", "Travel Guide", "Spiritual Practices", "Pilgrimage"];

export default function Blog() {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [visible,  setVisible]  = useState(6);

  const filtered = blogs.filter((b) => {
    const q  = search.toLowerCase();
    const ms = b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q);
    const mc = category === "All" || b.category === category;
    return ms && mc;
  });

  const featured = blogs.filter((b) => b.featured)[0];

  return (
    <div className="blog-page">

      {/* ── Header ── */}
      <div className="blog-page__header">
        <h1 className="blog-page__title">Blog & Stories</h1>
        <p className="blog-page__sub">
          Stories, guides and insights about India's sacred temples and traditions.
        </p>
      </div>

      {/* ── Featured ── */}
      {featured && (
        <Link to={`/blog/${featured.slug}`} className="blog-page__featured">
          <img
            src={featured.image}
            alt={featured.title}
            className="blog-page__featured-img"
            onError={(e) => { e.target.src = "/images/placeholder-temple.jpg"; }}
          />
          <div className="blog-page__featured-overlay" />
          <div className="blog-page__featured-content">
            <span
              className="blog-page__featured-cat"
              style={{ background: featured.categoryColor }}
            >
              {featured.category}
            </span>
            <h2 className="blog-page__featured-title">{featured.title}</h2>
            <p className="blog-page__featured-excerpt">{featured.excerpt}</p>
            <div className="blog-page__featured-meta">
              <span>By {featured.author.name}</span>
              <span>|</span>
              <span>{featured.date}</span>
              <span>|</span>
              <FiClock size={13} /> <span>{featured.readTime}</span>
            </div>
          </div>
        </Link>
      )}

      {/* ── Filters ── */}
      <div className="blog-page__filters">
        <div className="blog-page__search">
          <FiSearch size={15} />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="blog-page__cats">
          {categories.map((c) => (
            <button
              key={c}
              className={`blog-page__cat ${category === c ? "active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="blog-page__grid">
        {filtered.slice(0, visible).map((b, i) => (
          <motion.div
            key={b.id}
            className="blog-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            whileHover={{ y: -4 }}
          >
            <Link to={`/blog/${b.slug}`} className="blog-card__img-wrap">
              <img
                src={b.image}
                alt={b.title}
                className="blog-card__img"
                onError={(e) => { e.target.src = "/images/placeholder-temple.jpg"; }}
              />
              <span
                className="blog-card__cat"
                style={{ background: b.categoryColor }}
              >
                {b.category}
              </span>
            </Link>
            <div className="blog-card__info">
              <Link to={`/blog/${b.slug}`} className="blog-card__title">{b.title}</Link>
              <p className="blog-card__excerpt">{b.excerpt}</p>
              <div className="blog-card__meta">
                <span><FiClock size={12} /> {b.readTime}</span>
                <span><FiEye  size={12} /> {b.views}</span>
              </div>
              <div className="blog-card__footer">
                <span className="blog-card__author">By {b.author.name}</span>
                <Link to={`/blog/${b.slug}`} className="blog-card__read-more">
                  Read More <FiArrowRight size={13} />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      {visible < filtered.length && (
        <div className="blog-page__load-more">
          <button onClick={() => setVisible((v) => v + 6)}>Load More</button>
        </div>
      )}
    </div>
  );
}