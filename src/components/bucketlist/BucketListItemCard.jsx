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

const STATUS_CONFIG = {
  proposed: {
    label: "Proposed",
    pill: "item-status-badge item-status-badge-proposed",
  },
  locked_in: {
    label: "Locked in",
    pill: "item-status-badge item-status-badge-locked",
  },
  complete: {
    label: "Complete",
    pill: "item-status-badge item-status-badge-complete",
  },
};

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
  userRole,
  allowViewerVoting,
  isFrozen,
}) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  };

  const status = item.status ?? "proposed";
  const statusConfig = STATUS_CONFIG[status] ?? STATUS_CONFIG.proposed;

  const shouldShowVoteControls = !(
    userRole === "viewer" && !allowViewerVoting
  );

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className={`bucketlist-item-card ${
        status === "complete" ? "bucketlist-item-card-complete" : ""
      } ${isSelected ? "bucketlist-item-card-selected" : ""}`}
      onClick={onSelect}
      onDoubleClick={onDoubleSelect}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
    >
      <div className="bucketlist-item-card-glow" />

      <div
        className={`bucketlist-item-accent-bar bucketlist-item-accent-bar-${status}`}
      />

      <div className="bucketlist-item-card-inner">
        <div className="flex items-stretch gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <h3
              className={`bucketlist-item-title ${
                status === "complete" ? "bucketlist-item-title-complete" : ""
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

            <div className="mt-auto flex items-center gap-1.5 pt-1 text-xs text-[var(--muted-text)]">
              <span className="font-medium">
                {item.creator?.display_name ??
                  item.creator?.username ??
                  item.created_by?.display_name ??
                  item.created_by?.username ??
                  "Unknown"}
              </span>
              <span className="opacity-40">·</span>
              <span>
                <RelativeTime
                  timestamp={item.updated_at ?? item.date_created}
                />
              </span>

              {status === "complete" && item.completed_at ? (
                <>
                  <span className="opacity-40">·</span>
                  <span className="bucketlist-item-complete-badge shrink-0">
                    ✓ {formatDate(item.completed_at)}
                  </span>
                </>
              ) : null}
            </div>
          </div>

          {shouldShowVoteControls ? (
            <div
              className="flex shrink-0 items-center"
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
            >
              {!isFrozen && (
              <VoteControls
                itemTitle={item.title}
                score={voteScore ?? 0}
                activeVote={userVote ?? null}
                isVoting={isVoting}
                onUpvote={onUpvote}
                onDownvote={onDownvote}
                variant="panel"
                frozen={isFrozen}
              />
              )}
            </div>
          ) : null}
        </div>

        <div
          className="bucketlist-item-reactions-row flex items-start justify-between"
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
        >
          <ReactionBar
            itemId={item.id}
            reactionsSummary={item.reactions_summary ?? {}}
            userReaction={item.user_reaction ?? null}
            onReactionUpdate={onReactionUpdate}
            disabled={false}
          />
          <div className="flex items-start justify-between gap-2">
            <span className={statusConfig.pill}>{statusConfig.label}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}