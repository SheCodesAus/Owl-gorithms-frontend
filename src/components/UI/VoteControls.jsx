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
  frozen = false,
}) {
  const isCompact = variant === "compact";
  const isPanel = variant === "panel";
  const isFocus = variant === "focus";
  const isCard = variant === "card";

  const isDisabled = isVoting || frozen;

  const isHorizontal = isCard || isFocus;
  const frostImageSrc = isHorizontal
    ? "/frozenvote-long.png"
    : "/frozenvote-tall.png";

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

  const frostOverlay = frozen && (
    <>
      {/* cold tint */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-[#dff3ff]/35 via-white/10 to-transparent backdrop-blur-[1.5px]" />

      {/* icy inner edge */}
      <div className="pointer-events-none absolute inset-0 z-[2] rounded-[inherit] shadow-[inset_0_0_10px_rgba(180,220,255,0.45)]" />

      {/* icicles */}
      <img
        src={frostImageSrc}
        alt=""
        aria-hidden="true"
        className={`pointer-events-none absolute top-0 z-[3] opacity-80 ${
          isHorizontal
            ? "left-0 w-full h-[80%] object-cover object-top"
            : "left-1/2 -translate-x-1/2 w-[200%] h-[85%] object-contain object-top"
        }`}
      />
    </>
  );

  // ── CARD (horizontal) ──
  if (isCard) {
    return (
      <div
        className={`relative overflow-hidden flex w-full items-center justify-between rounded-2xl gradient-border bg-white/80 px-2 py-1.5 shadow-sm ${
          frozen ? "grayscale-[0.35] brightness-[0.95]" : ""
        } ${className}`}
      >
        <motion.button
          type="button"
          onClick={onUpvote}
          disabled={isDisabled}
          whileTap={{ scale: 0.88 }}
          className={`inline-flex items-center justify-center rounded-xl px-3 py-1.5 transition disabled:cursor-not-allowed disabled:opacity-50 ${
            activeVote === "upvote"
              ? "coral-bg text-white shadow-[0_4px_14px_rgba(107,78,170,0.35)]"
              : "text-[var(--heading-text)] hover:bg-[#ff9966]/20 hover:text-[var(--primary-cta)]"
          }`}
        >
          <ChevronUp size={18} />
        </motion.button>

        <div className="flex min-w-[2rem] items-center justify-center">
          <AnimatedScore
            score={score}
            className="text-sm font-bold"
            style={scoreStyle}
          />
        </div>

        <motion.button
          type="button"
          onClick={onDownvote}
          disabled={isDisabled}
          whileTap={{ scale: 0.88 }}
          className={`inline-flex items-center justify-center rounded-xl px-3 py-1.5 transition disabled:cursor-not-allowed disabled:opacity-50 ${
            activeVote === "downvote"
              ? "bg-[linear-gradient(135deg,#FF5A5F,#FF8A5C)] text-white"
              : "text-[var(--heading-text)] hover:bg-[#FF5A5F]/10 hover:text-[#FF5A5F]"
          }`}
        >
          <ChevronDown size={18} />
        </motion.button>

        {frostOverlay}
      </div>
    );
  }

  // ── FOCUS (horizontal large) ──
  if (isFocus) {
    return (
      <div
        className={`relative overflow-hidden inline-flex w-full sm:max-w-[320px] justify-between items-center gap-2 rounded-[1.4rem] gradient-border px-2.5 py-2 shadow ${
          frozen ? "grayscale-[0.35] brightness-[0.95]" : ""
        } ${className}`}
      >
        <motion.button onClick={onUpvote} disabled={isDisabled}>
          <ChevronUp size={22} />
        </motion.button>

        <div className="flex flex-col items-center">
          <span className="text-xs">Score</span>
          <div className="flex items-center gap-1">
            <Zap size={14} style={{ color: scoreColor }} />
            <AnimatedScore
              score={score}
              className="text-lg font-bold"
              style={scoreStyle}
            />
          </div>
        </div>

        <motion.button onClick={onDownvote} disabled={isDisabled}>
          <ChevronDown size={22} />
        </motion.button>

        {frostOverlay}
      </div>
    );
  }

  // ── DEFAULT / PANEL / COMPACT (vertical) ──
  const wrapperClasses = isCompact
    ? "flex flex-col items-center rounded-2xl gradient-border bg-white/80 px-1.5 py-1 shadow-sm"
    : isPanel
      ? "flex flex-col items-center rounded-2xl gradient-border bg-white/75 px-2 py-2 shadow-sm backdrop-blur-[2px]"
      : "flex flex-col items-center rounded-2xl gradient-border bg-[var(--surface-soft)] px-2 py-1.5";

  return (
    <div
      className={`relative overflow-hidden ${wrapperClasses} ${
        frozen ? "brightness-[0.97] saturate-[0.85] hue-rotate-[190deg]" : ""
      } ${className}`}
    >
      <motion.button onClick={onUpvote} disabled={isDisabled}>
        <ChevronUp />
      </motion.button>

      <AnimatedScore
        score={score}
        className="text-sm font-bold"
        style={scoreStyle}
      />

      <motion.button onClick={onDownvote} disabled={isDisabled}>
        <ChevronDown />
      </motion.button>

      {frostOverlay}
    </div>
  );
}

export default VoteControls;
