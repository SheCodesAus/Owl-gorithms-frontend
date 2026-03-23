import { useEffect, useRef, useState } from "react";
import { ChevronUp, ChevronDown, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Score colour based on value — purple for positive, coral for negative ──
function getScoreColor(score) {
  if (score > 0) return "var(--primary-cta)";
  if (score < 0) return "#FF5A5F";
  return "var(--muted-text)";
}

function getScoreGradient(score) {
  if (score > 0) return "linear-gradient(135deg, #6B4EAA, #C76BBA)";
  if (score < 0) return "linear-gradient(135deg, #FF5A5F, #FF8A5C)";
  return null;
}

// ── Animated score number ──
function AnimatedScore({ score, className, style }) {
  const [displayScore, setDisplayScore] = useState(score);
  const [direction, setDirection] = useState(0);
  const prevScore = useRef(score);

  useEffect(() => {
    if (score !== prevScore.current) {
      setDirection(score > prevScore.current ? 1 : -1);
      prevScore.current = score;
      setDisplayScore(score);
    }
  }, [score]);

  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={score}
        initial={{ y: direction * -12, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: direction * 12, opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className={className}
        style={style}
        aria-live="polite"
      >
        {displayScore}
      </motion.span>
    </AnimatePresence>
  );
}

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
  const isCard = variant === "card";

  const scoreColor = getScoreColor(score);
  const scoreGradient = getScoreGradient(score);
  const scoreStyle = scoreGradient
    ? { background: scoreGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }
    : { color: scoreColor };

  // ── Card variant — horizontal pill, full width ──
  if (isCard) {
    return (
      <div className={`flex w-full items-center justify-between rounded-2xl gradient-border bg-white/80 px-2 py-1.5 shadow-sm ${className}`}>
        {/* Upvote */}
        <motion.button
          type="button"
          onClick={onUpvote}
          disabled={isVoting}
          whileTap={{ scale: 0.88 }}
          className={`inline-flex cursor-pointer items-center justify-center rounded-xl px-3 py-1.5 transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
            activeVote === "upvote"
              ? "coral-bg text-white shadow-[0_4px_14px_rgba(107,78,170,0.35)]"
              : "text-[var(--heading-text)] hover:bg-[#ff9966]/20 hover:text-[var(--primary-cta)]"
          }`}
          aria-label={activeVote === "upvote" ? `Remove upvote from ${itemTitle}` : `Upvote ${itemTitle}`}
          aria-pressed={activeVote === "upvote"}
        >
          <ChevronUp size={18} strokeWidth={2.5} aria-hidden="true" />
        </motion.button>

        {/* Score */}
        <div className="flex min-w-[2rem] flex-col items-center justify-center">
          <AnimatedScore
            score={score}
            className="text-sm font-bold tabular-nums"
            style={scoreStyle}
          />
        </div>

        {/* Downvote */}
        <motion.button
          type="button"
          onClick={onDownvote}
          disabled={isVoting}
          whileTap={{ scale: 0.88 }}
          className={`inline-flex cursor-pointer items-center justify-center rounded-xl px-3 py-1.5 transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
            activeVote === "downvote"
              ? "bg-[linear-gradient(135deg,#FF5A5F,#FF8A5C)] text-white shadow-[0_4px_14px_rgba(255,90,95,0.3)]"
              : "text-[var(--heading-text)] hover:bg-[#FF5A5F]/10 hover:text-[#FF5A5F]"
          }`}
          aria-label={activeVote === "downvote" ? `Remove downvote from ${itemTitle}` : `Downvote ${itemTitle}`}
          aria-pressed={activeVote === "downvote"}
        >
          <ChevronDown size={18} strokeWidth={2.5} aria-hidden="true" />
        </motion.button>
      </div>
    );
  }

  // ── Focus variant — large horizontal pill ──
  if (isFocus) {
    return (
      <div className={`inline-flex items-center gap-2 rounded-[1.4rem] gradient-border px-2.5 py-2 shadow-[0_16px_34px_rgba(39,16,76,0.12)] backdrop-blur-md ${className}`}>
        <motion.button
          type="button"
          onClick={onUpvote}
          disabled={isVoting}
          whileTap={{ scale: 0.9 }}
          className={`inline-flex h-11 min-w-[3.2rem] cursor-pointer items-center justify-center rounded-[1rem] px-3 transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
            activeVote === "upvote"
              ? "coral-bg text-white shadow-[0_10px_22px_rgba(107,78,170,0.28)]"
              : "bg-[var(--surface-soft)] text-[var(--heading-text)] hover:-translate-y-[1px] hover:bg-[#ff9966]/40 hover:text-[var(--primary-cta)]"
          }`}
          aria-label={activeVote === "upvote" ? `Remove upvote from ${itemTitle}` : `Upvote ${itemTitle}`}
          aria-pressed={activeVote === "upvote"}
        >
          <ChevronUp size={22} strokeWidth={2.5} aria-hidden="true" />
        </motion.button>

        <div className="flex min-w-[4.6rem] flex-col items-center justify-center px-2">
          <span className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[var(--muted-text)]">
            Score
          </span>
          <div className="mt-0.5 inline-flex items-center gap-1">
            <Zap
              size={14}
              strokeWidth={2.4}
              style={{ color: scoreColor }}
              aria-hidden="true"
            />
            <AnimatedScore
              score={score}
              className="text-lg font-bold tracking-tight"
              style={scoreStyle}
            />
          </div>
        </div>

        <motion.button
          type="button"
          onClick={onDownvote}
          disabled={isVoting}
          whileTap={{ scale: 0.9 }}
          className={`inline-flex h-11 min-w-[3.2rem] cursor-pointer items-center justify-center rounded-[1rem] px-3 transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
            activeVote === "downvote"
              ? "bg-[linear-gradient(135deg,#FF5A5F,#FF8A5C)] text-white shadow-[0_10px_22px_rgba(255,90,95,0.24)]"
              : "bg-[var(--surface-soft)] text-[var(--heading-text)] hover:-translate-y-[1px] hover:bg-[#FF5A5F]/10 hover:text-[#FF5A5F]"
          }`}
          aria-label={activeVote === "downvote" ? `Remove downvote from ${itemTitle}` : `Downvote ${itemTitle}`}
          aria-pressed={activeVote === "downvote"}
        >
          <ChevronDown size={22} strokeWidth={2.5} aria-hidden="true" />
        </motion.button>
      </div>
    );
  }

  // ── Compact / panel / default — vertical pill ──
  const wrapperClasses = isCompact
    ? "flex flex-col items-center rounded-2xl gradient-border bg-white/80 px-1.5 py-1 shadow-sm"
    : isPanel
      ? "flex flex-col items-center rounded-2xl gradient-border bg-white/75 px-2 py-2 shadow-sm backdrop-blur-[2px]"
      : "flex flex-col items-center rounded-2xl gradient-border bg-[var(--surface-soft)] px-2 py-1.5";

  const iconSize = isCompact ? 16 : 18;

  const scoreClasses = isCompact
    ? "text-xs font-bold tabular-nums"
    : "text-sm font-bold tabular-nums";

  return (
    <div className={`${wrapperClasses} ${className}`}>
      <motion.button
        type="button"
        onClick={onUpvote}
        disabled={isVoting}
        whileTap={{ scale: 0.85 }}
        className={`rounded-lg p-1 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
          activeVote === "upvote"
            ? "coral-bg text-white shadow-[0_4px_12px_rgba(107,78,170,0.3)]"
            : "text-[var(--heading-text)] hover:bg-[#ff9966]/20 hover:text-[var(--primary-cta)]"
        }`}
        aria-label={activeVote === "upvote" ? `Remove upvote from ${itemTitle}` : `Upvote ${itemTitle}`}
        aria-pressed={activeVote === "upvote"}
      >
        <ChevronUp size={iconSize} aria-hidden="true" />
      </motion.button>

      <AnimatedScore
        score={score}
        className={scoreClasses}
        style={scoreStyle}
      />

      <motion.button
        type="button"
        onClick={onDownvote}
        disabled={isVoting}
        whileTap={{ scale: 0.85 }}
        className={`rounded-lg p-1 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
          activeVote === "downvote"
            ? "bg-[linear-gradient(135deg,#FF5A5F,#FF8A5C)] text-white shadow-[0_4px_12px_rgba(255,90,95,0.25)]"
            : "text-[var(--heading-text)] hover:bg-[#FF5A5F]/10 hover:text-[#FF5A5F]"
        }`}
        aria-label={activeVote === "downvote" ? `Remove downvote from ${itemTitle}` : `Downvote ${itemTitle}`}
        aria-pressed={activeVote === "downvote"}
      >
        <ChevronDown size={iconSize} aria-hidden="true" />
      </motion.button>
    </div>
  );
}

export default VoteControls;