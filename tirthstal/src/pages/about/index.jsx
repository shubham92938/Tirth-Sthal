import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiHome, FiChevronRight, FiHeart } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import "../../styles/pages/about.css";

const missions = [
  { icon: "🛕", title: "Preserve Heritage",  desc: "Documenting and preserving the spiritual and cultural heritage of India's temples." },
  { icon: "👥", title: "Connect Devotees",   desc: "Helping devotees find temples, plan visits and stay connected with their faith."   },
  { icon: "📖", title: "Spread Knowledge",   desc: "Sharing authentic stories, histories and significance of sacred places."           },
  { icon: "🌏", title: "Promote Tourism",    desc: "Encouraging spiritual tourism and supporting local communities."                   },
];

const whyUs = [
  { icon: "🛡️", title: "Authentic & Verified Information", desc: "We ensure accuracy and authenticity in every detail."                     },
  { icon: "👥", title: "Community Driven",                  desc: "Built with love by a community of devotees and researchers."              },
  { icon: "📱", title: "Easy & Accessible",                 desc: "User-friendly platform for everyone, anywhere, anytime."                  },
  { icon: "❤️", title: "Made with Devotion",                desc: "Every piece of content is created with respect and devotion."             },
];

const values = [
  { icon: "🙏", label: "Faith"     },
  { icon: "🤝", label: "Respect"   },
  { icon: "✅", label: "Integrity" },
  { icon: "🫶", label: "Service"   },
];

const stats = [
  { icon: "🛕", num: 5432,  suffix: "+", label: "Temples Listed"    },
  { icon: "📍", num: 36,    suffix: "",  label: "Districts Covered"  },
  { icon: "🕉️", num: 100,   suffix: "+", label: "Festivals & Events" },
  { icon: "👥", num: 10,    suffix: "L+",label: "Happy Devotees"     },
];

const socials = [
  { icon: "f",  bg: "#1877F2", href: "#" },
  { icon: "📷", bg: "#E1306C", href: "#" },
  { icon: "▶",  bg: "#FF0000", href: "#" },
  { icon: "✉",  bg: "#3b0a0a", href: "#" },
];

export default function About() {
  function useCountUp(end, duration = 2000, inView = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);
  return count;
}


const statsRef = useRef(null);
const [statsInView, setStatsInView] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) setStatsInView(true); },
    { threshold: 0.3 }
  );
  if (statsRef.current) observer.observe(statsRef.current);
  return () => observer.disconnect();
}, []);

  return (
    <div className="about-page">

      {/* ── Breadcrumb ── */}
      <div className="about-page__breadcrumb">
        <Link to="/"><FiHome size={13} /> Home</Link>
        <FiChevronRight size={13} />
        <span>About Us</span>
      </div>

      {/* ── Hero ── */}
      <div className="about-page__hero">
        <div className="about-page__hero-left">
          <motion.h1
            className="about-page__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            About Tirthstal
          </motion.h1>
          <motion.p
            className="about-page__subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Tirthstal is a digital platform dedicated to preserving and
            promoting India's rich temple heritage, spiritual traditions
            and sacred journeys.
          </motion.p>
        </div>
        <div className="about-page__hero-img">
          <img
            src="/images/about-hero.png"
            alt="Temples"
            onError={(e) => e.target.style.display = "none"}
          />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="about-page__body">

        {/* ── Left ── */}
        <div className="about-page__left">

          {/* Our Mission */}
          <section className="about-section">
            <h2 className="about-section__title">Our Mission</h2>
            <div className="about-section__underline" />
            <p className="about-section__desc">
              To connect devotees, travelers and culture enthusiasts with authentic
              information about temples, festivals, traditions and spiritual
              experiences across India.
            </p>

            {/* Mission Cards */}
            <div className="about-mission__grid">
              {missions.map((m, i) => (
                <motion.div
                  key={i}
                  className="about-mission__card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.08 }}
                >
                  <div className="about-mission__icon">{m.icon}</div>
                  <h4 className="about-mission__name">{m.title}</h4>
                  <p className="about-mission__desc">{m.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Our Story */}
          <section className="about-section">
            <h2 className="about-section__title">Our Story</h2>
            <div className="about-section__underline" />
            <div className="about-story">
              <img
                src="/images/about-story.jpg"
                alt="Our Story"
                className="about-story__img"
                onError={(e) => { e.target.src = "/images/placeholder-temple.jpg"; }}
              />
              <div className="about-story__content">
                <p>
                  Tirthstal was born out of a deep love for India's spiritual
                  heritage and a desire to make temple information accessible
                  to everyone. We believe that every temple has a story, every
                  festival has a meaning and every journey is a path to divine.
                </p>
                <p>
                  Our team works tirelessly to research, verify and share
                  accurate information about temples, their history, rituals,
                  festivals and more.
                </p>
                <Link to="/contact" className="about-story__btn">
                  <FiHeart size={14} />
                  Join Us in This Divine Journey
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* ── Right Sidebar ── */}
        <aside className="about-page__sidebar">

          {/* Why Tirthstal */}
          <div className="about-sidebar__box">
            <h3 className="about-sidebar__title">Why Tirthstal?</h3>
            <div className="about-why__list">
              {whyUs.map((w, i) => (
                <div key={i} className="about-why__item">
                  <span className="about-why__icon">{w.icon}</span>
                  <div>
                    <p className="about-why__name">{w.title}</p>
                    <p className="about-why__desc">{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Our Values */}
          <div className="about-sidebar__box">
            <h3 className="about-sidebar__title">Our Values</h3>
            <div className="about-values__grid">
              {values.map((v, i) => (
                <div key={i} className="about-values__item">
                  <span className="about-values__icon">{v.icon}</span>
                  <p className="about-values__label">{v.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Connect With Us */}
          <div className="about-sidebar__box">
            <h3 className="about-sidebar__title">Connect With Us</h3>
            <p className="about-connect__sub">We'd love to hear from you!</p>
            <div className="about-connect__socials">
              {socials.map((s, i) => (
                
                  <a key={i}
                  href={s.href}
                  className="about-connect__social"
                  style={{ background: s.bg }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

        </aside>
      </div>

      {/* ── Stats Bar ── */}
     <div className="about-stats" ref={statsRef}>
  {stats.map((s, i) => (
    <div key={i} className="about-stat">
      <span className="about-stat__icon">{s.icon}</span>
      <div>
        <p className="about-stat__num">
          {statsInView
            ? s.num.toLocaleString() + s.suffix
            : "0"}
        </p>
        <p className="about-stat__label">{s.label}</p>
      </div>
    </div>
  ))}
</div>

    </div>
  );
}