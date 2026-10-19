// ── Escape user input before using it inside a RegExp ──
// Prevents 500 errors / regex injection when a query contains
// characters like "[", "(", "*" (e.g. ?deity=[ would crash `new RegExp`).
const escapeRegex = (value = "") =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = escapeRegex;
