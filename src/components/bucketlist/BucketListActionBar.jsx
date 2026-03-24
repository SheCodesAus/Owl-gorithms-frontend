import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, X, Lock, CheckCircle2, ChevronDown, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";

const SORT_OPTIONS = [
  { value: "default",     label: "Default" },
  { value: "most_votes",  label: "Most votes" },
  { value: "least_votes", label: "Least votes" },
  { value: "newest",      label: "Newest" },
  { value: "oldest",      label: "Oldest" },
  { value: "az",          label: "A–Z" },
  { value: "mine",        label: "My items only" },
];

export default function BucketListActionBar({
  completedCount,
  totalCount,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  search,
  onSearchChange,
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const [hoveredFilter, setHoveredFilter] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });
  const sortBtnRef = useRef(null);
  const sortRef = useRef(null);

  // Position the portal menu under the button
  useEffect(() => {
    if (sortOpen && sortBtnRef.current) {
      const rect = sortBtnRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
        width: Math.max(rect.width, 160),
      });
    }
  }, [sortOpen]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        sortBtnRef.current && !sortBtnRef.current.contains(e.target) &&
        sortRef.current && !sortRef.current.contains(e.target)
      ) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Sort";
  const isSortActive = sort && sort !== "default";

  return (
    <section className="bucketlist-action-bar-shell">
      <div className="item-control-bar">

        {/* Search */}
        <div className="item-control-search">
          <Search size={14} className="item-control-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="item-control-search-input"
            placeholder="Search items..."
            value={search ?? ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange?.("")}
              aria-label="Clear search"
              className="item-control-search-clear"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="item-control-divider" />

        {/* Icon filters */}
        <div className="item-control-icons">
          <div className="relative">
            <button
              type="button"
              onClick={() => onFilterChange(filter === "locked_in" ? "all" : "locked_in")}
              aria-label="Filter locked in items"
              onMouseEnter={() => setHoveredFilter("locked_in")}
              onMouseLeave={() => setHoveredFilter(null)}
              className={`item-control-icon-btn ${filter === "locked_in" ? "item-control-icon-btn-active-locked" : ""}`}
            >
              <Lock size={15} aria-hidden="true" />
            </button>
            {hoveredFilter === "locked_in" && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--heading-text)] px-2.5 py-1 text-[10px] font-semibold text-white"
              >
                Locked in. These ones are happening.
              </motion.span>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => onFilterChange(filter === "complete" ? "all" : "complete")}
              aria-label="Filter complete items"
              onMouseEnter={() => setHoveredFilter("complete")}
              onMouseLeave={() => setHoveredFilter(null)}
              className={`item-control-icon-btn ${filter === "complete" ? "item-control-icon-btn-active-complete" : ""}`}
            >
              <CheckCircle2 size={15} aria-hidden="true" />
            </button>
            {hoveredFilter === "complete" && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--heading-text)] px-2.5 py-1 text-[10px] font-semibold text-white"
              >
                Done and dusted. The wins.
              </motion.span>
            )}
          </div>
        </div>

        <div className="item-control-divider" />

        {/* Sort button */}
        <button
          ref={sortBtnRef}
          type="button"
          onClick={() => setSortOpen((p) => !p)}
          className={`item-control-sort-btn ${isSortActive ? "item-control-sort-btn-active" : ""}`}
        >
          <ArrowUpDown size={13} aria-hidden="true" />
          <span>{isSortActive ? activeSortLabel : "Sort"}</span>
          <ChevronDown
            size={13}
            aria-hidden="true"
            className={`transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
          />
        </button>

      </div>

      {/* Sort dropdown — portalled to body to escape overflow:hidden */}
      {sortOpen && createPortal(
        <div
          ref={sortRef}
          className="item-control-sort-menu"
          style={{
            position: "absolute",
            top: menuPos.top,
            left: menuPos.left,
            minWidth: menuPos.width,
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onSortChange?.(opt.value); setSortOpen(false); }}
              className={`item-control-sort-option ${sort === opt.value ? "item-control-sort-option-active" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </section>
  );
}