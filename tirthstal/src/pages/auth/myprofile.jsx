import { useState } from "react";
import { Link }     from "react-router-dom";
import { motion }   from "framer-motion";
import {
  FiHome, FiChevronRight, FiEdit2, FiSave,
  FiUser, FiMail, FiPhone, FiMapPin,
  FiHeart, FiSettings, FiCamera, FiLock,
  FiGlobe, FiLogOut
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import "../../styles/pages/profilePage.css";

const tabs = [
  { id: "profile",   label: "My Profile",   icon: <FiUser />     },
  { id: "favorites", label: "Favorites",    icon: <FiHeart />    },
  { id: "settings",  label: "Settings",     icon: <FiSettings /> },
  { id: "security",  label: "Security",     icon: <FiLock />     },
];

const languages = ["English", "हिंदी", "मराठी", "ગુજરાતી"];

const visitedTemples = [
  { name: "Mahakaleshwar Temple", location: "Ujjain, MP",      date: "March 2026",  image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400" },
  { name: "Omkareshwar Temple",   location: "Khandwa, MP",     date: "January 2026",image: "https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=400" },
  { name: "Khajuraho Temples",    location: "Chhatarpur, MP",  date: "Dec 2025",    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400" },
];

export default function Profile() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [editing,   setEditing]   = useState(false);
  const [saved,     setSaved]     = useState(false);

  const [form, setForm] = useState({
    name:     user?.name     || "",
    email:    user?.email    || "",
    phone:    user?.phone    || "",
    city:     user?.city     || "",
    language: user?.language || "English",
    bio:      user?.bio      || "",
  });

  const handleChange = (field, val) =>
    setForm((p) => ({ ...p, [field]: val }));

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const userInitial = user?.name?.charAt(0).toUpperCase() || "U";
  const save = localStorage.setItem(form.name , form.email , form.bio)

  return (
    <div className="profile-page">

      {/* ── Breadcrumb ── */}
      <div className="profile-page__breadcrumb">
        <Link to="/"><FiHome size={13} /> Home</Link>
        <FiChevronRight size={13} />
        <span>My Profile</span>
      </div>

      <div className="profile-page__body">

        {/* ── Left Sidebar ── */}
        <aside className="profile-sidebar">

          {/* Avatar */}
          <div className="profile-sidebar__avatar-wrap">
            <div className="profile-sidebar__avatar">
              <span>{userInitial}</span>
            </div>
            <button className="profile-sidebar__avatar-edit">
              <FiCamera size={14} />
            </button>
          </div>

          {/* Name & Email */}
          <h2 className="profile-sidebar__name">{user?.name || "Devotee"}</h2>
          <p className="profile-sidebar__email">{user?.email || ""}</p>

          {/* Badge */}
          <span className="profile-sidebar__badge">🙏 Devotee</span>

          {/* Stats */}
          <div className="profile-sidebar__stats">
            <div className="profile-sidebar__stat">
              <span className="profile-sidebar__stat-num">12</span>
              <span className="profile-sidebar__stat-label">Temples Visited</span>
            </div>
            <div className="profile-sidebar__stat-divider" />
            <div className="profile-sidebar__stat">
              <span className="profile-sidebar__stat-num">8</span>
              <span className="profile-sidebar__stat-label">Favorites</span>
            </div>
            <div className="profile-sidebar__stat-divider" />
            <div className="profile-sidebar__stat">
              <span className="profile-sidebar__stat-num">3</span>
              <span className="profile-sidebar__stat-label">Reviews</span>
            </div>
          </div>

          {/* Tabs */}
          <nav className="profile-sidebar__nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`profile-sidebar__nav-item ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <button className="profile-sidebar__logout" onClick={logout}>
            <FiLogOut size={15} />
            Logout
          </button>

        </aside>

        {/* ── Main Content ── */}
        <main className="profile-main">

          {/* ══ TAB 1 — My Profile ══ */}
          {activeTab === "profile" && (
            <motion.div
              className="profile-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ duration: 0.3  }}
            >
              {/* Header */}
              <div className="profile-card__header">
                <h3 className="profile-card__title">Personal Information</h3>
                {editing ? (
                  <button className="profile-card__save-btn" onClick={handleSave}>
                    <FiSave size={15} /> Save Changes
                  </button>
                ) : (
                  <button className="profile-card__edit-btn" onClick={() => setEditing(true)}>
                    <FiEdit2 size={15} /> Edit Profile
                  </button>
                )}
              </div>

              {/* Success */}
              {saved && (
                <motion.div
                  className="profile-card__success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  ✅ Profile updated successfully!
                </motion.div>
              )}

              {/* Form */}
              <div className="profile-form">

                {/* Name + Email */}
                <div className="profile-form__row">
                  <div className="profile-form__field">
                    <label><FiUser size={13} /> Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      disabled={!editing}
                      className={editing ? "active" : ""}
                    />
                  </div>
                  <div className="profile-form__field">
                    <label><FiMail size={13} /> Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      disabled={!editing}
                      className={editing ? "active" : ""}
                    />
                  </div>
                </div>

                {/* Phone + City */}
                <div className="profile-form__row">
                  <div className="profile-form__field">
                    <label><FiPhone size={13} /> Phone Number</label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      disabled={!editing}
                      className={editing ? "active" : ""}
                    />
                  </div>
                  <div className="profile-form__field">
                    <label><FiMapPin size={13} /> City</label>
                    <input
                      type="text"
                      placeholder="Enter your city"
                      value={form.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      disabled={!editing}
                      className={editing ? "active" : ""}
                    />
                  </div>
                </div>

                {/* Language */}
                <div className="profile-form__field">
                  <label><FiGlobe size={13} /> Preferred Language</label>
                  <select
                    value={form.language}
                    onChange={(e) => handleChange("language", e.target.value)}
                    disabled={!editing}
                    className={editing ? "active" : ""}
                  >
                    {languages.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                {/* Bio */}
                <div className="profile-form__field">
                  <label><FiEdit2 size={13} /> Bio</label>
                  <textarea
                    placeholder="Write something about yourself..."
                    value={form.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    disabled={!editing}
                    className={editing ? "active" : ""}
                    rows={3}
                  />
                </div>

              </div>

              {/* Recently Visited */}
              <div className="profile-visited">
                <h4 className="profile-visited__title">Recently Visited Temples</h4>
                <div className="profile-visited__list">
                  {visitedTemples.map((t, i) => (
                    <div key={i} className="profile-visited__item">
                      <img src={t.image} alt={t.name}
                        onError={(e) => e.target.src = "https://images.unsplash.com/photo-1548013146-72479768bada?w=400"}
                      />
                      <div className="profile-visited__info">
                        <p className="profile-visited__name">{t.name}</p>
                        <p className="profile-visited__loc">
                          <FiMapPin size={11} /> {t.location}
                        </p>
                        <p className="profile-visited__date">{t.date}</p>
                      </div>
                      <Link
                        to={`/temples/${t.name.toLowerCase().replace(/ /g, "-")}`}
                        className="profile-visited__btn"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

          {/* ══ TAB 2 — Favorites ══ */}
          {activeTab === "favorites" && (
            <motion.div
              className="profile-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ duration: 0.3  }}
            >
              <div className="profile-card__header">
                <h3 className="profile-card__title">My Favorite Temples</h3>
                <span className="profile-card__count">8 temples</span>
              </div>

              <div className="profile-favorites__grid">
                {visitedTemples.map((t, i) => (
                  <div key={i} className="profile-fav-card">
                    <div className="profile-fav-card__img">
                      <img src={t.image} alt={t.name}
                        onError={(e) => e.target.src = "https://images.unsplash.com/photo-1548013146-72479768bada?w=400"}
                      />
                      <button className="profile-fav-card__remove">
                        <FiHeart size={14} />
                      </button>
                    </div>
                    <div className="profile-fav-card__info">
                      <p className="profile-fav-card__name">{t.name}</p>
                      <p className="profile-fav-card__loc">
                        <FiMapPin size={11} /> {t.location}
                      </p>
                      <Link
                        to={`/temples/${t.name.toLowerCase().replace(/ /g, "-")}`}
                        className="profile-fav-card__btn"
                      >
                        View Temple
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

            </motion.div>
          )}

          {/* ══ TAB 3 — Settings ══ */}
          {activeTab === "settings" && (
            <motion.div
              className="profile-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ duration: 0.3  }}
            >
              <div className="profile-card__header">
                <h3 className="profile-card__title">Settings</h3>
              </div>

              <div className="profile-settings">

                {/* Notifications */}
                <div className="profile-settings__section">
                  <h4>🔔 Notifications</h4>
                  {[
                    { label: "Festival Reminders",    sub: "Get notified about upcoming festivals" },
                    { label: "New Temple Added",      sub: "When a new temple is added in your area" },
                    { label: "Review Replies",        sub: "When someone replies to your review" },
                    { label: "Weekly Newsletter",     sub: "Weekly digest of temple news" },
                  ].map((item, i) => (
                    <div key={i} className="profile-settings__toggle-row">
                      <div>
                        <p className="profile-settings__toggle-label">{item.label}</p>
                        <p className="profile-settings__toggle-sub">{item.sub}</p>
                      </div>
                      <label className="profile-settings__toggle">
                        <input type="checkbox" defaultChecked={i < 2} />
                        <span className="profile-settings__toggle-slider" />
                      </label>
                    </div>
                  ))}
                </div>

                {/* Privacy */}
                <div className="profile-settings__section">
                  <h4>🔒 Privacy</h4>
                  {[
                    { label: "Show my favorites publicly",  sub: "Others can see your saved temples" },
                    { label: "Show my reviews publicly",    sub: "Your reviews are visible to all"   },
                  ].map((item, i) => (
                    <div key={i} className="profile-settings__toggle-row">
                      <div>
                        <p className="profile-settings__toggle-label">{item.label}</p>
                        <p className="profile-settings__toggle-sub">{item.sub}</p>
                      </div>
                      <label className="profile-settings__toggle">
                        <input type="checkbox" defaultChecked />
                        <span className="profile-settings__toggle-slider" />
                      </label>
                    </div>
                  ))}
                </div>

                {/* Danger Zone */}
                <div className="profile-settings__section profile-settings__danger">
                  <h4>⚠️ Danger Zone</h4>
                  <button className="profile-settings__delete-btn">
                    Delete My Account
                  </button>
                </div>

              </div>
            </motion.div>
          )}

          {/* ══ TAB 4 — Security ══ */}
          {activeTab === "security" && (
            <motion.div
              className="profile-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ duration: 0.3  }}
            >
              <div className="profile-card__header">
                <h3 className="profile-card__title">Security</h3>
              </div>

              <div className="profile-security">

                {/* Change Password */}
                <div className="profile-security__section">
                  <h4>🔑 Change Password</h4>
                  <div className="profile-form__field">
                    <label>Current Password</label>
                    <input type="password" placeholder="Enter current password"/>
                  </div>
                  <div className="profile-form__field">
                    <label>New Password</label>
                    <input type="password" placeholder="Enter new password" />
                  </div>
                  <div className="profile-form__field">
                    <label>Confirm New Password</label>
                    <input type="password" placeholder="Confirm new password" />
                  </div>
                  <button className="profile-security__save-btn">
                    Update Password
                  </button>
                </div>

                {/* Login Activity */}
                <div className="profile-security__section">
                  <h4>📱 Recent Login Activity</h4>
                  {[
                    { device: "Chrome on Windows",  location: "Ujjain, India", time: "Today, 10:30 AM",    current: true  },
                    { device: "Safari on iPhone",   location: "Indore, India", time: "Yesterday, 8:15 PM", current: false },
                    { device: "Firefox on Windows", location: "Bhopal, India", time: "May 28, 2:00 PM",    current: false },
                  ].map((item, i) => (
                    <div key={i} className="profile-security__activity">
                      <div className="profile-security__activity-icon">
                        {item.current ? "💻" : "📱"}
                      </div>
                      <div className="profile-security__activity-info">
                        <p className="profile-security__activity-device">
                          {item.device}
                          {item.current && (
                            <span className="profile-security__activity-current">Current</span>
                          )}
                        </p>
                        <p className="profile-security__activity-meta">
                          {item.location} • {item.time}
                        </p>
                      </div>
                      {!item.current && (
                        <button className="profile-security__activity-revoke">
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            </motion.div>
          )}

        </main>
      </div>
    </div>
  );
}