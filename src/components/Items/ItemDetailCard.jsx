import RelativeTime from "../UI/RelativeTime";
import VoteControls from "../UI/VoteControls";

function formatDate(iso) {
  if (!iso) return null;

  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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

export default function ItemDetailCard({
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
  onEdit,
  onDelete,
  onUpdateStatus,
}) {
  return (
    <article className="item-detail-card">
      <div className="item-breadcrumb">
        <button
          type="button"
          className="item-breadcrumb-button"
          onClick={onBack}
        >
          {bucketList.title}
        </button>
        <span className="item-breadcrumb-separator">›</span>
        <span>{item.title}</span>
      </div>

      <div className="item-detail-header">
        <h1 className="item-detail-title">{item.title}</h1>

        <div className="item-detail-votes">
          <VoteControls
            itemTitle={item.title}
            score={voteScore}
            activeVote={userVote}
            isVoting={isVoting}
            onUpvote={onUpvote}
            onDownvote={onDownvote}
            variant="panel"
          />
        </div>
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

      <div className="item-detail-divider" />

      <div className="item-meta-row">
        <span className={`item-status-badge ${getStatusClass(item.status)}`}>
          {getStatusLabel(item.status)}
        </span>

        <span className="item-meta-pill">
          Updated <RelativeTime timestamp={item.updated_at} />
        </span>

        {item.status === "complete" && item.completed_at ? (
          <span className="item-complete-badge">
            Completed {formatDate(item.completed_at)}
          </span>
        ) : null}
      </div>

      <div className="item-detail-divider" />

      <div className="item-action-row">
        <button
          type="button"
          className="item-action-pill"
          onClick={onAddToCalendar}
        >
          Add to calendar
        </button>

        {isOwner ? (
          <button
            type="button"
            className="item-action-pill"
            onClick={onUpdateStatus}
          >
            Update status
          </button>
        ) : null}

        {canEdit ? (
          <>
            <button
              type="button"
              className="item-action-pill"
              onClick={onEdit}
            >
              Edit
            </button>

            <button
              type="button"
              className="item-action-pill item-action-pill-danger"
              onClick={onDelete}
            >
              Delete
            </button>
          </>
        ) : null}
      </div>
    </article>
  );
}