import { CalendarDays, Ellipsis, Pencil, Trash2 } from "lucide-react";
import RelativeTime from "../UI/RelativeTime";
import VoteControls from "../UI/VoteControls";
import Avatar from "../UI/Avatar";

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatItemDate(item) {
  if (!item?.start_date) return null;

  const fmt = (d) =>
    new Date(d).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const fmtTime = (t) => {
    const [h, m] = t.split(":");
    const d = new Date();
    d.setHours(Number(h), Number(m));
    return d.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" });
  };

  const start = fmt(item.start_date);
  const end =
    item.end_date && item.end_date !== item.start_date
      ? fmt(item.end_date)
      : null;
  const timeStr =
    item.start_time && item.end_time
      ? `${fmtTime(item.start_time)} – ${fmtTime(item.end_time)}`
      : null;

  if (end && timeStr) return `${start} – ${end}, ${timeStr}`;
  if (end) return `${start} – ${end}`;
  if (timeStr) return `${start}, ${timeStr}`;
  return start;
}

function getStatusLabel(status) {
  if (status === "locked_in") return "Locked In";
  if (status === "complete") return "Complete";
  if (status === "cancelled") return "Cancelled";
  return "Proposed";
}

function getStatusClass(status) {
  if (status === "locked_in") return "item-status-badge-locked";
  if (status === "complete") return "item-status-badge-complete";
  if (status === "cancelled") return "item-status-badge-cancelled";
  return "item-status-badge-proposed";
}

function ItemDetailCard({
  bucketList,
  item,
  canEdit,
  isOwner,
  voteScore,
  userVote,
  isVoting,
  onBack,
  onUpvote,
  onDownvote,
  onAddToCalendar,
  onAddDate,
  onEdit,
  onDelete,
  onUpdateStatus,
  onOptionsClick,
  showBreadcrumb = true,
}) {
  return (
    <article className="item-detail-card">
      <div className="item-detail-hero">
        {showBreadcrumb ? (
          <div className="item-breadcrumb item-breadcrumb-light">
            <button
              type="button"
              className="item-breadcrumb-button item-breadcrumb-button-light"
              onClick={onBack}
            >
              {bucketList.title}
            </button>
            <span className="item-breadcrumb-separator">›</span>
            <span>{item.title}</span>
          </div>
        ) : null}

        <div className="item-detail-topbar">
          <div className="item-detail-title-block">
            <h1 className="item-detail-title">{item.title}</h1>
          </div>

          <button
            type="button"
            className="item-options-button"
            onClick={onOptionsClick}
            aria-label="Item options"
            title="Item options"
          >
            <Ellipsis size={18} aria-hidden="true" />
          </button>
        </div>

        <section className="item-detail-section">
          <p className="item-detail-label">Description</p>
          <p
            className={`item-detail-description ${
              !item.description ? "item-detail-description-empty" : ""
            }`}
          >
            {item.description || "No description."}
          </p>
        </section>

        <div className="item-detail-votes item-detail-votes-prominent">
          <VoteControls
            itemTitle={item.title}
            score={voteScore}
            activeVote={userVote}
            isVoting={isVoting}
            onUpvote={onUpvote}
            onDownvote={onDownvote}
            variant="focus"
          />
        </div>
      </div>

      <div className="item-detail-divider" />

      <div className="item-meta-row">
        {item.creator?.display_name || item.creator?.username ? (
          <span className="item-meta-pill">
            <Avatar user={item.creator} size="md" className="mr-3" />
            {item.creator.display_name ?? item.creator.username}
          </span>
        ) : null}

        <span className="item-meta-subtle">
          <RelativeTime timestamp={item.updated_at} />
        </span>

        <span className={`item-status-badge ${getStatusClass(item.status)}`}>
          {getStatusLabel(item.status)}
        </span>

        {item.status === "complete" && item.completed_at ? (
          <span className="item-complete-badge">
            Completed {formatDate(item.completed_at)}
          </span>
        ) : null}
      </div>

      <div className="item-detail-divider" />

      {/* Date — display only, no edit button */}
      <section className="item-detail-section">
        <p className="item-detail-label">Date</p>

        {item.start_date ? (
          <p className="item-date-empty">
            <CalendarDays size={15} aria-hidden="true" style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
            Scheduled for {formatItemDate(item)}
          </p>
        ) : (
          <p className="item-date-empty">Make it happen. Book it in.</p>
        )}
      </section>

      <div className="item-detail-divider" />

      <div className="item-action-row">
        {/* Add to calendar — only when date exists */}
        {item.start_date && (
          <button
            type="button"
            className="item-action-pill"
            onClick={onAddToCalendar}
          >
            Add to calendar
          </button>
        )}

        {/* Add date — only when no date exists */}
        {!item.start_date && (
          <button
            type="button"
            className="item-action-pill"
            onClick={onAddDate}
          >
            <CalendarDays size={14} aria-hidden="true" />
            <span style={{ marginLeft: "4px" }}>Add date</span>
          </button>
        )}

        {canEdit && (
          <>
            <button
              type="button"
              className="item-action-pill"
              onClick={onEdit}
            >
              <Pencil size={13} aria-hidden="true" />
              <span style={{ marginLeft: "4px" }}>Edit item</span>
            </button>

            <button
              type="button"
              className="item-action-pill item-action-pill-danger"
              onClick={onDelete}
            >
              <Trash2 size={13} aria-hidden="true" />
              <span style={{ marginLeft: "4px" }}>Delete item</span>
            </button>
          </>
        )}
      </div>
    </article>
  );
}

export default ItemDetailCard;