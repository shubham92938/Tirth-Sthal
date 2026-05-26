import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiHome, FiChevronRight, FiClock, FiEye,
  FiArrowLeft, FiArrowRight, FiLink
} from "react-icons/fi";
import { getBlogBySlug, relatedArticles } from "../../data/blogs";
import "../../styles/pages/blog.css";

export default function BlogDetail() {
  const { slug }                      = useParams();
  const blog                          = getBlogBySlug(slug);
  const [activeSection, setActive]    = useState("");

  useEffect(() => {
    if (blog?.sections?.length) setActive(blog.sections[0].id);
    window.scrollTo(0, 0);
  }, [slug, blog]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = blog?.sections || [];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [blog]);

  if (!blog) return (
    <div className="blog-detail__not-found">
      <h2>Article not found</h2>
      <Link to="/blog">Back to Blog</Link>
    </div>
  );

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
  };

  const copyLink = () => navigator.clipboard.writeText(window.location.href);

  return (
    <div className="blog-detail">

      {/* ── Top Section ── */}
      <div className="blog-detail__top">

        {/* Left — Title area */}
        <div className="blog-detail__top-left">

          {/* Breadcrumb */}
          <div className="blog-detail__breadcrumb">
            <Link to="/"><FiHome size={13} /> Home</Link>
            <FiChevronRight size={13} />
            <Link to="/blog">Blog</Link>
            <FiChevronRight size={13} />
            <span>{blog.title}</span>
          </div>

          {/* Category */}
          <span
            className="blog-detail__category"
            style={{ background: `${blog.categoryColor}18`, color: blog.categoryColor }}
          >
            {blog.category}
          </span>

          {/* Title */}
          <motion.h1
            className="blog-detail__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {blog.title}
          </motion.h1>

          {/* Excerpt */}
          <p className="blog-detail__excerpt">{blog.excerpt}</p>

          {/* Meta */}
          <div className="blog-detail__meta">
            <img
              src={blog.author.avatar}
              alt={blog.author.name}
              className="blog-detail__avatar"
              onError={(e) => { e.target.src = "/images/hero-avatar.jpg"; }}
            />
            <span className="blog-detail__author">By {blog.author.name}</span>
            <span className="blog-detail__sep">|</span>
            <span>{blog.date}</span>
            <span className="blog-detail__sep">|</span>
            <FiClock size={13} /> <span>{blog.readTime}</span>
            <span className="blog-detail__sep">|</span>
            <FiEye size={13} /> <span>{blog.views} Views</span>
          </div>
        </div>

        {/* Right — Hero Image + TOC */}
        <div className="blog-detail__top-right">
          <img
            src={blog.image}
            alt={blog.title}
            className="blog-detail__hero-img"
            onError={(e) => { e.target.src = "/images/hero-temple.jpg"; }}
          />

          {/* Table of Contents */}
          <div className="blog-detail__toc">
            <h3 className="blog-detail__toc-title">Table of Contents</h3>
            <ul className="blog-detail__toc-list">
              {blog.sections.map((s) => (
                <li
                  key={s.id}
                  className={`blog-detail__toc-item ${activeSection === s.id ? "active" : ""}`}
                  onClick={() => scrollTo(s.id)}
                >
                  {s.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="blog-detail__body">

        {/* ── Article Content ── */}
        <div className="blog-detail__content">

          {blog.sections.map((s, i) => (
            <div key={s.id} id={s.id} className="blog-detail__section">
              <h2 className="blog-detail__section-title">{s.title}</h2>
              <div className="blog-detail__section-body">
                <p className="blog-detail__section-text">{s.content}</p>

                {/* Info Card after 3rd section */}
                {i === 2 && (
                  <div className="blog-detail__info-card">
                    {blog.infoCard.map((item, j) => (
                      <div key={j} className="blog-detail__info-item">
                        <span className="blog-detail__info-icon">{item.icon}</span>
                        <div>
                          <p className="blog-detail__info-label">{item.label}</p>
                          <p className="blog-detail__info-value">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Tags */}
          <div className="blog-detail__tags">
            <span className="blog-detail__tags-label">Tags:</span>
            {blog.tags.map((tag) => (
              <span key={tag} className="blog-detail__tag">{tag}</span>
            ))}
          </div>

          {/* Share */}
          <div className="blog-detail__share">
            <span className="blog-detail__share-label">Share this article:</span>
            <div className="blog-detail__share-btns">
              <a
                href={`https://facebook.com/sharer/sharer.php?u=${window.location.href}`}
                target="_blank" rel="noreferrer"
                className="blog-detail__share-btn fb"
              >
                f
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${window.location.href}`}
                target="_blank" rel="noreferrer"
                className="blog-detail__share-btn tw"
              >
                𝕏
              </a>
              <a
                href={`https://wa.me/?text=${window.location.href}`}
                target="_blank" rel="noreferrer"
                className="blog-detail__share-btn wa"
              >
                W
              </a>
              <button className="blog-detail__share-btn cp" onClick={copyLink}>
                <FiLink size={14} />
              </button>
            </div>
          </div>

          {/* Prev / Next */}
          <div className="blog-detail__nav">
            {blog.prevArticle ? (
              <Link to={`/blog/${blog.prevArticle.slug}`} className="blog-detail__nav-prev">
                <FiArrowLeft size={15} />
                <div>
                  <span className="blog-detail__nav-label">← Previous Article</span>
                  <p className="blog-detail__nav-title">{blog.prevArticle.title}</p>
                </div>
              </Link>
            ) : <div />}

            {blog.nextArticle && (
              <Link to={`/blog/${blog.nextArticle.slug}`} className="blog-detail__nav-next">
                <div>
                  <span className="blog-detail__nav-label">Next Article →</span>
                  <p className="blog-detail__nav-title">{blog.nextArticle.title}</p>
                </div>
                <FiArrowRight size={15} />
              </Link>
            )}
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <aside className="blog-detail__sidebar">

          {/* Related Articles */}
          <div className="blog-detail__related">
            <h3 className="blog-detail__related-title">Related Articles</h3>
            <div className="blog-detail__related-list">
              {relatedArticles.filter((r) => r.slug !== slug).map((r) => (
                <Link
                  key={r.id}
                  to={`/blog/${r.slug}`}
                  className="blog-detail__related-item"
                >
                  <img
                    src={r.image}
                    alt={r.title}
                    onError={(e) => { e.target.src = "/images/hero-temple.jpg"; }}
                  />
                  <div>
                    <p className="blog-detail__related-name">{r.title}</p>
                    <span className="blog-detail__related-date">{r.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}