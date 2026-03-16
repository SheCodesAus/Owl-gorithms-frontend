function formatDateTime(iso) {
  if (!iso) return "";

  const date = new Date(iso);

  const dateLabel = date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const timeLabel = date.toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dateLabel} · ${timeLabel}`;
}

function formatDate(iso) {
  if (!iso) return "";

  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BucketListItemCard({ item, isSelected, onSelect }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <article
      className={`bucketlist-item-card ${
        item.is_completed ? "bucketlist-item-card-complete" : ""
      } ${isSelected ? "bucketlist-item-card-selected" : ""}`}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bucketlist-item-card-glow" />

      <div className="bucketlist-item-top">
        <div className="bucketlist-item-main">
          <div
            className={`bucketlist-item-status-dot ${
              item.is_completed ? "bucketlist-item-status-dot-complete" : ""
            }`}
            aria-hidden="true"
          />

          <div className="bucketlist-item-copy">
            <h3
              className={`bucketlist-item-title ${
                item.is_completed ? "bucketlist-item-title-complete" : ""
              }`}
            >
              {item.title}
            </h3>

            {item.description ? (
              <p className="bucketlist-item-description">{item.description}</p>
            ) : (
              <p className="bucketlist-item-description bucketlist-item-description-empty">
                No description yet.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bucketlist-item-meta">
        <span>{formatDateTime(item.date_created)}</span>
        <span>By {item.created_by?.username ?? "Unknown"}</span>

        {item.is_completed && item.completed_at ? (
          <span className="bucketlist-item-complete-badge">
            Completed {formatDate(item.completed_at)}
          </span>
        ) : null}
      </div>
    </article>
  );
}