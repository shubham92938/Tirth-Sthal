import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiHome, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";
import TempleFilters from "../../components/temple/TempleFilters";
import TempleCard    from "../../components/temple/TempleCard";
import { getAllTemples } from "../../data/temple"
import "../../styles/pages/temples.css";

const ITEMS_PER_PAGE = 10;

export default function Temples() {
  const allTemples = getAllTemples("Madhya Pradesh");

  const [filters, setFilters] = useState({
    search: "", deities: [], district: "All Districts", sort: "Popularity"
  });
  const [currentPage,  setCurrentPage]  = useState(1);

  // ── Filter & Sort Logic ──
  const filtered = useMemo(() => {
    let list = [...allTemples];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((t) =>
        t.name.toLowerCase().includes(q) ||
        t.deity.toLowerCase().includes(q) ||
        t.district.toLowerCase().includes(q)
      );
    }

    // Deity
    if (filters.deities.length > 0) {
      list = list.filter((t) =>
        filters.deities.some((d) => t.deity.includes(d))
      );
    }

    // District
    if (filters.district !== "All Districts") {
      list = list.filter((t) => t.district === filters.district);
    }

    // Sort
    if (filters.sort === "Name A-Z") list.sort((a, b) => a.name.localeCompare(b.name));
    if (filters.sort === "Name Z-A") list.sort((a, b) => b.name.localeCompare(a.name));
    if (filters.sort === "Rating")   list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [filters, allTemples]);

  // ── Pagination ──
  const totalPages  = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated   = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2);
      if (currentPage > 3) pages.push("...");
      if (currentPage > 2 && currentPage < totalPages - 1) pages.push(currentPage);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages - 1, totalPages);
    }
    return pages;
  };

  return (
    <div className="temples-page">

      {/* ── Breadcrumb ── */}
      <div className="temples-page__breadcrumb">
        <Link to="/" className="breadcrumb__item">
          <FiHome size={13} /> Home
        </Link>
        <FiChevronRight size={13} className="breadcrumb__sep" />
        <span className="breadcrumb__item breadcrumb__item--active">Temples</span>
      </div>

      {/* ── Page Header ── */}
      <div className="temples-page__header">
        <div>
          <h1 className="temples-page__title">All Temples in Madhya Pradesh</h1>
          <p className="temples-page__sub">
            Discover {allTemples.length} temples across multiple districts
          </p>
        </div>

        <div className="temples-page__meta">
          <span className="temples-page__count">
             Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="temples-page__body">

        {/* Sidebar */}
        <TempleFilters onFilterChange={handleFilterChange} />

        {/* Grid */}
        <div className="temples-page__right">

          {paginated.length === 0 ? (
            <div className="temples-page__empty">
              <span>🛕</span>
              <p>No temples found matching your filters.</p>
              <button onClick={() => handleFilterChange({
                search: "", deities: [], district: "All Districts", sort: "Popularity"
              })}>
                Clear Filters
              </button>
            </div>
          ) : (
            <motion.div className="temples-page__grid">
              {paginated.map((temple, i) => (
                <TempleCard key={temple.id} temple={temple} index={i} />
              ))}
            </motion.div>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="temples-page__pagination">
              <button
                className="page-btn page-btn--nav"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                ←
              </button>

              {getPageNumbers().map((page, i) =>
                page === "..." ? (
                  <span key={`dots-${i}`} className="page-dots">...</span>
                ) : (
                  <button
                    key={page}
                    className={`page-btn ${currentPage === page ? "active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                className="page-btn page-btn--nav"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                →
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}