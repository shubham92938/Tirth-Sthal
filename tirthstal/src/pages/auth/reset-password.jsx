import { useState }          from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion }            from "framer-motion";
import { FiLock, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import { resetPasswordAPI }  from "../../services/authServices";
import { useAuth }           from "../../context/AuthContext";
import "../../styles/pages/auth.css";

export default function ResetPassword() {
  const { token }     = useParams();
  const navigate      = useNavigate();
  const { login }     = useAuth();

  const [password,    setPassword]    = useState("");
  const [confirm,     setConfirm]     = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [showConf,    setShowConf]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [success,     setSuccess]     = useState(false);

  const handleReset = async () => {
    if (!password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await resetPasswordAPI(token, password);

      // Auto login after reset
      localStorage.setItem("tirthstal_token", data.token);
      localStorage.setItem("tirthstal_user",  JSON.stringify(data.user));

      setSuccess(true);

      // 2 seconds baad home pe bhejo
      setTimeout(() => navigate("/"), 2000);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Reset failed. Link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  // Password strength check
  const getStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 6)   return { level: "weak",   color: "#e53e3e", label: "Too short" };
    if (password.length < 8)   return { level: "fair",   color: "#f59e0b", label: "Fair"      };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password))
                               return { level: "good",   color: "#3b82f6", label: "Good"      };
    return                            { level: "strong", color: "#10b981", label: "Strong ✓"  };
  };

  const strength = getStrength();

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

        {!success ? (
          <>
            <div className="auth-forgot__icon">
              <FiLock size={28} />
            </div>

            <h1 className="auth-forgot__title">Reset Password</h1>
            <p className="auth-forgot__sub">
              Enter your new password below.
              Make it strong and memorable!
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

            {/* New Password */}
            <div className="auth-forgot__field">
              <label>New Password</label>
              <div className="auth-forgot__input-wrap">
                <FiLock size={16} className="auth-forgot__input-icon" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="auth-forgot__eye"
                  onClick={() => setShowPass(!showPass)}
                  type="button"
                >
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>

              {/* Password Strength */}
              {strength && (
                <div className="auth-forgot__strength">
                  <div className="auth-forgot__strength-bar">
                    <div
                      style={{
                        width: strength.level === "weak"   ? "25%"  :
                               strength.level === "fair"   ? "50%"  :
                               strength.level === "good"   ? "75%"  : "100%",
                        background: strength.color,
                        height: "100%",
                        borderRadius: "4px",
                        transition: "width 0.3s, background 0.3s",
                      }}
                    />
                  </div>
                  <span style={{ color: strength.color, fontSize: "12px", fontWeight: "600" }}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="auth-forgot__field">
              <label>Confirm Password</label>
              <div className="auth-forgot__input-wrap">
                <FiLock size={16} className="auth-forgot__input-icon" />
                <input
                  type={showConf ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReset()}
                />
                <button
                  className="auth-forgot__eye"
                  onClick={() => setShowConf(!showConf)}
                  type="button"
                >
                  {showConf ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
              {/* Match indicator */}
              {confirm && (
                <p style={{
                  fontSize: "12px",
                  color: password === confirm ? "#10b981" : "#e53e3e",
                  marginTop: "4px",
                }}>
                  {password === confirm ? "✓ Passwords match" : "✗ Passwords don't match"}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              className="auth-forgot__btn"
              onClick={handleReset}
              disabled={loading}
            >
              {loading ? (
                <span className="auth-form__loading">
                  <span className="auth-spinner" /> Resetting...
                </span>
              ) : (
                <>
                  <FiLock size={15} />
                  Reset Password
                </>
              )}
            </button>

            <Link to="/auth/login" className="auth-forgot__back">
              <FiArrowLeft size={14} />
              Back to Login
            </Link>
          </>
        ) : (
          // ── Success ──
          <motion.div
            className="auth-forgot__success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1    }}
          >
            <div className="auth-forgot__success-icon">✅</div>
            <h2>Password Reset!</h2>
            <p>Your password has been reset successfully.<br />
              Redirecting you to home page...</p>
            <div className="auth-spinner-large" />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}