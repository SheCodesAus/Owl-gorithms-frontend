export default function BucketListActionBar({
  completedCount,
  totalCount,
  filter,
  onFilterChange,
  onAddItemClick,
  onInviteMembersClick,
}) {
  return (
    <section className="bucketlist-action-bar-shell">
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
            {["all", "pending", "complete"].map((value) => (
              <button
                key={value}
                type="button"
                className={`bucketlist-filter-button ${
                  filter === value ? "bucketlist-filter-button-active" : ""
                }`}
                onClick={() => onFilterChange(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="bucketlist-action-bar-right">
          <button
            type="button"
            className="bucketlist-secondary-action"
            onClick={onInviteMembersClick}
          >
            Invite Members
          </button>

          <button
            type="button"
            className="bucketlist-primary-action"
            onClick={onAddItemClick}
          >
            Add Item
          </button>
        </div>
      </div>
    </section>
  );
}