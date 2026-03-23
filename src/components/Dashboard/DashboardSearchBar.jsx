import { useEffect, useRef, useState } from "react";
import { Search, X, Snowflake, Globe, Crown, Users, ChevronDown, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";

const SORT_OPTIONS = [
  { value: "default",       label: "Default" },
  { value: "recent",        label: "Most recent activity" },
  { value: "newest",        label: "Newest created" },
  { value: "oldest",        label: "Oldest created" },
  { value: "az",            label: "A–Z" },
  { value: "most_items",    label: "Most items" },
  { value: "most_complete", label: "Most complete" },
];

const ICON_FILTERS = [
  { key: "frozen", icon: Snowflake, label: "Frozen solid.",          activeClass: "item-control-icon-btn-active-locked" },
  { key: "public", icon: Globe,     label: "Out in the wild. Public lists only.",        activeClass: "item-control-icon-btn-active-complete" },
  { key: "mine",   icon: Crown,     label: "Your lists. Your rules.",                    activeClass: "item-control-icon-btn-active-locked" },
  { key: "shared", icon: Users,     label: "Squad goals. Lists you've been pulled into.", activeClass: "item-control-icon-btn-active-complete" },
];

export default function DashboardSearchBar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const [hoveredFilter, setHoveredFilter] = useState(null);
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
    <div className="bucketlist-action-bar-shell">
      <div className="item-control-bar">

        {/* Search */}
        <div className="item-control-search">
          <Search size={14} className="item-control-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="item-control-search-input"
            placeholder="Search lists..."
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

        {/* Icon filters — toggle on/off, only one active at a time */}
        <div className="item-control-icons">
          {ICON_FILTERS.map(({ key, icon: Icon, label, activeClass }) => {
            const isActive = filter === key;
            return (
              <div key={key} className="relative">
                <button
                  type="button"
                  onClick={() => onFilterChange?.(isActive ? "all" : key)}
                  aria-label={label}
                  onMouseEnter={() => setHoveredFilter(key)}
                  onMouseLeave={() => setHoveredFilter(null)}
                  className={`item-control-icon-btn ${isActive ? activeClass : ""}`}
                >
                  <Icon size={14} aria-hidden="true" />
                </button>
                {hoveredFilter === key && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--heading-text)] px-2.5 py-1 text-[10px] font-semibold text-white"
                  >
                    {label}
                  </motion.span>
                )}
              </div>
            );
          })}
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
    </div>
  );
}