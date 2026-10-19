import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome, FiChevronRight, FiSearch, FiMapPin, FiHeart,
  FiChevronDown, FiRefreshCw, FiArrowRight, FiPhone, FiMail,
  FiClock, FiCheckCircle, FiX, FiSend, FiCalendar,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { sevaTypes, gosevaFaqs } from "../../data/gaushalas";
import {
  getGaushalas, getGosevaStats, createPledge, getMyPledges,
} from "../../services/gosevaService";
import "../../styles/pages/goseva.css";

const NEEDS = ["All Needs", "Fodder", "Medical", "Shelter", "Volunteers", "Funds"];
const AMOUNT_PRESETS = [251, 501, 1100, 2100, 5100, 11000];
const FAV_KEY = "tirthstal_goseva_favs";

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const num = (n) => Number(n || 0).toLocaleString("en-IN");
const sevaLabel = (key) =>
  sevaTypes.find((s) => s.key === key)?.title || "Goseva";

const howHelps = [
  { icon: "🌾", title: "Daily Fodder", sub: "₹60 feeds one cow for a full day" },
  { icon: "💉", title: "Medical Care", sub: "Treatment for injured & rescued cows" },
  { icon: "🏠", title: "Safe Shelter", sub: "Sheds, clean water and resting space" },
  { icon: "🐄", title: "Calf Care", sub: "Milk and care for orphaned calves" },
];

function Dropdown({ value, options, open, setOpen, onSelect }) {
  return (
    <div className="gs-filter__dropdown" onClick={() => setOpen(!open)}>
      <span>{value}</span>
      <FiChevronDown size={13} className={`gs-filter__arrow ${open ? "open" : ""}`} />
      {open && (
        <ul className="gs-filter__list">
          {options.map((o) => (
            <li
              key={o}
              className={value === o ? "selected" : ""}
              onClick={(e) => { e.stopPropagation(); onSelect(o); setOpen(false); }}
            >
              {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const emptyForm = (user) => ({
  name: user?.name || "",
  email: user?.email || "",
  phone: "",
  gaushalaSlug: "",
  sevaType: "donation",
  amount: 1100,
  preferredDate: "",
  message: "",
});

export default function Goseva() {
  const { user, isLoggedIn } = useAuth();

  const [gaushalas, setGaushalas] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selState, setSelState] = useState("All States");
  const [selNeed, setSelNeed] = useState("All Needs");
  const [stateOpen, setStateOpen] = useState(false);
  const [needOpen, setNeedOpen] = useState(false);
  const [visible, setVisible] = useState(6);
  const [selected, setSelected] = useState(null); // detail modal

  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; }
    catch { return []; }
  });

  const [form, setForm] = useState(() => emptyForm(user));
  const [gaushalaOpen, setGaushalaOpen] = useState(false);
  const [sevaOpen, setSevaOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(null); // { offline, pledge }

  const [myPledges, setMyPledges] = useState([]);
  const [faqOpen, setFaqOpen] = useState(0);

  /* ── Load directory + stats (API → local fallback inside service) ── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [list, st] = await Promise.all([getGaushalas(), getGosevaStats()]);
      if (cancelled) return;
      setGaushalas(list.gaushalas);
      setStats(st);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  /* ── My pledges (server + offline ones saved on this device) ── */
  const refreshPledges = async () => setMyPledges(await getMyPledges());
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const pledges = await getMyPledges();
      if (!cancelled) setMyPledges(pledges);
    })();
    return () => { cancelled = true; };
  }, []);

  /* ── Persist favourite gaushalas ── */
  useEffect(() => {
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
  }, [favorites]);

  /* ── Lock body scroll when detail modal is open ── */
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  const states = useMemo(
    () => ["All States", ...new Set(gaushalas.map((g) => g.state).filter(Boolean))],
    [gaushalas]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return gaushalas.filter((g) => {
      const ms = !q ||
        g.name.toLowerCase().includes(q) ||
        (g.location || "").toLowerCase().includes(q) ||
        (g.district || "").toLowerCase().includes(q);
      const mst = selState === "All States" || g.state === selState;
      const mn = selNeed === "All Needs" || (g.needs || []).includes(selNeed);
      return ms && mst && mn;
    });
  }, [gaushalas, search, selState, selNeed]);

  const displayStats = stats || {
    totalGaushalas: gaushalas.length,
    totalCows: gaushalas.reduce((s, g) => s + (g.cowsCount || 0), 0),
    totalPledges: myPledges.length,
    volunteers: myPledges.filter((p) => p.sevaType === "volunteer").length,
  };

  const topGaushalas = useMemo(
    () => [...gaushalas].sort((a, b) => (b.cowsCount || 0) - (a.cowsCount || 0)).slice(0, 4),
    [gaushalas]
  );

  const selectedGaushalaName = form.gaushalaSlug
    ? gaushalas.find((g) => g.slug === form.gaushalaSlug)?.name
    : null;
  const selectedSeva = sevaTypes.find((s) => s.key === form.sevaType);
  const isVolunteer = form.sevaType === "volunteer";

  const toggleFav = (slug) =>
    setFavorites((p) => (p.includes(slug) ? p.filter((f) => f !== slug) : [...p, slug]));

  const scrollToForm = () =>
    document.getElementById("seva-form")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const offerSeva = (gaushala) => {
    setForm((f) => ({ ...f, gaushalaSlug: gaushala?.slug || "" }));
    setSelected(null);
    scrollToForm();
  };

  const pickSevaType = (seva) => {
    setForm((f) => ({
      ...f,
      sevaType: seva.key,
      amount: seva.key === "volunteer" ? 0 : (seva.suggested || f.amount),
    }));
    scrollToForm();
  };

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const resetFilters = () => {
    setSearch("");
    setSelState("All States");
    setSelNeed("All Needs");
    setVisible(6);
  };

  const handleSubmit = async () => {
    setFormError("");

    if (form.name.trim().length < 2) return setFormError("Please enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setFormError("Please enter a valid email address.");
    if (form.phone && !/^[+\d][\d\s-]{9,15}$/.test(form.phone.trim()))
      return setFormError("Please enter a valid phone number.");
    if (form.sevaType === "donation" && !(Number(form.amount) >= 1))
      return setFormError("Please enter a donation amount (minimum ₹1).");
    if (isVolunteer && !form.preferredDate)
      return setFormError("Please pick a preferred date for volunteering.");

    setSubmitting(true);
    try {
      const gaushala = gaushalas.find((g) => g.slug === form.gaushalaSlug);
      const result = await createPledge({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        gaushalaSlug: form.gaushalaSlug || undefined,
        gaushalaName: gaushala?.name || "Any Gaushala",
        sevaType: form.sevaType,
        amount: isVolunteer ? 0 : Number(form.amount) || 0,
        preferredDate: form.preferredDate || undefined,
        message: form.message.trim() || undefined,
      });
      setSubmitted(result);
      setForm(emptyForm(user));
      await refreshPledges();
    } catch (err) {
      setFormError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gs-page">

      {/* ── Breadcrumb ── */}
      <div className="gs-page__breadcrumb">
        <Link to="/"><FiHome size={13} /> Home</Link>
        <FiChevronRight size={13} />
        <span>Goseva</span>
      </div>

      {/* ── Hero ── */}
      <div className="gs-page__hero">
        <img
          src="/images/goseva/gaushala-hero.jpg"
          className="gs-page__hero-bg"
          alt="Gaushala at sunrise"
          onError={(e) => { e.target.src = "/images/placeholder-temple.jpg"; }}
        />
        <div className="gs-page__hero-overlay" />
        <div className="gs-page__hero-left">
          <motion.h1
            className="gs-page__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Goseva <span className="gs-page__title-hi">गौसेवा</span>
          </motion.h1>
          <motion.p
            className="gs-page__sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            "गावो विश्वस्य मातरः" — the cow is the mother of the world.
            Feed, shelter and heal Gau Mata at verified gaushalas near
            the sacred temples of India.
          </motion.p>
          <motion.div
            className="gs-page__hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <button className="gs-btn gs-btn--primary" onClick={() => offerSeva(null)}>
              🙏 Offer Seva
            </button>
            <a href="#gaushalas" className="gs-btn gs-btn--ghost">
              Explore Gaushalas <FiArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </div>

      {/* ── Stats Band ── */}
      <div className="gs-stats">
        <div className="gs-stat">
          <span className="gs-stat__icon">🏠</span>
          <div>
            <p className="gs-stat__num">{num(displayStats.totalGaushalas)}</p>
            <p className="gs-stat__label">Gaushalas Listed</p>
          </div>
        </div>
        <div className="gs-stat">
          <span className="gs-stat__icon">🐄</span>
          <div>
            <p className="gs-stat__num">{num(displayStats.totalCows)}+</p>
            <p className="gs-stat__label">Cows Sheltered</p>
          </div>
        </div>
        <div className="gs-stat">
          <span className="gs-stat__icon">🙏</span>
          <div>
            <p className="gs-stat__num">{num(displayStats.totalPledges)}</p>
            <p className="gs-stat__label">Seva Pledges</p>
          </div>
        </div>
        <div className="gs-stat">
          <span className="gs-stat__icon">🙋</span>
          <div>
            <p className="gs-stat__num">{num(displayStats.volunteers)}</p>
            <p className="gs-stat__label">Volunteers</p>
          </div>
        </div>
      </div>

      {/* ── Ways to Serve ── */}
      <div className="gs-section-head">
        <h2 className="gs-section-title">Ways to Serve Gau Mata</h2>
        <p className="gs-section-sub">Choose a seva — the form below will be filled for you.</p>
      </div>
      <div className="gs-seva-grid">
        {sevaTypes.map((seva, i) => (
          <motion.button
            type="button"
            key={seva.key}
            className={`gs-seva-card ${form.sevaType === seva.key ? "active" : ""}`}
            onClick={() => pickSevaType(seva)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            whileHover={{ y: -4 }}
          >
            <span className="gs-seva-card__icon">{seva.icon}</span>
            <span className="gs-seva-card__title">{seva.title}</span>
            <span className="gs-seva-card__subtitle">{seva.subtitle}</span>
            <span className="gs-seva-card__desc">{seva.desc}</span>
            {seva.suggested > 0 && (
              <span className="gs-seva-card__amount">from {inr(seva.suggested)}</span>
            )}
          </motion.button>
        ))}
      </div>

      {/* ── Filter Bar ── */}
      <div className="gs-filter" id="gaushalas">
        <div className="gs-filter__search">
          <FiSearch size={15} />
          <input
            type="text"
            placeholder="Search gaushalas, cities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Dropdown value={selState} options={states} open={stateOpen} setOpen={setStateOpen} onSelect={setSelState} />
        <Dropdown value={selNeed} options={NEEDS} open={needOpen} setOpen={setNeedOpen} onSelect={setSelNeed} />
        <button className="gs-filter__reset-btn" onClick={resetFilters}>
          <FiRefreshCw size={13} /> Reset
        </button>
      </div>

      {/* ── Body: Directory + Sidebar ── */}
      <div className="gs-page__body">
        <div className="gs-page__main">
          <div className="gs-section-head gs-section-head--row">
            <h2 className="gs-section-title">Gaushala Directory</h2>
            <span className="gs-count">{filtered.length} gaushala{filtered.length === 1 ? "" : "s"}</span>
          </div>

          {loading ? (
            <div className="gs-empty">🐄 Loading gaushalas…</div>
          ) : filtered.length === 0 ? (
            <div className="gs-empty">
              <p>No gaushalas match your filters.</p>
              <button className="gs-btn gs-btn--primary" onClick={resetFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="gs-grid">
              {filtered.slice(0, visible).map((g, i) => (
                <motion.article
                  key={g.slug}
                  className="gs-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="gs-card__img-wrap">
                    <img
                      src={g.image}
                      alt={g.name}
                      className="gs-card__img"
                      loading="lazy"
                      onError={(e) => { e.target.src = "/images/placeholder-temple.jpg"; }}
                    />
                    <span className="gs-card__cows-badge">🐄 {num(g.cowsCount)} cows</span>
                    {g.isVerified && (
                      <span className="gs-card__verified"><FiCheckCircle size={11} /> Verified</span>
                    )}
                    <button
                      type="button"
                      aria-label="Save gaushala"
                      className={`gs-card__fav ${favorites.includes(g.slug) ? "active" : ""}`}
                      onClick={() => toggleFav(g.slug)}
                    >
                      <FiHeart size={14} />
                    </button>
                  </div>

                  <div className="gs-card__info">
                    <h3 className="gs-card__name">{g.name}</h3>
                    <div className="gs-card__location">
                      <FiMapPin size={11} />
                      <span>{g.location}</span>
                      {g.established && <span className="gs-card__est">· Since {g.established}</span>}
                    </div>

                    {(g.needs || []).length > 0 && (
                      <div className="gs-card__needs">
                        {g.needs.slice(0, 3).map((n) => (
                          <span key={n} className="gs-need-chip">{n}</span>
                        ))}
                      </div>
                    )}

                    <div className="gs-card__actions">
                      <button type="button" className="gs-card__btn gs-card__btn--ghost" onClick={() => setSelected(g)}>
                        Details
                      </button>
                      <button type="button" className="gs-card__btn gs-card__btn--primary" onClick={() => offerSeva(g)}>
                        Offer Seva
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {visible < filtered.length && (
            <div className="gs-page__load-more">
              <button onClick={() => setVisible((v) => v + 6)}>
                Load More <FiChevronDown size={15} />
              </button>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <aside className="gs-page__sidebar">
          <div className="gs-sidebar__box">
            <h3 className="gs-sidebar__title">How Your Seva Helps</h3>
            <div className="gs-sidebar__list">
              {howHelps.map((h) => (
                <div key={h.title} className="gs-sidebar__item">
                  <span className="gs-sidebar__item-icon">{h.icon}</span>
                  <div>
                    <p className="gs-sidebar__item-name">{h.title}</p>
                    <p className="gs-sidebar__item-sub">{h.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="gs-sidebar__box">
            <h3 className="gs-sidebar__title">Largest Herds</h3>
            <div className="gs-sidebar__list">
              {topGaushalas.map((g) => (
                <button
                  type="button"
                  key={g.slug}
                  className="gs-sidebar__item gs-sidebar__item--btn"
                  onClick={() => setSelected(g)}
                >
                  <span className="gs-sidebar__item-icon">🐄</span>
                  <div>
                    <p className="gs-sidebar__item-name">{g.name}</p>
                    <p className="gs-sidebar__item-sub">{g.location} · {num(g.cowsCount)} cows</p>
                  </div>
                  <FiChevronRight size={15} className="gs-sidebar__arrow" />
                </button>
              ))}
            </div>
          </div>

          <div className="gs-sidebar__box gs-sidebar__rescue">
            <div className="gs-sidebar__rescue-icon">🚑</div>
            <h3>Found an Injured Cow?</h3>
            <p>
              Many gaushalas run 24×7 rescue vans. Pick the nearest gaushala
              from the directory and call them with the exact location.
            </p>
            <a href="#gaushalas" className="gs-btn gs-btn--primary">Find Nearest Gaushala</a>
          </div>
        </aside>
      </div>

      {/* ── Seva Pledge Form ── */}
      <div className="gs-form-section" id="seva-form">
        <div className="gs-form-section__info">
          <h2 className="gs-section-title">Offer Your Seva 🙏</h2>
          <p>
            Fill this sankalp (pledge) form and we will record your seva with
            the gaushala. They will contact you to complete it — for donations
            they share official payment details, for volunteering they confirm
            your visit.
          </p>
          <ul className="gs-form-section__points">
            <li><FiCheckCircle size={14} /> No advance payment is taken on this website</li>
            <li><FiCheckCircle size={14} /> The gaushala confirms every pledge personally</li>
            <li><FiCheckCircle size={14} /> Guests can pledge too — login only saves your history</li>
          </ul>
          {!isLoggedIn && (
            <p className="gs-form-section__login">
              Already have an account? <Link to="/auth/login">Login</Link> to track your sevas.
            </p>
          )}
        </div>

        <div className="gs-form">
          <h3 className="gs-form__title">Seva Sankalp Form</h3>

          {submitted ? (
            <motion.div
              className="gs-form__success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="gs-form__success-icon">🙏</div>
              <h4>Dhanyavaad! Your seva pledge is recorded.</h4>
              <p>
                <strong>{sevaLabel(submitted.pledge.sevaType)}</strong>
                {submitted.pledge.amount > 0 && <> of <strong>{inr(submitted.pledge.amount)}</strong></>}
                {" "}for <strong>{submitted.pledge.gaushalaName || "Any Gaushala"}</strong>.
                The gaushala team will reach out to you shortly.
              </p>
              {submitted.offline && (
                <p className="gs-form__offline-note">
                  ℹ️ Our server could not be reached, so this pledge is saved on
                  this device. Please also contact the gaushala directly if possible.
                </p>
              )}
              <button className="gs-btn gs-btn--primary" onClick={() => setSubmitted(null)}>
                Offer Another Seva
              </button>
            </motion.div>
          ) : (
            <>
              <div className="gs-form__row">
                <div className="gs-form__field">
                  <label>Your Name <span>*</span></label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                  />
                </div>
                <div className="gs-form__field">
                  <label>Email Address <span>*</span></label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                  />
                </div>
              </div>

              <div className="gs-form__row">
                <div className="gs-form__field">
                  <label>Phone (WhatsApp)</label>
                  <input
                    type="tel"
                    placeholder="+91 …"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                  />
                </div>
                <div className="gs-form__field">
                  <label>Select Gaushala</label>
                  <div className="gs-form__select" onClick={() => setGaushalaOpen(!gaushalaOpen)}>
                    <span className={selectedGaushalaName ? "" : "placeholder"}>
                      {selectedGaushalaName || "Any Gaushala (where most needed)"}
                    </span>
                    <FiChevronDown size={14} className={`gs-form__select-arrow ${gaushalaOpen ? "open" : ""}`} />
                    {gaushalaOpen && (
                      <ul className="gs-form__select-list">
                        <li
                          className={!form.gaushalaSlug ? "selected" : ""}
                          onClick={(e) => { e.stopPropagation(); setField("gaushalaSlug", ""); setGaushalaOpen(false); }}
                        >
                          Any Gaushala (where most needed)
                        </li>
                        {gaushalas.map((g) => (
                          <li
                            key={g.slug}
                            className={form.gaushalaSlug === g.slug ? "selected" : ""}
                            onClick={(e) => { e.stopPropagation(); setField("gaushalaSlug", g.slug); setGaushalaOpen(false); }}
                          >
                            {g.name} — {g.location}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div className="gs-form__field">
                <label>Type of Seva <span>*</span></label>
                <div className="gs-form__select" onClick={() => setSevaOpen(!sevaOpen)}>
                  <span>{selectedSeva ? `${selectedSeva.icon} ${selectedSeva.title} — ${selectedSeva.subtitle}` : "Select seva"}</span>
                  <FiChevronDown size={14} className={`gs-form__select-arrow ${sevaOpen ? "open" : ""}`} />
                  {sevaOpen && (
                    <ul className="gs-form__select-list">
                      {sevaTypes.map((s) => (
                        <li
                          key={s.key}
                          className={form.sevaType === s.key ? "selected" : ""}
                          onClick={(e) => {
                            e.stopPropagation();
                            setForm((f) => ({
                              ...f,
                              sevaType: s.key,
                              amount: s.key === "volunteer" ? 0 : (s.suggested || f.amount),
                            }));
                            setSevaOpen(false);
                          }}
                        >
                          {s.icon} {s.title} — {s.subtitle}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {!isVolunteer ? (
                <div className="gs-form__field">
                  <label>Seva Amount (₹) {form.sevaType === "donation" && <span>*</span>}</label>
                  <div className="gs-amount-chips">
                    {AMOUNT_PRESETS.map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        className={`gs-amount-chip ${Number(form.amount) === amt ? "active" : ""}`}
                        onClick={() => setField("amount", amt)}
                      >
                        {inr(amt)}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="0"
                    placeholder="Or enter your own amount"
                    value={form.amount}
                    onChange={(e) => setField("amount", e.target.value)}
                  />
                </div>
              ) : (
                <div className="gs-form__field">
                  <label>Preferred Visit Date <span>*</span></label>
                  <input
                    type="date"
                    value={form.preferredDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setField("preferredDate", e.target.value)}
                  />
                </div>
              )}

              <div className="gs-form__field">
                <label>Message / Sankalp (optional)</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Seva in memory of…, on the occasion of…"
                  value={form.message}
                  onChange={(e) => setField("message", e.target.value)}
                />
              </div>

              {formError && (
                <motion.div className="gs-form__error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  ⚠️ {formError}
                </motion.div>
              )}

              <button className="gs-form__submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Recording your seva…" : (<><FiSend size={15} /> Submit Seva Sankalp</>)}
              </button>
              <p className="gs-form__note">
                This records your pledge only — no payment is collected here.
                The gaushala will contact you to complete the seva. 🙏
              </p>
            </>
          )}
        </div>
      </div>

      {/* ── My Pledges ── */}
      {myPledges.length > 0 && (
        <div className="gs-my-pledges">
          <h2 className="gs-section-title">My Seva Pledges</h2>
          <div className="gs-pledge-list">
            {myPledges.map((p) => (
              <div key={p._id} className="gs-pledge-item">
                <span className="gs-pledge-item__icon">
                  {sevaTypes.find((s) => s.key === p.sevaType)?.icon || "🙏"}
                </span>
                <div className="gs-pledge-item__info">
                  <p className="gs-pledge-item__name">
                    {sevaLabel(p.sevaType)}
                    {p.amount > 0 && <> · {inr(p.amount)}</>}
                  </p>
                  <p className="gs-pledge-item__sub">
                    {p.gaushalaName || "Any Gaushala"} ·{" "}
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
                  </p>
                </div>
                <span className={`gs-pledge-status gs-pledge-status--${p.status || "pending"}`}>
                  {p.offline ? "Saved offline" : (p.status || "pending")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FAQ ── */}
      <div className="gs-faq">
        <h2 className="gs-section-title">Goseva — Common Questions</h2>
        <div className="gs-faq__list">
          {gosevaFaqs.map((f, i) => (
            <div key={f.q} className={`gs-faq__item ${faqOpen === i ? "open" : ""}`}>
              <button type="button" className="gs-faq__q" onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}>
                <span>{f.q}</span>
                <FiChevronDown size={16} className="gs-faq__arrow" />
              </button>
              <AnimatePresence initial={false}>
                {faqOpen === i && (
                  <motion.div
                    className="gs-faq__a"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p>{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* ── Gaushala Detail Modal ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="gs-modal__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="gs-modal"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button type="button" className="gs-modal__close" aria-label="Close" onClick={() => setSelected(null)}>
                <FiX size={18} />
              </button>
              <div className="gs-modal__img-wrap">
                <img
                  src={selected.image}
                  alt={selected.name}
                  onError={(e) => { e.target.src = "/images/placeholder-temple.jpg"; }}
                />
                {selected.isVerified && (
                  <span className="gs-card__verified"><FiCheckCircle size={11} /> Verified</span>
                )}
              </div>
              <div className="gs-modal__body">
                <h3 className="gs-modal__name">{selected.name}</h3>
                <div className="gs-modal__meta">
                  <span><FiMapPin size={12} /> {selected.location}</span>
                  <span>🐄 {num(selected.cowsCount)} cows</span>
                  {selected.established && <span><FiCalendar size={12} /> Since {selected.established}</span>}
                  {selected.visitingHours && <span><FiClock size={12} /> {selected.visitingHours}</span>}
                </div>
                {selected.description && <p className="gs-modal__desc">{selected.description}</p>}

                {(selected.facilities || []).length > 0 && (
                  <>
                    <h4 className="gs-modal__subtitle">Facilities</h4>
                    <div className="gs-modal__chips">
                      {selected.facilities.map((f) => (
                        <span key={f} className="gs-chip">{f}</span>
                      ))}
                    </div>
                  </>
                )}

                {(selected.needs || []).length > 0 && (
                  <>
                    <h4 className="gs-modal__subtitle">Currently Needs</h4>
                    <div className="gs-modal__chips">
                      {selected.needs.map((n) => (
                        <span key={n} className="gs-need-chip">{n}</span>
                      ))}
                    </div>
                  </>
                )}

                {selected.address && <p className="gs-modal__address">📍 {selected.address}</p>}
                {selected.contact?.phone && (
                  <p className="gs-modal__contact"><FiPhone size={13} /> {selected.contact.phone}</p>
                )}
                {selected.contact?.email && (
                  <p className="gs-modal__contact"><FiMail size={13} /> {selected.contact.email}</p>
                )}

                <button type="button" className="gs-btn gs-btn--primary gs-modal__cta" onClick={() => offerSeva(selected)}>
                  🙏 Offer Seva Here
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
