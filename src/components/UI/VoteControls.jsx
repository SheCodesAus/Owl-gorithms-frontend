import { useEffect, useRef, useState } from "react";
import { ChevronUp, ChevronDown, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Score colour based on value ──
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

// ── Animated score ──
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
        key={displayScore}
        initial={{ y: direction > 0 ? 10 : -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: direction > 0 ? -10 : 10, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={className}
        style={style}
      >
        {displayScore}
      </motion.span>
    </AnimatePresence>
  );
}

function VoteControls({
  itemTitle,
  score,
  activeVote,
  onUpvote,
  onDownvote,
  variant = "default",
  className = "",
  frozen = false,
}) {
  const isInteractionDisabled = isVoting || disabled;

  const isPanel = variant === "panel";
  const isFocus = variant === "focus";
  const isCard = variant === "card";

  const isDisabled = isVoting || frozen;

  const scoreColor = getScoreColor(score);
  const scoreGradient = getScoreGradient(score);

  const scoreStyle = scoreGradient
    ? {
        background: scoreGradient,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }
    : { color: scoreColor };

  // ── CARD (horizontal) ──
  if (isCard) {
    return (
      <div
        className={`relative overflow-hidden flex w-full items-center justify-between rounded-2xl gradient-border bg-white/80 px-2 py-1.5 shadow-sm ${className}`}
      >
        <motion.button
          type="button"
          onClick={onUpvote}
          disabled={isDisabled}
          whileTap={{ scale: 0.88 }}
          className={`inline-flex cursor-pointer items-center justify-center rounded-xl px-3 py-1.5 transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
            activeVote === "upvote"
              ? "bg-gradient-to-br from-[#ff9966] to-[#ff5e62] text-white shadow-[0_6px_18px_rgba(255,94,98,0.42)]"
              : "text-[var(--heading-text)] hover:bg-[#ff9966]/20 hover:text-[var(--primary-cta)]"
          }`}
          aria-label={
            activeVote === "upvote"
              ? `Remove upvote from ${itemTitle}`
              : `Upvote ${itemTitle}`
          }
          aria-pressed={activeVote === "upvote"}
        >
          <ChevronUp size={18} strokeWidth={2.5} aria-hidden="true" />
        </motion.button>

        <div className="flex min-w-[2rem] items-center justify-center">
          <AnimatedScore
            score={score}
            className="text-sm font-bold tabular-nums"
            style={scoreStyle}
          />
        </div>

        <motion.button
          type="button"
          onClick={onDownvote}
          disabled={isDisabled}
          whileTap={{ scale: 0.88 }}
          className={`inline-flex cursor-pointer items-center justify-center rounded-xl px-3 py-1.5 transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
            activeVote === "downvote"
              ? "bg-gradient-to-br from-[#FF5A5F] to-[#FF8A5C] text-white shadow-[0_6px_18px_rgba(255,90,95,0.38)]"
              : "text-[var(--heading-text)] hover:bg-[#FF5A5F]/10 hover:text-[#FF5A5F]"
          }`}
          aria-label={
            activeVote === "downvote"
              ? `Remove downvote from ${itemTitle}`
              : `Downvote ${itemTitle}`
          }
          aria-pressed={activeVote === "downvote"}
        >
          <ChevronDown size={18} strokeWidth={2.5} aria-hidden="true" />
        </motion.button>
      </div>
    );
  }

  // ── FOCUS ──
  if (isFocus) {
    return (
      <div
        className={`relative overflow-hidden inline-flex w-full sm:max-w-[320px] items-center justify-between gap-2 rounded-[1.4rem] gradient-border px-2.5 py-2 shadow ${className}`}
      >
        <motion.button
          type="button"
          onClick={onUpvote}
          disabled={isDisabled}
          whileTap={{ scale: 0.9 }}
          className={`inline-flex h-11 min-w-[3.2rem] cursor-pointer items-center justify-center rounded-[1rem] px-3 transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
            activeVote === "upvote"
              ? "bg-gradient-to-br from-[#ff9966] to-[#ff5e62] text-white shadow-[0_10px_22px_rgba(255,94,98,0.34)]"
              : "bg-[var(--surface-soft)] text-[var(--heading-text)] hover:-translate-y-[1px] hover:bg-[#ff9966]/35 hover:text-[var(--primary-cta)]"
          }`}
          aria-label={
            activeVote === "upvote"
              ? `Remove upvote from ${itemTitle}`
              : `Upvote ${itemTitle}`
          }
          aria-pressed={activeVote === "upvote"}
        >
          <ChevronUp size={22} strokeWidth={2.5} aria-hidden="true" />
        </motion.button>

        <div className="flex flex-col items-center">
          <span className="text-xs">Score</span>
          <div className="flex items-center gap-1">
            <Zap size={14} style={{ color: scoreColor }} aria-hidden="true" />
            <AnimatedScore
              score={score}
              className="text-lg font-bold"
              style={scoreStyle}
            />
          </div>
        </div>

        <motion.button
          type="button"
          onClick={onDownvote}
          disabled={isDisabled}
          whileTap={{ scale: 0.9 }}
          className={`inline-flex h-11 min-w-[3.2rem] cursor-pointer items-center justify-center rounded-[1rem] px-3 transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
            activeVote === "downvote"
              ? "bg-gradient-to-br from-[#FF5A5F] to-[#FF8A5C] text-white shadow-[0_10px_22px_rgba(255,90,95,0.3)]"
              : "bg-[var(--surface-soft)] text-[var(--heading-text)] hover:-translate-y-[1px] hover:bg-[#FF5A5F]/12 hover:text-[#FF5A5F]"
          }`}
          aria-label={
            activeVote === "downvote"
              ? `Remove downvote from ${itemTitle}`
              : `Downvote ${itemTitle}`
          }
          aria-pressed={activeVote === "downvote"}
        >
          <ChevronDown size={22} strokeWidth={2.5} aria-hidden="true" />
        </motion.button>
      </div>
    );
  }

  // ── DEFAULT / PANEL / COMPACT ──
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
    <div
      className={`relative overflow-hidden ${wrapperClasses} ${className}`}
    >
      <motion.button
        type="button"
        onClick={onUpvote}
        disabled={isDisabled}
        whileTap={{ scale: 0.85 }}
        className={`rounded-lg p-1 transition-all duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
          activeVote === "upvote"
            ? "bg-gradient-to-br from-[#ff9966] to-[#ff5e62] text-white shadow-[0_5px_14px_rgba(255,94,98,0.34)]"
            : "text-[var(--heading-text)] hover:bg-[#ff9966]/20 hover:text-[var(--primary-cta)]"
        }`}
        aria-label={
          activeVote === "upvote"
            ? `Remove upvote from ${itemTitle}`
            : `Upvote ${itemTitle}`
        }
        aria-pressed={activeVote === "upvote"}
      >
        <ChevronUp size={iconSize} strokeWidth={2.4} aria-hidden="true" />
      </motion.button>

      <AnimatedScore
        score={score}
        className={scoreClasses}
        style={scoreStyle}
      />

      <motion.button
        type="button"
        onClick={onDownvote}
        disabled={isDisabled}
        whileTap={{ scale: 0.85 }}
        className={`rounded-lg p-1 transition-all duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
          activeVote === "downvote"
            ? "bg-gradient-to-br from-[#FF5A5F] to-[#FF8A5C] text-white shadow-[0_5px_14px_rgba(255,90,95,0.3)]"
            : "text-[var(--heading-text)] hover:bg-[#FF5A5F]/10 hover:text-[#FF5A5F]"
        }`}
        aria-label={
          activeVote === "downvote"
            ? `Remove downvote from ${itemTitle}`
            : `Downvote ${itemTitle}`
        }
        aria-pressed={activeVote === "downvote"}
      >
        <ChevronDown size={iconSize} strokeWidth={2.4} aria-hidden="true" />
      </motion.button>
    </div>
  );
}

export default VoteControls;