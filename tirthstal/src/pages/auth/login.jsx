import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEyeOff, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "../../styles/pages/auth.css";

const templeSlides = [
  {
    image:    "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
    title:    "Mahakaleshwar Temple",
    location: "Ujjain, Madhya Pradesh",
  },
  {
    image:    "https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=800",
    title:    "Omkareshwar Temple",
    location: "Khandwa, Madhya Pradesh",
  },
  {
    image:    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
    title:    "Khajuraho Temples",
    location: "Chhatarpur, Madhya Pradesh",
  },
];

export default function Login() {
  const navigate     = useNavigate();
  const { login }    = useAuth();

  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [slideIndex, setSlideIndex] = useState(0);

  const current = templeSlides[slideIndex];

  const prevSlide = () =>
    setSlideIndex((p) => (p === 0 ? templeSlides.length - 1 : p - 1));
  const nextSlide = () =>
    setSlideIndex((p) => (p === templeSlides.length - 1 ? 0 : p + 1));

  // ── Main Login Function ──
  const handleLogin = async () => {
    // 1. Validation
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // 2. Backend ko data bhejo
      await login(email, password);

      // 3. Success → Home page pe navigate karo
      navigate("/");

    } catch (err) {
      // 4. Error show karo
      setError(
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Enter key se bhi login ho
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

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
          animate={{ opacity: 1, scale: 1   }}
          transition={{ duration: 0.6 }}
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1548013146-72479768bada?w=800";
          }}
        />
        <div className="auth-left__overlay" />

        {/* Top Nav */}
        <div className="auth-left__nav">
          <Link to="/" className="auth-left__logo">
            🛕 <span>Tirthstal</span>
          </Link>
          <div className="auth-left__nav-right">
            <Link to="/auth/signup" className="auth-left__nav-link">Sign Up</Link>
            <Link to="/"            className="auth-left__nav-btn">Explore</Link>
          </div>
        </div>

        {/* Bottom */}
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
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="auth-form__title">Welcome Back 🙏</h1>
          <p className="auth-form__sub">Sign in to continue your divine journey</p>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="auth-form__error"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0  }}
                exit={{    opacity: 0, y: -8  }}
              >
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <div className="auth-form__field">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className="auth-form__input"
            />
          </div>

          {/* Password */}
          <div className="auth-form__field auth-form__field--pass">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="auth-form__input"
            />
            <button
              className="auth-form__eye"
              onClick={() => setShowPass(!showPass)}
              type="button"
            >
              {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>

          {/* Forgot */}
          <div className="auth-form__forgot">
            <Link to="/auth/forgot">Forgot password?</Link>
          </div>

          {/* Divider */}
          <div className="auth-form__divider">
            <span /><p>or</p><span />
          </div>

          {/* Google */}
          <button className="auth-form__google" type="button">
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google" width={18} height={18}
            />
            Login with Google
          </button>

          {/* Login Button */}
          <button
            className="auth-form__submit"
            onClick={handleLogin}
            disabled={loading}
            type="button"
          >
            {loading ? (
              <span className="auth-form__loading">
                <span className="auth-spinner" />
                Signing in...
              </span>
            ) : "Login"}
          </button>

          {/* Switch to Signup */}
          <p className="auth-form__switch">
            Don't have an account?{" "}
            <Link to="/auth/signup">Sign up</Link>
          </p>

          {/* Socials */}
          <div className="auth-form__socials">
            <button className="auth-social-btn" type="button"><FaFacebookF  size={16} /></button>
            <button className="auth-social-btn" type="button"><FaTwitter    size={16} /></button>
            <button className="auth-social-btn" type="button"><FaLinkedinIn size={16} /></button>
            <button className="auth-social-btn" type="button"><FaInstagram  size={16} /></button>
          </div>

        </motion.div>
      </div>
    </div>
  );
}