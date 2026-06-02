import { useState }         from "react";
import { Link }             from "react-router-dom";
import { motion }           from "framer-motion";
import { FiMail, FiArrowLeft, FiSend } from "react-icons/fi";
import { forgotPasswordAPI } from "../../services/authServices";
import "../../styles/pages/auth.css";

export default function ForgotPassword() {
  const [email,     setEmail]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [sent,      setSent]      = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await forgotPasswordAPI(email);
      setSent(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page--centered">

      <motion.div
        className="auth-forgot"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.4  }}
      >
        {/* Logo */}
        <div className="auth-forgot__logo">
          <span>🛕</span>
          <p>Tirthstal</p>
        </div>

        {!sent ? (
          <>
            {/* Icon */}
            <div className="auth-forgot__icon">
              <FiMail size={28} />
            </div>

            <h1 className="auth-forgot__title">Forgot Password?</h1>
            <p className="auth-forgot__sub">
              No worries! Enter your email address and we'll send you
              a link to reset your password.
            </p>

            {/* Error */}
            {error && (
              <motion.div
                className="auth-form__error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ⚠️ {error}
              </motion.div>
            )}

            {/* Email Input */}
            <div className="auth-forgot__field">
              <label>Email Address</label>
              <div className="auth-forgot__input-wrap">
                <FiMail size={16} className="auth-forgot__input-icon" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              className="auth-forgot__btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <span className="auth-form__loading">
                  <span className="auth-spinner" /> Sending...
                </span>
              ) : (
                <>
                  <FiSend size={15} />
                  Send Reset Link
                </>
              )}
            </button>

            {/* Back to Login */}
            <Link to="/auth/login" className="auth-forgot__back">
              <FiArrowLeft size={14} />
              Back to Login
            </Link>
          </>
        ) : (
          // ── Success State ──
          <motion.div
            className="auth-forgot__success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1    }}
            transition={{ duration: 0.4 }}
          >
            <div className="auth-forgot__success-icon">📧</div>
            <h2>Check your email!</h2>
            <p>
              We've sent a password reset link to<br />
              <strong>{email}</strong>
            </p>
            <div className="auth-forgot__success-note">
              <p>⏰ Link expires in <strong>15 minutes</strong></p>
              <p>📁 Check your spam folder if you don't see it</p>
            </div>

            <button
              className="auth-forgot__resend"
              onClick={() => { setSent(false); setEmail(""); }}
            >
              Didn't receive? Try again
            </button>

            <Link to="/auth/login" className="auth-forgot__back">
              <FiArrowLeft size={14} />
              Back to Login
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}