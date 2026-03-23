import { useRef, useState, useEffect } from "react";
import { Search, X, Lock, CheckCircle2, ChevronDown, ArrowUpDown } from "lucide-react";

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
  filter,
  onFilterChange,
  sort,
  onSortChange,
  search,
  onSearchChange,
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
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
          <button
            type="button"
            onClick={() => onFilterChange(filter === "locked_in" ? "all" : "locked_in")}
            aria-label="Filter locked in items"
            title="Locked in"
            className={`item-control-icon-btn ${filter === "locked_in" ? "item-control-icon-btn-active-locked" : ""}`}
          >
            <Lock size={15} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => onFilterChange(filter === "complete" ? "all" : "complete")}
            aria-label="Filter complete items"
            title="Complete"
            className={`item-control-icon-btn ${filter === "complete" ? "item-control-icon-btn-active-complete" : ""}`}
          >
            <CheckCircle2 size={15} aria-hidden="true" />
          </button>
        </div>

        <div className="item-control-divider" />

        {/* Sort dropdown */}
        <div className="relative shrink-0" ref={sortRef}>
          <button
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

          {sortOpen && (
            <div className="item-control-sort-menu">
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
            </div>
          )}
        </div>
      </div>
    </section>
  );
}