import { ChevronUp, ChevronDown, Zap } from "lucide-react";

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
  const isFocus = variant === "focus";

  if (isFocus) {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-[1.4rem] gradient-border px-2.5 py-2 shadow-[0_16px_34px_rgba(39,16,76,0.12)] backdrop-blur-md ${className}`}
      >
        <button
          type="button"
          onClick={onUpvote}
          disabled={isVoting}
          className={`inline-flex h-11 min-w-[3.2rem] cursor-pointer items-center justify-center rounded-[1rem] px-3 transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
            activeVote === "upvote"
              ? "coral-bg text-white shadow-[0_10px_22px_rgba(107,78,170,0.28)]"
              : "bg-[var(--surface-soft)] text-[var(--heading-text)] hover:-translate-y-[1px] hover:bg-[#ff9966]/40 hover:text-[var(--primary-cta)]"
          }`}
          aria-label={
            activeVote === "upvote"
              ? `Remove upvote from ${itemTitle}`
              : `Upvote ${itemTitle}`
          }
          aria-pressed={activeVote === "upvote"}
        >
          <ChevronUp size={22} strokeWidth={2.5} aria-hidden="true" />
        </button>

        <div className="flex min-w-[4.6rem] flex-col items-center justify-center px-2">
          <span className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[var(--muted-text)]">
            Score
          </span>

          <div className="mt-0.5 inline-flex items-center gap-1">
            <Zap
              size={14}
              strokeWidth={2.4}
              className={
                activeVote === "upvote"
                  ? "text-[var(--primary-cta)]"
                  : activeVote === "downvote"
                    ? "text-[var(--accent)]"
                    : "text-[var(--muted-text)]"
              }
              aria-hidden="true"
            />
            <span
              className="text-lg font-bold tracking-tight text-[var(--heading-text)]"
              aria-live="polite"
            >
              {score}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onDownvote}
          disabled={isVoting}
          className={`inline-flex h-11 min-w-[3.2rem] cursor-pointer items-center justify-center rounded-[1rem] px-3 transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
            activeVote === "downvote"
              ? "coral-bg text-white shadow-[0_10px_22px_rgba(255,90,95,0.24)]"
              : "bg-[var(--surface-soft)] text-[var(--heading-text)] hover:-translate-y-[1px] hover:bg-[#ff9966]/40 hover:text-[var(--accent)]"
          }`}
          aria-label={
            activeVote === "downvote"
              ? `Remove downvote from ${itemTitle}`
              : `Downvote ${itemTitle}`
          }
          aria-pressed={activeVote === "downvote"}
        >
          <ChevronDown size={22} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>
    );
  }

  const wrapperClasses = isCompact
    ? "flex flex-col items-center rounded-2xl gradient-border bg-white/80 px-1.5 py-1 shadow-sm"
    : isPanel
      ? "flex flex-col items-center rounded-2xl gradient-border bg-white/75 px-2 py-1.5 shadow-sm backdrop-blur-[2px]"
      : "flex flex-col items-center rounded-2xl gradient-border bg-[var(--surface-soft)] px-2 py-1.5";

  const baseButtonClasses =
    "rounded-full p-1 transition disabled:cursor-not-allowed cursor-pointer disabled:opacity-50";

  const upvoteClasses =
    activeVote === "upvote"
      ? "coral-bg text-white"
      : "text-[var(--heading-text)] hover:bg-[#ff9966]";

  const downvoteClasses =
    activeVote === "downvote"
      ? "coral-bg text-white"
      : "text-[var(--heading-text)] hover:bg-[#ff9966]";

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