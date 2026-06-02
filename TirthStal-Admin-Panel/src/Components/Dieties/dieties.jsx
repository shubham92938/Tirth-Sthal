import React, { useState } from "react";
import "./dieties.css";

const Dieties = () => {
  const [form, setForm] = useState({
    name: "", description: "", category: "", associatedTemple: "",
    alternateNames: "", origin: "", image: null,
  });
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    "Shaivism (Shiva)", "Vaishnavism (Vishnu)", "Shaktism (Devi)",
    "Smartism", "Ganapatya (Ganesha)", "Saura (Surya)", "Other",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Deity Data:", form);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 100);
  };

  return (
    <div className="form-page">
      <div className="form-header">
        <div className="form-header-icon">ॐ</div>
        <div>
          <h1 className="form-title">Add Deity</h1>
          <p className="form-subtitle">Add deity information to the temple database</p>
        </div>
      </div>

      <form className="temple-form" onSubmit={handleSubmit}>

        {/* Basic Info */}
        <div className="form-section">
          <h2 className="section-title">Basic Information</h2>
          <div className="form-grid-2">
            <div className="field">
              <label>Deity Name *</label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="e.g. Lord Shiva" required />
            </div>
            <div className="field">
              <label>Alternate Names / Titles</label>
              <input name="alternateNames" value={form.alternateNames}
                onChange={handleChange}
                placeholder="e.g. Mahadeva, Bholenath, Shankar" />
            </div>
          </div>
          <div className="field">
            <label>Description *</label>
            <textarea name="description" value={form.description}
              onChange={handleChange}
              placeholder="Describe the deity's significance, mythology, and iconography..."
              rows={4} required />
          </div>
          <div className="field">
            <label>Origin / Mythology</label>
            <textarea name="origin" value={form.origin} onChange={handleChange}
              placeholder="Brief origin story or mythological background..."
              rows={3} />
          </div>
        </div>

        {/* Category & Temple */}
        <div className="form-section">
          <h2 className="section-title">Classification</h2>
          <div className="form-grid-2">
            <div className="field">
              <label>Deity Category *</label>
              <select name="category" value={form.category}
                onChange={handleChange} required>
                <option value="">Select category...</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Associated Temple</label>
              <input name="associatedTemple" value={form.associatedTemple}
                onChange={handleChange}
                placeholder="e.g. Kashi Vishwanath, Somnath" />
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="form-section">
          <h2 className="section-title">Deity Image</h2>
          <div className="field">
            <label>Upload Image</label>
            <div className="file-upload-area">
              <input type="file" accept="image/*"
                onChange={handleImage} id="deity-image" />
              <label htmlFor="deity-image" className="file-label">
                <span className="upload-icon">🪔</span>
                <span>{form.image ? form.image.name : "Click to upload deity image"}</span>
              </label>
            </div>
          </div>
        </div>

        <button type="submit" className={`submit-btn ${submitted ? "success" : ""}`}>
          {submitted ? "✓ Deity Saved!" : "Save Deity"}
        </button>
      </form>
    </div>
  );
};

export default Dieties;