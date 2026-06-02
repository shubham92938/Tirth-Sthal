import React, { useState } from "react";
import './festivals.css'

const Festivals = () => {
  const [form, setForm] = useState({
    name: "", description: "", significance: "", startDate: "", endDate: "",
    associatedDeity: "", associatedTemple: "", associatedFestivals: "",
    famousTemples: "", duration: "", image: null,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Festival Data:", form);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="form-page">
      <div className="form-header">
        <div className="form-header-icon">✨</div>
        <div>
          <h1 className="form-title">Add Festival</h1>
          <p className="form-subtitle">Publish festival details to the temple website</p>
        </div>
      </div>

      <form className="temple-form" onSubmit={handleSubmit}>

        {/* Basic Info */}
        <div className="form-section">
          <h2 className="section-title">Basic Information</h2>
          <div className="form-grid-2">
            <div className="field">
              <label>Festival Name *</label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="e.g. Maha Shivaratri" required />
            </div>
            <div className="field">
              <label>Duration</label>
              <input name="duration" value={form.duration} onChange={handleChange}
                placeholder="e.g. 1 day, 10 days, 5 nights" />
            </div>
          </div>
          <div className="field">
            <label>Description *</label>
            <textarea name="description" value={form.description}
              onChange={handleChange}
              placeholder="Describe how the festival is celebrated, rituals, customs..."
              rows={4} required />
          </div>
          <div className="field">
            <label>Significance *</label>
            <textarea name="significance" value={form.significance}
              onChange={handleChange}
              placeholder="Explain the religious and cultural significance of this festival..."
              rows={3} required />
          </div>
        </div>

        {/* Dates */}
        <div className="form-section">
          <h2 className="section-title">Festival Dates</h2>
          <div className="form-grid-2">
            <div className="field">
              <label>Start Date *</label>
              <input name="startDate" type="date" value={form.startDate}
                onChange={handleChange} required />
            </div>
            <div className="field">
              <label>End Date</label>
              <input name="endDate" type="date" value={form.endDate}
                onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Associations */}
        <div className="form-section">
          <h2 className="section-title">Associations</h2>
          <div className="form-grid-2">
            <div className="field">
              <label>Associated Deity</label>
              <input name="associatedDeity" value={form.associatedDeity}
                onChange={handleChange}
                placeholder="e.g. Lord Shiva, Goddess Durga" />
            </div>
            <div className="field">
              <label>Associated Temple</label>
              <input name="associatedTemple" value={form.associatedTemple}
                onChange={handleChange}
                placeholder="e.g. Kashi Vishwanath" />
            </div>
          </div>
          <div className="field">
            <label>Related Festivals</label>
            <input name="associatedFestivals" value={form.associatedFestivals}
              onChange={handleChange}
              placeholder="e.g. Navratri, Diwali, Holi (comma separated)" />
          </div>
          <div className="field">
            <label>Famous Temples for This Festival</label>
            <textarea name="famousTemples" value={form.famousTemples}
              onChange={handleChange}
              placeholder="List temples famous for celebrating this festival..."
              rows={3} />
          </div>
        </div>

        {/* Image */}
        <div className="form-section">
          <h2 className="section-title">Festival Image</h2>
          <div className="field">
            <label>Upload Image</label>
            <div className="file-upload-area">
              <input type="file" accept="image/*"
                onChange={handleImage} id="festival-image" />
              <label htmlFor="festival-image" className="file-label">
                <span className="upload-icon">🎆</span>
                <span>{form.image ? form.image.name : "Click to upload festival image"}</span>
              </label>
            </div>
          </div>
        </div>

        <button type="submit" className={`submit-btn ${submitted ? "success" : ""}`}>
          {submitted ? "✓ Festival Saved!" : "Save Festival"}
        </button>
      </form>
    </div>
  );
};

export default Festivals;