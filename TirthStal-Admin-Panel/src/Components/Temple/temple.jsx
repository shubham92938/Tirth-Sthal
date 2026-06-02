import React, { useState } from "react";
import "./temple.css";

const Temple = () => {
  const [form, setForm] = useState({
    name: "", description: "", city: "", district: "", state: "",
    address: "", website: "", openTime: "", closeTime: "",
    facilities: [], nearbyTemples: "", images: [],
  });
  const [facilitiesInput, setFacilitiesInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const facilityOptions = [
    "Parking", "Prasad Counter", "Dharamshala", "Toilet", "Drinking Water",
    "Medical Aid", "Shoe Stand", "Library", "Guest House", "Annadanam",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleFacility = (f) => {
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(f)
        ? prev.facilities.filter((x) => x !== f)
        : [...prev.facilities, f],
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, images: files }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Temple Data:", form);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="form-page">
      <div className="form-header">
        <div className="form-header-icon">🛕</div>
        <div>
          <h1 className="form-title">Add Temple</h1>
          <p className="form-subtitle">Enter temple details to publish on the website</p>
        </div>
      </div>

      <form className="temple-form" onSubmit={handleSubmit}>

        {/* Basic Info */}
        <div className="form-section">
          <h2 className="section-title">Basic Information</h2>
          <div className="form-grid-2">
            <div className="field">
              <label>Temple Name *</label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="e.g. Shri Kashi Vishwanath Temple" required />
            </div>
            <div className="field">
              <label>Official Website</label>
              <input name="website" value={form.website} onChange={handleChange}
                placeholder="https://example.com" type="url" />
            </div>
          </div>
          <div className="field">
            <label>Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Describe the temple history, significance, and architecture..."
              rows={4} required />
          </div>
        </div>

        {/* Location */}
        <div className="form-section">
          <h2 className="section-title">Location</h2>
          <div className="form-grid-3">
            <div className="field">
              <label>City *</label>
              <input name="city" value={form.city} onChange={handleChange}
                placeholder="e.g. Varanasi" required />
            </div>
            <div className="field">
              <label>District *</label>
              <input name="district" value={form.district} onChange={handleChange}
                placeholder="e.g. Varanasi" required />
            </div>
            <div className="field">
              <label>State *</label>
              <input name="state" value={form.state} onChange={handleChange}
                placeholder="e.g. Uttar Pradesh" required />
            </div>
          </div>
          <div className="field">
            <label>Full Address</label>
            <input name="address" value={form.address} onChange={handleChange}
              placeholder="Street, locality, pincode..." />
          </div>
        </div>

        {/* Timings */}
        <div className="form-section">
          <h2 className="section-title">Timings</h2>
          <div className="form-grid-2">
            <div className="field">
              <label>Opening Time *</label>
              <input name="openTime" type="time" value={form.openTime}
                onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Closing Time *</label>
              <input name="closeTime" type="time" value={form.closeTime}
                onChange={handleChange} required />
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div className="form-section">
          <h2 className="section-title">Facilities</h2>
          <div className="facility-grid">
            {facilityOptions.map((f) => (
              <button type="button" key={f}
                className={`facility-chip ${form.facilities.includes(f) ? "active" : ""}`}
                onClick={() => toggleFacility(f)}>
                {form.facilities.includes(f) ? "✓ " : ""}{f}
              </button>
            ))}
          </div>
        </div>

        {/* Nearby Temples */}
        <div className="form-section">
          <h2 className="section-title">Nearby Temples</h2>
          <div className="field">
            <label>Nearby Temples</label>
            <textarea name="nearbyTemples" value={form.nearbyTemples}
              onChange={handleChange}
              placeholder="List nearby temples separated by commas..."
              rows={2} />
          </div>
        </div>

        {/* Images */}
        <div className="form-section">
          <h2 className="section-title">Images</h2>
          <div className="field">
            <label>Upload Temple Images</label>
            <div className="file-upload-area">
              <input type="file" multiple accept="image/*"
                onChange={handleImageChange} id="temple-images" />
              <label htmlFor="temple-images" className="file-label">
                <span className="upload-icon">📷</span>
                <span>{form.images.length > 0
                  ? `${form.images.length} image(s) selected`
                  : "Click to upload images"}</span>
              </label>
            </div>
          </div>
        </div>

        <button type="submit" className={`submit-btn ${submitted ? "success" : ""}`}>
          {submitted ? "✓ Temple Saved!" : "Save Temple"}
        </button>
      </form>
    </div>
  );
};

export default Temple;