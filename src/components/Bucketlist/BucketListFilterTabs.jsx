const FILTERS = ["all", "pending", "complete"];

export default function BucketListFilterTabs({ filter, onChange }) {
  return (
    <div className="bucketlist-filter-row" role="tablist" aria-label="Item filters">
      {FILTERS.map((value) => {
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
            {value}
          </button>
        );
      })}
    </div>
  );
}