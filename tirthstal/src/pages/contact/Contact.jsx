import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiHome, FiChevronRight, FiPhone, FiMail,
  FiGlobe, FiClock, FiMapPin, FiSend, FiMessageCircle
} from "react-icons/fi";
import {
  FaFacebookF, FaInstagram, FaYoutube, FaXTwitter
} from "react-icons/fa6";
import "../../styles/pages/contact.css";

const subjects = [
  "General Inquiry",
  "Temple Information",
  "Festival Information",
  "Report an Issue",
  "Suggest a Temple",
  "Partnership",
  "Other",
];

const contactInfo = [
  { icon: <FiPhone />,   text: "0734-2550563" },
  { icon: <FiMail />,   text: "info@tirthstal.com" },
  { icon: <FiGlobe />,  text: "www.tirthstal.com" },
  { icon: <FiClock />,  text: "Monday - Saturday: 9:00 AM - 6:00 PM" },
  { icon: <FiMapPin />, text: "Tirthstal, 123 Temple Road,\nUjjain, Madhya Pradesh 456006, India" },
];

const socials = [
  { icon: <FaFacebookF />,  color: "#1877f2", label: "Facebook"  },
  { icon: <FaInstagram />,  color: "#e1306c", label: "Instagram" },
  { icon: <FaYoutube />,    color: "#ff0000", label: "YouTube"   },
  { icon: <FaXTwitter />,   color: "#000000", label: "X"         },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "", email: "", subject: "", message: ""
  });
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [notRobot,    setNotRobot]    = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [loading,     setLoading]     = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.subject || !form.message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setNotRobot(false);
    }, 1500);
  };

  return (
    <div className="contact-page">

      {/* ── Breadcrumb ── */}
      <div className="contact-page__breadcrumb">
        <Link to="/"><FiHome size={13} /> Home</Link>
        <FiChevronRight size={13} />
        <span>Contact Us</span>
      </div>

      {/* ── Header ── */}
      <div className="contact-page__header">
        <div className="contact-page__header-left">
          <motion.h1
            className="contact-page__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Contact Us
          </motion.h1>
          <motion.p
            className="contact-page__sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            We'd love to hear from you! Whether you have a question,<br />
            suggestion or feedback, our team is here to help.
          </motion.p>
        </div>
        <div className="contact-page__header-img">
          <img
            src="https://images.unsplash.com/photo-1548013146-72479768bada?w=900"
            alt="Temple"
            onError={(e) => e.target.style.display = "none"}
          />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="contact-page__body">

        {/* ── Left — Form ── */}
        <div className="contact-form">
          <h2 className="contact-form__title">Send Us a Message</h2>

          {/* Name + Email */}
          <div className="contact-form__row">
            <div className="contact-form__field">
              <label>Your Name <span>*</span></label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="contact-form__field">
              <label>Email Address <span>*</span></label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
          </div>

          {/* Subject */}
          <div className="contact-form__field">
            <label>Subject <span>*</span></label>
            <div
              className="contact-form__select"
              onClick={() => setSubjectOpen(!subjectOpen)}
            >
              <span className={form.subject ? "" : "placeholder"}>
                {form.subject || "Select a subject"}
              </span>
              <FiChevronRight
                size={14}
                className={`contact-form__select-arrow ${subjectOpen ? "open" : ""}`}
              />
              {subjectOpen && (
                <ul className="contact-form__select-list">
                  {subjects.map((s) => (
                    <li
                      key={s}
                      className={form.subject === s ? "selected" : ""}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChange("subject", s);
                        setSubjectOpen(false);
                      }}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="contact-form__field">
            <label>Message <span>*</span></label>
            <textarea
              placeholder="Write your message here..."
              rows={6}
              value={form.message}
              onChange={(e) => handleChange("message", e.target.value)}
            />
          </div>

          {/* Captcha + Submit */}
          <div className="contact-form__bottom">
            {/* Fake reCaptcha */}
            <div className="contact-form__captcha">
              <div
                className={`captcha__checkbox ${notRobot ? "checked" : ""}`}
                onClick={() => setNotRobot(!notRobot)}
              >
                {notRobot && <span>✓</span>}
              </div>
              <span className="captcha__label">I'm not a robot</span>
              <div className="captcha__logo">
                <div className="captcha__logo-icon">🔒</div>
                <span>reCAPTCHA</span>
                <span>Privacy - Terms</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="contact-form__submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <span className="contact-form__loading">Sending...</span>
              ) : (
                <>
                  <FiSend size={15} />
                  Send Message
                </>
              )}
            </button>
          </div>

          {/* Success Message */}
          {submitted && (
            <motion.div
              className="contact-form__success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ✅ Message sent successfully! We'll get back to you within 24-48 hours.
            </motion.div>
          )}

          {/* Response Note */}
          <div className="contact-form__note">
            <div className="contact-form__note-icon">
              <FiMail size={18} />
            </div>
            <div>
              <p>We usually respond within 24-48 hours.</p>
              <p>Thank you for being a part of Tirthstal!</p>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <aside className="contact-sidebar">

          {/* Contact Info */}
          <div className="contact-sidebar__card">
            <h3 className="contact-sidebar__title">Contact Information</h3>
            <div className="contact-sidebar__divider" />
            <div className="contact-sidebar__info-list">
              {contactInfo.map((item, i) => (
                <div key={i} className="contact-sidebar__info-item">
                  <div className="contact-sidebar__info-icon">{item.icon}</div>
                  <p className="contact-sidebar__info-text"
                    style={{ whiteSpace: "pre-line" }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Follow Us */}
          <div className="contact-sidebar__card">
            <h3 className="contact-sidebar__title">Follow Us</h3>
            <div className="contact-sidebar__divider" />
            <div className="contact-sidebar__socials">
              {socials.map((s) => (
                <button
                  key={s.label}
                  className="contact-sidebar__social-btn"
                  style={{ background: s.color }}
                  title={s.label}
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="contact-sidebar__card">
            <h3 className="contact-sidebar__title">We Value Your Feedback</h3>
            <div className="contact-sidebar__divider" />
            <p className="contact-sidebar__feedback-text">
              Your feedback helps us improve and bring you the best experience.
            </p>
            <button className="contact-sidebar__feedback-btn">
              <FiMessageCircle size={14} />
              Share Your Feedback
            </button>
          </div>

        </aside>
      </div>
    </div>
  );
}