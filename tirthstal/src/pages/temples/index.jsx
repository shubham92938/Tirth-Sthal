import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams }        from "react-router-dom";
import { FiHome, FiChevronRight, FiFilter, FiX } from "react-icons/fi";
import { motion, AnimatePresence }      from "framer-motion";
import TempleFilters                    from "../../components/temple/TempleFilters";
import TempleCard                       from "../../components/temple/TempleCard";
import { templesData }                  from "../../data/temple";
import "../../styles/pages/temples.css";

const ITEMS_PER_PAGE = 12;

export default function Temples() {
  const [searchParams]  = useSearchParams();
  const [currentPage,   setCurrentPage]  = useState(1);
  const [filterOpen,    setFilterOpen]   = useState(false);
  const [filters,       setFilters]      = useState({
    search:   searchParams.get("search")   || "",
    state:    searchParams.get("state")    || "All States",
    district: searchParams.get("district") || "All Districts",
    deities:  searchParams.get("deity") ? [searchParams.get("deity")] : [],
    sort: "Popularity",
  });

  useEffect(() => {
    setFilters({
      search:   searchParams.get("search")   || "",
      state:    searchParams.get("state")    || "All States",
      district: searchParams.get("district") || "All Districts",
      deities:  searchParams.get("deity") ? [searchParams.get("deity")] : [],
      sort: "Popularity",
    });
    setCurrentPage(1);
  }, [searchParams]);

  // lock scroll when filter open on mobile
  useEffect(() => {
    document.body.style.overflow = filterOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [filterOpen]);

  const allTemples = useMemo(() => {
    return Object.keys(templesData).flatMap((state) =>
      Object.values(templesData[state]).flat()
    );
  }, []);

  const filtered = useMemo(() => {
    let list = [...allTemples];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((t) =>
        t.name.toLowerCase().includes(q)     ||
        t.deity.toLowerCase().includes(q)    ||
        t.district.toLowerCase().includes(q) ||
        t.type?.toLowerCase().includes(q)    ||
        t.state.toLowerCase().includes(q)
      );
    }
    if (filters.state && filters.state !== "All States")
      list = list.filter((t) => t.state === filters.state);
    if (filters.deities?.length > 0)
      list = list.filter((t) =>
        filters.deities.some((d) => t.deity.toLowerCase().includes(d.toLowerCase()))
      );
    if (filters.district && filters.district !== "All Districts")
      list = list.filter((t) => t.district === filters.district);
    const typeParam = searchParams.get("type");
    if (typeParam)
      list = list.filter((t) => t.type?.toLowerCase().includes(typeParam.toLowerCase()));
    if (filters.sort === "Name A-Z") list.sort((a, b) => a.name.localeCompare(b.name));
    if (filters.sort === "Name Z-A") list.sort((a, b) => b.name.localeCompare(a.name));
    if (filters.sort === "Rating")   list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [filters, allTemples, searchParams]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice(
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

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    filters.deities.length +
    (filters.state !== "All States" ? 1 : 0) +
    (filters.district !== "All Districts" ? 1 : 0);

  return (
    <div className="temples-page">

      {/* Breadcrumb */}
      <div className="temples-page__breadcrumb">
        <Link to="/" className="breadcrumb__item">
          <FiHome size={13} /> Home
        </Link>
        <FiChevronRight size={13} className="breadcrumb__sep" />
        <span className="breadcrumb__item breadcrumb__item--active">Temples</span>
      </div>

      {/* Header */}
      <div className="temples-page__header">
        <div>
          <h1 className="temples-page__title">
            {filters.state !== "All States" ? `Temples in ${filters.state}` : "All Temples"}
          </h1>
          <p className="temples-page__sub">{filtered.length} temples found</p>
        </div>
        <div className="temples-page__meta">
          <span className="temples-page__count">
            Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–
            {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </span>

          {/* Mobile Filter Button */}
          <button
            className="temples-page__filter-btn"
            onClick={() => setFilterOpen(true)}
          >
            <FiFilter size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span className="temples-page__filter-badge">{activeFilterCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="temples-page__body">

        {/* Desktop Sidebar */}
        <div className="temples-page__sidebar-desktop">
          <TempleFilters onFilterChange={handleFilterChange} />
        </div>

        {/* Grid */}
        <div className="temples-page__right">
          {paginated.length === 0 ? (
            <div className="temples-page__empty">
              <span>🛕</span>
              <p>No temples found matching your filters.</p>
              <button onClick={() => handleFilterChange({
                search: "", deities: [], state: "All States",
                district: "All Districts", sort: "Popularity"
              })}>Clear Filters</button>
            </div>
          ) : (
            <motion.div className="temples-page__grid">
              {paginated.map((temple, i) => (
                <TempleCard key={temple.id} temple={temple} index={i} />
              ))}
            </motion.div>
          )}

          {totalPages > 1 && (
            <div className="temples-page__pagination">
              <button
                className="page-btn page-btn--nav"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >←</button>
              {getPageNumbers().map((page, i) =>
                page === "..." ? (
                  <span key={`dots-${i}`} className="page-dots">...</span>
                ) : (
                  <button
                    key={page}
                    className={`page-btn ${currentPage === page ? "active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >{page}</button>
                )
              )}
              <button
                className="page-btn page-btn--nav"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >→</button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              className="temples-page__filter-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
            />
            <motion.div
              className="temples-page__filter-drawer"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="temples-page__drawer-header">
                <h3>Filters</h3>
                <button onClick={() => setFilterOpen(false)}>
                  <FiX size={20} />
                </button>
              </div>
              <div className="temples-page__drawer-body">
                <TempleFilters
                  onFilterChange={(f) => {
                    handleFilterChange(f);
                  }}
                />
              </div>
              <div className="temples-page__drawer-footer">
                <button
                  className="temples-page__drawer-apply"
                  onClick={() => setFilterOpen(false)}
                >
                  Show {filtered.length} Temples
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}