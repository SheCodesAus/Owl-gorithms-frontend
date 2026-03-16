import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import RelativeTime from "../UI/RelativeTime";

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
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className={`bucketlist-item-card ${
        item.is_completed ? "bucketlist-item-card-complete" : ""
      } ${isSelected ? "bucketlist-item-card-selected" : ""}`}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
    >
      {/* Glow layer — visible on selected/hover */}
      <div className="bucketlist-item-card-glow" />

      <div className="bucketlist-item-top">
        <div className="bucketlist-item-main">
          {/* Status dot */}
          <div
            className={`bucketlist-item-status-dot ${
              item.is_completed ? "bucketlist-item-status-dot-complete" : ""
            }`}
            aria-hidden="true"
          />

          <div className="bucketlist-item-copy min-w-0 flex-1">
            <h3
              className={`bucketlist-item-title ${
                item.is_completed ? "bucketlist-item-title-complete" : ""
              }`}
            >
              {item.title}
            </h3>

            {item.description ? (
              <p className="bucketlist-item-description line-clamp-2">
                {item.description}
              </p>
            ) : (
              <p className="bucketlist-item-description bucketlist-item-description-empty">
                No description yet.
              </p>
            )}
          </div>
        </div>

        {/* Completed badge — top right */}
        {item.is_completed ? (
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0 text-emerald-500"
            aria-label="Completed"
          />
        ) : null}
      </div>

      <div className="bucketlist-item-meta">
        <span>
          <RelativeTime timestamp={item.date_created} />
        </span>
        <span>By {item.created_by?.display_name ?? item.created_by?.username ?? "Unknown"}</span>

        {item.is_completed && item.completed_at ? (
          <span className="bucketlist-item-complete-badge">
            ✓ Completed {formatDate(item.completed_at)}
          </span>
        ) : null}
      </div>
    </motion.article>
  );
}