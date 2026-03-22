import { motion } from "framer-motion";

export default function BucketListActionBar({
  completedCount,
  totalCount,
  filter,
  onFilterChange,
}) {
  const FILTERS = [
    { value: "all", label: "All" },
    { value: "proposed", label: "Proposed" },
    { value: "locked_in", label: "Locked In" },
    { value: "complete", label: "Complete" },
  ];

  return (
    <motion.section
      className="bucketlist-action-bar-shell"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
    >
      <div className="bucketlist-action-bar">
        <div className="bucketlist-action-bar-left">
          <div className="bucketlist-progress-chip">
            <span className="bucketlist-progress-chip-value">
              {completedCount}/{totalCount}
            </span>
            <span className="bucketlist-progress-chip-label">complete</span>
          </div>

          <div
            className="bucketlist-filter-row"
            role="tablist"
            aria-label="Item filters"
          >
            {FILTERS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={filter === value}
                className={`bucketlist-filter-button cursor-pointer ${
                  filter === value ? "bucketlist-filter-button-active" : ""
                }`}
                onClick={() => onFilterChange(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}