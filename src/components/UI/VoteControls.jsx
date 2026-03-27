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
  isVoting,
  variant = "list",
  disabled = false,
}) {
  const isInteractionDisabled = isVoting || disabled;

  const isPanel = variant === "panel";
  const iconSize = isPanel ? 18 : 20;
  const containerClasses = isPanel ? "gap-1" : "gap-1.5";
  const scoreClasses = `font-bold tabular-nums ${
    isPanel ? "text-sm min-w-[1.25rem]" : "text-base min-w-[1.5rem]"
  } flex justify-center overflow-hidden`;

  const scoreStyle = {
    color: getScoreColor(score),
  };

  return (
    <div className={`flex items-center ${containerClasses}`}>
      <motion.button
        type="button"
        onClick={onUpvote}
        disabled={isInteractionDisabled}
        whileTap={isInteractionDisabled ? {} : { scale: 0.85 }}
        className={`rounded-lg p-1 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
          activeVote === "upvote"
            ? "coral-bg text-white shadow-[0_4px_12px_rgba(107,78,170,0.3)]"
            : "text-[var(--heading-text)] hover:bg-[#ff9966]/20 hover:text-[var(--primary-cta)]"
        }`}
        aria-label={
          activeVote === "upvote"
            ? `Remove upvote from ${itemTitle}`
            : `Upvote ${itemTitle}`
        }
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
        disabled={isInteractionDisabled}
        whileTap={isInteractionDisabled ? {} : { scale: 0.85 }}
        className={`rounded-lg p-1 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
          activeVote === "downvote"
            ? "bg-[linear-gradient(135deg,#FF5A5F,#FF8A5C)] text-white shadow-[0_4px_12px_rgba(255,90,95,0.25)]"
            : "text-[var(--muted-text)] hover:bg-[#FF5A5F]/10 hover:text-[#FF5A5F]"
        }`}
        aria-label={
          activeVote === "downvote"
            ? `Remove downvote from ${itemTitle}`
            : `Downvote ${itemTitle}`
        }
        aria-pressed={activeVote === "downvote"}
      >
        <ChevronDown size={iconSize} aria-hidden="true" />
      </motion.button>
    </div>
  );
}

export default VoteControls;