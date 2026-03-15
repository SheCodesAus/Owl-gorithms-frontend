import { Link } from "react-router-dom";

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysUntil(iso) {
  if (!iso) return null;
  return Math.ceil((new Date(iso) - new Date()) / (1000 * 60 * 60 * 24));
}

export default function BucketListHeader({ bucketList }) {
  const daysLeft =
    bucketList?.has_deadline && bucketList?.deadline
      ? daysUntil(bucketList.deadline)
      : null;

  return (
    <header className="bucketlist-header-card">
      <div className="bucketlist-breadcrumb">
        <Link to="/dashboard" className="bucketlist-breadcrumb-link">
          My Lists
        </Link>
        <span className="bucketlist-breadcrumb-separator">›</span>
        <span>Detail View</span>
      </div>

      <div className="bucketlist-header-top">
        <div className="bucketlist-header-copy">
          <h1 className="bucketlist-title">{bucketList.title}</h1>
          {bucketList.description ? (
            <p className="bucketlist-description">{bucketList.description}</p>
          ) : null}
        </div>

        <div className="bucketlist-badge-stack">
          <span
            className={`bucketlist-badge ${
              bucketList.is_public
                ? "bucketlist-badge-public"
                : "bucketlist-badge-private"
            }`}
          >
            {bucketList.is_public ? "Public" : "Private"}
          </span>

          <span
            className={`bucketlist-badge ${
              bucketList.is_open
                ? "bucketlist-badge-open"
                : "bucketlist-badge-archived"
            }`}
          >
            {bucketList.is_open ? "Open" : "Archived"}
          </span>
        </div>
      </div>

      <div className="bucketlist-meta-row">
        <span>Created {formatDate(bucketList.date_created)}</span>
        <span>Owner: {bucketList.owner?.username ?? "Unknown"}</span>
        {daysLeft !== null ? (
          <span className={daysLeft < 30 ? "bucketlist-deadline-warning" : ""}>
            {daysLeft > 0 ? `${daysLeft} days until deadline` : "Deadline passed"}
          </span>
        ) : null}
      </div>
    </header>
  );
}