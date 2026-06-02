import React, { useState } from "react";
import "./dashboard.css";

const initialTemples = [
  {
    id: 1, name: "Kashi Vishwanath", city: "Varanasi", district: "Varanasi",
    state: "Uttar Pradesh", deity: "Lord Shiva", openTime: "04:00", closeTime: "23:00",
    facilities: ["Parking", "Prasad Counter", "Drinking Water"],
    website: "https://shrikashivishwanath.org", status: "published",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Kashi_Vishwanath_Temple.jpg/320px-Kashi_Vishwanath_Temple.jpg",
    addedOn: "Jan 12, 2025",
  },
  {
    id: 2, name: "Somnath Temple", city: "Somnath", district: "Gir Somnath",
    state: "Gujarat", deity: "Lord Shiva", openTime: "06:00", closeTime: "21:30",
    facilities: ["Parking", "Dharamshala", "Toilet", "Medical Aid"],
    website: "https://somnath.org", status: "published",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Somnath_temple_at_dusk.jpg/320px-Somnath_temple_at_dusk.jpg",
    addedOn: "Jan 18, 2025",
  },
  {
    id: 3, name: "Tirupati Balaji", city: "Tirupati", district: "Tirupati",
    state: "Andhra Pradesh", deity: "Lord Vishnu", openTime: "05:30", closeTime: "21:00",
    facilities: ["Parking", "Prasad Counter", "Guest House", "Annadanam"],
    website: "https://tirumala.org", status: "draft",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Tirumala_Venkateswara_Temple_Tirupati.jpg/320px-Tirumala_Venkateswara_Temple_Tirupati.jpg",
    addedOn: "Feb 2, 2025",
  },
  {
    id: 4, name: "Meenakshi Amman", city: "Madurai", district: "Madurai",
    state: "Tamil Nadu", deity: "Goddess Meenakshi", openTime: "05:00", closeTime: "21:30",
    facilities: ["Parking", "Shoe Stand", "Drinking Water", "Library"],
    website: "https://maduraimeenakshi.org", status: "published",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Meenakshi_Amman_Temple.jpg/320px-Meenakshi_Amman_Temple.jpg",
    addedOn: "Feb 10, 2025",
  },
  {
    id: 5, name: "Jagannath Puri", city: "Puri", district: "Puri",
    state: "Odisha", deity: "Lord Jagannath", openTime: "05:00", closeTime: "22:00",
    facilities: ["Parking", "Prasad Counter", "Dharamshala"],
    website: "https://jagannath.nic.in", status: "draft",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Puri_jagannath_temple.jpg/320px-Puri_jagannath_temple.jpg",
    addedOn: "Feb 20, 2025",
  },
];

const stats = [
  { label: "Total Temples", value: 24, icon: "🛕", color: "#f4a261" },
  { label: "Deities Listed", value: 108, icon: "ॐ", color: "#c296ff" },
  { label: "Festivals", value: 36, icon: "✨", color: "#35f79c" },
  { label: "Visitors Today", value: 1842, icon: "🙏", color: "#60c7f7" },
];

const EditModal = ({ temple, onSave, onClose }) => {
  const [form, setForm] = useState({ ...temple });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">✏️ Edit Temple</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-grid">
            <div className="field"><label>Temple Name</label><input name="name" value={form.name} onChange={handleChange} /></div>
            <div className="field"><label>Deity</label><input name="deity" value={form.deity} onChange={handleChange} /></div>
            <div className="field"><label>City</label><input name="city" value={form.city} onChange={handleChange} /></div>
            <div className="field"><label>District</label><input name="district" value={form.district} onChange={handleChange} /></div>
            <div className="field"><label>State</label><input name="state" value={form.state} onChange={handleChange} /></div>
            <div className="field"><label>Website</label><input name="website" value={form.website} onChange={handleChange} /></div>
            <div className="field"><label>Open Time</label><input type="time" name="openTime" value={form.openTime} onChange={handleChange} /></div>
            <div className="field"><label>Close Time</label><input type="time" name="closeTime" value={form.closeTime} onChange={handleChange} /></div>
          </div>
          <div className="field" style={{ marginTop: 12 }}>
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={() => onSave(form)}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirm = ({ temple, onConfirm, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal small" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2 className="modal-title">🗑️ Delete Temple</h2>
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>
      <div className="modal-body">
        <p className="delete-msg">Are you sure you want to delete <strong>{temple.name}</strong>? This action cannot be undone.</p>
      </div>
      <div className="modal-footer">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-delete" onClick={() => onConfirm(temple.id)}>Yes, Delete</button>
      </div>
    </div>
  </div>
);

const DetailDrawer = ({ temple, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="drawer" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2 className="modal-title">🛕 Temple Details</h2>
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>
      <div className="drawer-body">
        <img src={temple.image} alt={temple.name} className="drawer-img" onError={(e) => e.target.style.display = "none"} />
        <h3 className="drawer-name">{temple.name}</h3>
        <span className={`status-badge ${temple.status}`}>{temple.status === "published" ? "● Live" : "○ Draft"}</span>
        <div className="drawer-grid">
          <div className="drawer-field"><span>Deity</span><strong>{temple.deity}</strong></div>
          <div className="drawer-field"><span>City</span><strong>{temple.city}</strong></div>
          <div className="drawer-field"><span>District</span><strong>{temple.district}</strong></div>
          <div className="drawer-field"><span>State</span><strong>{temple.state}</strong></div>
          <div className="drawer-field"><span>Opens</span><strong>{temple.openTime}</strong></div>
          <div className="drawer-field"><span>Closes</span><strong>{temple.closeTime}</strong></div>
          <div className="drawer-field"><span>Added On</span><strong>{temple.addedOn}</strong></div>
          <div className="drawer-field full"><span>Website</span><a href={temple.website} target="_blank" rel="noreferrer">{temple.website}</a></div>
          <div className="drawer-field full"><span>Facilities</span>
            <div className="facility-tags">{temple.facilities.map((f) => <span key={f} className="fac-tag">{f}</span>)}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [temples, setTemples] = useState(initialTemples);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (updated) => {
    setTemples((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setEditTarget(null);
    showToast("Temple updated successfully!");
  };

  const handleDelete = (id) => {
    setTemples((prev) => prev.filter((t) => t.id !== id));
    setDeleteTarget(null);
    showToast("Temple deleted.", "error");
  };

  const filtered = temples.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.city.toLowerCase().includes(search.toLowerCase()) ||
      t.state.toLowerCase().includes(search.toLowerCase()) ||
      t.deity.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="dash">
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      <div className="dash-greeting">
        <div className="greeting-left">
          <p className="greeting-sub">🙏 Jai Shri Ram • Welcome back</p>
          <h1 className="greeting-title">Temple Admin <span className="accent">Dashboard</span></h1>
          <p className="greeting-desc">Manage temples, deities, and festivals from one place.</p>
        </div>
        <div className="greeting-mandala" aria-hidden="true">
          <div className="mandala-ring r1" /><div className="mandala-ring r2" />
          <div className="mandala-ring r3" /><div className="mandala-center">ॐ</div>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={s.label} style={{ "--delay": `${i * 0.08}s`, "--accent": s.color }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value.toLocaleString()}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-glow" />
          </div>
        ))}
      </div>

      <div className="dash-card">
        <div className="table-topbar">
          <div className="table-title-group">
            <h2 className="card-title">All Temples</h2>
            <span className="count-badge">{filtered.length}</span>
          </div>
          <div className="table-controls">
            <div className="search-wrap">
              <span className="search-ico">🔍</span>
              <input className="table-search" placeholder="Search by name, city, deity..."
                value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="filter-pills">
              {["all", "published", "draft"].map((f) => (
                <button key={f} className={`filter-pill ${filterStatus === f ? "active" : ""}`}
                  onClick={() => setFilterStatus(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="table-wrap">
          <table className="dash-table full-table">
            <thead>
              <tr>
                <th>Temple</th><th>Location</th><th>Deity</th>
                <th>Timings</th><th>Facilities</th><th>Added On</th>
                <th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="empty-row">No temples found.</td></tr>
              ) : filtered.map((t) => (
                <tr key={t.id} className="table-row">
                  <td>
                    <div className="temple-cell">
                      <img src={t.image} alt={t.name} className="temple-thumb"
                        onError={(e) => e.target.style.display = "none"} />
                      <span className="temple-name">{t.name}</span>
                    </div>
                  </td>
                  <td className="muted">{t.city}, {t.state}</td>
                  <td className="muted">{t.deity}</td>
                  <td className="muted">{t.openTime} – {t.closeTime}</td>
                  <td>
                    <div className="fac-mini">
                      {t.facilities.slice(0, 2).map((f) => <span key={f} className="fac-tag">{f}</span>)}
                      {t.facilities.length > 2 && <span className="fac-tag more">+{t.facilities.length - 2}</span>}
                    </div>
                  </td>
                  <td className="muted">{t.addedOn}</td>
                  <td><span className={`status-badge ${t.status}`}>{t.status === "published" ? "● Live" : "○ Draft"}</span></td>
                  <td>
                    <div className="action-btns">
                      <button className="act-btn view" title="View" onClick={() => setViewTarget(t)}>👁</button>
                      <button className="act-btn edit" title="Edit" onClick={() => setEditTarget(t)}>✏️</button>
                      <button className="act-btn del" title="Delete" onClick={() => setDeleteTarget(t)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="quick-actions">
        <p className="qa-label">Quick Add</p>
        <div className="qa-buttons">
          <a href="/temple" className="qa-btn">🛕 New Temple</a>
          <a href="/dieties" className="qa-btn">ॐ New Deity</a>
          <a href="/festivals" className="qa-btn">✨ New Festival</a>
        </div>
      </div>

      {editTarget && <EditModal temple={editTarget} onSave={handleSave} onClose={() => setEditTarget(null)} />}
      {deleteTarget && <DeleteConfirm temple={deleteTarget} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} />}
      {viewTarget && <DetailDrawer temple={viewTarget} onClose={() => setViewTarget(null)} />}
    </div>
  );
};

export default Dashboard;