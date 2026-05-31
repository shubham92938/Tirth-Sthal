import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "../../styles/pages/auth.css";

const templeSlides = [
  {
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
    title: "Mahakaleshwar Temple",
    location: "Ujjain, Madhya Pradesh",
  },
  {
    image: "https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=800",
    title: "Omkareshwar Temple",
    location: "Khandwa, Madhya Pradesh",
  },
  {
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
    title: "Khajuraho Temples",
    location: "Chhatarpur, Madhya Pradesh",
  },
];

export default function Signup() {
  const navigate = useNavigate();
  const { register }    = useAuth();

  const [form, setForm]           = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass,  setShowPass]  = useState(false);
  const [showConf,  setShowConf]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [slideIndex,setSlideIndex]= useState(0);

  const handleChange = (field, val) =>
    setForm((p) => ({ ...p, [field]: val }));

  const handleSignup = async () => {
  if (!form.name || !form.email || !form.password || !form.confirm) {
    setError("Please fill in all fields.");
    return;
  }

  if (form.password !== form.confirm) {
    setError("Passwords do not match.");
    return;
  }

  try {
    await register(form.name,form.email,form.password),

    navigate("auth/login");

  } catch (err) {
    setError(err.message);
  }
};

  const prevSlide = () =>
    setSlideIndex((p) => (p === 0 ? templeSlides.length - 1 : p - 1));
  const nextSlide = () =>
    setSlideIndex((p) => (p === templeSlides.length - 1 ? 0 : p + 1));

  const current = templeSlides[slideIndex];


  console.log()

  return (
    <div className="auth-page">

      {/* ── Left Panel ── */}
      <div className="auth-left">
        <motion.img
          key={slideIndex}
          src={current.image}
          alt={current.title}
          className="auth-left__bg"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          onError={(e) => e.target.src = "https://images.unsplash.com/photo-1548013146-72479768bada?w=800"}
        />
        <div className="auth-left__overlay" />

        <div className="auth-left__nav">
          <Link to="/" className="auth-left__logo">
            🛕 <span>Tirthstal</span>
          </Link>
          <div className="auth-left__nav-right">
            <Link to="/auth/login" className="auth-left__nav-link">Login</Link>
            <Link to="/" className="auth-left__nav-btn">Explore</Link>
          </div>
        </div>

        <div className="auth-left__bottom">
          <div className="auth-left__temple-info">
            <div className="auth-left__avatar">🛕</div>
            <div>
              <p className="auth-left__temple-name">{current.title}</p>
              <p className="auth-left__temple-loc">{current.location}</p>
            </div>
          </div>
          <div className="auth-left__controls">
            <button className="auth-left__arrow" onClick={prevSlide}>
              <FiArrowLeft size={16} />
            </button>
            <div className="auth-left__dots">
              {templeSlides.map((_, i) => (
                <span
                  key={i}
                  className={`auth-left__dot ${i === slideIndex ? "active" : ""}`}
                  onClick={() => setSlideIndex(i)}
                />
              ))}
            </div>
            <button className="auth-left__arrow" onClick={nextSlide}>
              <FiArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="auth-right">

        <div className="auth-right__top">
          <div className="auth-right__logo">
            <span className="auth-right__logo-icon">🛕</span>
            <span className="auth-right__logo-text">Tirthstal</span>
          </div>
        </div>

        <motion.div
          className="auth-form"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="auth-form__title">Join Tirthstal 🛕</h1>
          <p className="auth-form__sub">Create your account and start your divine journey</p>

          {error && <div className="auth-form__error">{error}</div>}

          {/* Name */}
          <div className="auth-form__field">
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="auth-form__input"
            />
          </div>

          {/* Email */}
          <div className="auth-form__field">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="auth-form__input"
            />
          </div>

          {/* Password */}
          <div className="auth-form__field auth-form__field--pass">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="auth-form__input"
            />
            <button className="auth-form__eye" onClick={() => setShowPass(!showPass)}>
              {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="auth-form__field auth-form__field--pass">
            <input
              type={showConf ? "text" : "password"}
              placeholder="Confirm Password"
              value={form.confirm}
              onChange={(e) => handleChange("confirm", e.target.value)}
              className="auth-form__input"
            />
            <button className="auth-form__eye" onClick={() => setShowConf(!showConf)}>
              {showConf ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>

          {/* Divider */}
          <div className="auth-form__divider">
            <span /><p>or</p><span />
          </div>

          {/* Google */}
          <button className="auth-form__google">
            <img src="https://www.google.com/favicon.ico" alt="Google" width={18} height={18} />
            Sign up with Google
          </button>

          {/* Submit */}
          <button
            className="auth-form__submit"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="auth-form__switch">
            Already have an account?{" "}
            <Link to="/auth/login">Login</Link>
          </p>

          <div className="auth-form__socials">
            <button className="auth-social-btn"><FaFacebookF size={16} /></button>
            <button className="auth-social-btn"><FaTwitter size={16} /></button>
            <button className="auth-social-btn"><FaLinkedinIn size={16} /></button>
            <button className="auth-social-btn"><FaInstagram size={16} /></button>
          </div>

        </motion.div>
      </div>
    </div>
  );
}