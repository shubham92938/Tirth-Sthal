import "../../styles/common/loader.css";

// ── Full-page loader (route code-splitting fallback) ──
export default function Loader() {
  return (
    <div className="page-loader" role="status" aria-label="Loading">
      <div className="page-loader__icon">🛕</div>
      <div className="page-loader__spinner" />
      <p className="page-loader__text">Loading…</p>
    </div>
  );
}
