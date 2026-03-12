import { ChevronUp, ChevronDown } from "lucide-react";

function VoteControls({
  itemTitle = "item",
  score = 0,
  activeVote = null,
  isVoting = false,
  onUpvote,
  onDownvote,
  variant = "default",
  className = "",
}) {
  const isCompact = variant === "compact";
  const isPanel = variant === "panel";

  const wrapperClasses = isCompact
    ? "flex flex-col items-center rounded-2xl border border-[var(--card-border)] bg-white/80 px-1.5 py-1 shadow-sm"
    : isPanel
      ? "flex flex-col items-center rounded-2xl border border-[var(--card-border)] bg-white/75 px-2 py-1.5 shadow-sm backdrop-blur-[2px]"
      : "flex flex-col items-center rounded-2xl border border-[var(--card-border)] bg-[var(--surface-soft)] px-2 py-1.5";

  const baseButtonClasses =
    "rounded-full p-1 transition disabled:cursor-not-allowed disabled:opacity-50";

  const upvoteClasses =
    activeVote === "upvote"
      ? "bg-[var(--surface-soft)] text-[var(--primary-cta)]"
      : "text-[var(--heading-text)] hover:bg-[var(--surface-soft)]";

  const downvoteClasses =
    activeVote === "downvote"
      ? "bg-[var(--surface-soft)] text-[var(--primary-cta)]"
      : "text-[var(--heading-text)] hover:bg-[var(--surface-soft)]";

  const iconSize = isCompact ? 16 : 18;
  const scoreClasses = isCompact
    ? "min-w-[1.25rem] text-center text-xs font-semibold text-[var(--heading-text)]"
    : "min-w-[1.5rem] text-center text-sm font-semibold text-[var(--heading-text)]";

  return (
    <div className={`${wrapperClasses} ${className}`}>
      <button
        type="button"
        onClick={onUpvote}
        disabled={isVoting}
        className={`${baseButtonClasses} ${upvoteClasses}`}
        aria-label={
          activeVote === "upvote"
            ? `Remove upvote from ${itemTitle}`
            : `Upvote ${itemTitle}`
        }
        aria-pressed={activeVote === "upvote"}
      >
        <ChevronUp size={iconSize} aria-hidden="true" />
      </button>

      <span className={scoreClasses} aria-live="polite">
        {score}
      </span>

      <button
        type="button"
        onClick={onDownvote}
        disabled={isVoting}
        className={`${baseButtonClasses} ${downvoteClasses}`}
        aria-label={
          activeVote === "downvote"
            ? `Remove downvote from ${itemTitle}`
            : `Downvote ${itemTitle}`
        }
        aria-pressed={activeVote === "downvote"}
      >
        <ChevronDown size={iconSize} aria-hidden="true" />
      </button>
    </div>
  );
}

export default VoteControls;