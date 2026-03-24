const FILTERS = [
  { value: "all", label: "All" },
  { value: "proposed", label: "Proposed" },
  { value: "locked_in", label: "Locked In" },
  { value: "complete", label: "Complete" },
];

export default function BucketListFilterTabs({ filter, onChange }) {
  return (
    <div className="bucketlist-filter-row" role="tablist" aria-label="Item filters">
      {FILTERS.map(({ value, label }) => {
        const isActive = filter === value;

        return (
          <button
            key={value}
            type="button"
            className={`bucketlist-filter-button ${
              isActive ? "bucketlist-filter-button-active" : ""
            }`}
            onClick={() => onChange(value)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}