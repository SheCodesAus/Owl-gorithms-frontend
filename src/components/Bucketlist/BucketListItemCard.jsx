import { useNavigate } from "react-router-dom";

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

export default function BucketListItemCard({ item, listId, onDelete }) {
  const navigate = useNavigate();

  const goToItem = () => {
    navigate(`/bucketlists/${listId}/items/${item.id}`);
  };

  const handleCardClick = (event) => {
    if (event.target.closest("button")) return;
    goToItem();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToItem();
    }
  };

  return (
    <article
      className={`bucketlist-item-card ${
        item.is_completed ? "bucketlist-item-card-complete" : ""
      }`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
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
            ) : null}
          </div>
        </div>

        <button
          type="button"
          className="bucketlist-item-delete-button"
          onClick={() => onDelete(item)}
          aria-label={`Delete ${item.title}`}
        >
          Delete
        </button>
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