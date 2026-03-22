import { motion } from "framer-motion";
import RelativeTime from "../UI/RelativeTime";
import ReactionBar from "../UI/ReactionBar";
import VoteControls from "../UI/VoteControls";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BucketListItemCard({
  item,
  isSelected,
  onSelect,
  onDoubleSelect,
  onReactionUpdate,
  voteScore,
  userVote,
  isVoting,
  onUpvote,
  onDownvote,
}) {
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
      onDoubleClick={onDoubleSelect}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
    >
      {/* Glow layer */}
      <div className="bucketlist-item-card-glow" />

      <div className="bucketlist-item-top">
        <div className="bucketlist-item-main">
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

        {/* Vote controls — stop propagation so clicks don't select the card */}
        <div
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          style={{ flexShrink: 0 }}
        >
          <VoteControls
            itemTitle={item.title}
            score={voteScore ?? 0}
            activeVote={userVote ?? null}
            isVoting={isVoting}
            onUpvote={onUpvote}
            onDownvote={onDownvote}
            variant="compact"
          />
        </div>
      </div>

      <div className="bucketlist-item-meta">
        <span className="truncate">
          {item.creator?.display_name ??
            item.creator?.username ??
            item.created_by?.display_name ??
            item.created_by?.username ??
            "Unknown"}
        </span>
        <span>
          <RelativeTime timestamp={item.updated_at ?? item.date_created} />
        </span>

        {item.is_completed && item.completed_at ? (
          <>
            <span>·</span>
            <span className="bucketlist-item-complete-badge shrink-0">
              ✓ Completed {formatDate(item.completed_at)}
            </span>
          </>
        ) : null}

        {/* Reactions — right side */}
        <div className="shrink-0">
          <ReactionBar
            itemId={item.id}
            reactionsSummary={item.reactions_summary ?? {}}
            userReaction={item.user_reaction ?? null}
            onReactionUpdate={onReactionUpdate}
            disabled={item.is_completed}
          />
        </div>
      </div>
    </motion.article>
  );
}