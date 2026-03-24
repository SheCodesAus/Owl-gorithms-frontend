import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { reactToItem } from "../../api/reactions";

const REACTIONS = [
  { key: "fire",     label: "This is heating up",   emoji: "🔥", lottie: "/reactions/fire.json",     freezeFrame: null },
  { key: "love",     label: "Obsessed",              emoji: "😍", lottie: "/reactions/love.json",     freezeFrame: null },
  { key: "sketchy",  label: "I have questions",      emoji: "😰", lottie: "/reactions/sketchy.json",  freezeFrame: null },
  { key: "dead",     label: "This will kill us",     emoji: "😭", lottie: "/reactions/dead.json",     freezeFrame: 40 },
  { key: "hardpass", label: "Not a chance",          emoji: "😤", lottie: "/reactions/hardpass.json", freezeFrame: null },
  { key: "nope",     label: "Nah, I'm good",         emoji: "🙅", lottie: "/reactions/nope.json",     freezeFrame: null },
];

function LottieIcon({ src, emoji, size = 32, playing = false, freezeFrame = null }) {
  const ref = useRef(null);
  const playerRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const [totalFrames, setTotalFrames] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadLottie() {
      if (failed) return;
      try {
        const { default: lottie } = await import("lottie-web");
        if (!ref.current || cancelled) return;
        if (playerRef.current) playerRef.current.destroy();
        const response = await fetch(src);
        if (!response.ok) { setFailed(true); return; }
        const animationData = await response.json();
        if (!ref.current || cancelled) return;
        playerRef.current = lottie.loadAnimation({
          container: ref.current,
          renderer: "svg",
          loop: playing,
          autoplay: playing,
          animationData,
        });
        // Store total frames so we can default to midpoint
        const frames = animationData.op - animationData.ip;
        setTotalFrames(frames);
        // Freeze at specified frame or midpoint
        if (!playing) {
          const stopAt = freezeFrame ?? Math.floor(frames / 2);
          playerRef.current.goToAndStop(stopAt, true);
        }
      } catch {
        setFailed(true);
      }
    }
    loadLottie();
    return () => { cancelled = true; playerRef.current?.destroy(); };
  }, [src, failed]);

  useEffect(() => {
    if (!playerRef.current) return;
    if (playing) {
      playerRef.current.loop = true;
      playerRef.current.play();
    } else {
      playerRef.current.loop = false;
      const stopAt = freezeFrame ?? (totalFrames ? Math.floor(totalFrames / 2) : 0);
      playerRef.current.goToAndStop(stopAt, true);
    }
  }, [playing, freezeFrame, totalFrames]);

  if (failed) return <span style={{ fontSize: size * 0.75, lineHeight: 1 }}>{emoji}</span>;
  return <div ref={ref} style={{ width: size, height: size, flexShrink: 0 }} aria-hidden="true" />;
}

function ReactionPicker({ onReact, userReaction, onClose, openedByClick }) {
  const [hoveredKey, setHoveredKey] = useState(null);
  return (
    <motion.div
      className="absolute bottom-full left-0 z-30 mb-2"
      initial={{ opacity: 0, scale: 0.85, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 8 }}
      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
      onMouseLeave={openedByClick ? undefined : onClose}
    >
      <div className="flex items-center gap-1 rounded-full border border-white/50 bg-white/95 px-3 py-2 shadow-[0_8px_32px_rgba(39,16,76,0.18)] backdrop-blur-md">
        {REACTIONS.map((r) => {
          const isActive = userReaction === r.key;
          const isHovered = hoveredKey === r.key;
          return (
            <motion.button
              key={r.key}
              type="button"
              aria-label={r.label}
              title={r.label}
              onClick={(e) => { e.stopPropagation(); onReact(r.key); }}
              onMouseEnter={() => setHoveredKey(r.key)}
              onMouseLeave={() => setHoveredKey(null)}
              animate={{ scale: isHovered ? 1.4 : 1, y: isHovered ? -6 : 0 }}
              transition={{ duration: 0.15 }}
              className={`relative flex cursor-pointer items-center justify-center rounded-full p-0.5 transition ${isActive ? "ring-2 ring-[var(--accent)] ring-offset-1" : ""}`}
            >
              <LottieIcon src={r.lottie} emoji={r.emoji} size={isHovered ? 40 : 32} playing={isHovered} />
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--heading-text)] px-2 py-0.5 text-[10px] font-semibold text-white"
                >
                  {r.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ── Tweak this to change which frame the animation rests on when not hovered
const FREEZE_FRAME = 40;

function ReactionCount({ reactionKey, count, isActive }) {
  const reaction = REACTIONS.find((r) => r.key === reactionKey);
  const [hovered, setHovered] = useState(false);
  if (!reaction || count === 0) return null;
  return (
    <motion.span
      layout
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`inline-flex cursor-default items-center gap-1 rounded-full border px-1.5 py-0.5 text-xs font-semibold transition ${
        isActive
          ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
          : "border-[var(--dividers)] bg-white/70 text-[var(--muted-text)]"
      }`}
    >
      <LottieIcon src={reaction.lottie} emoji={reaction.emoji} size={20} playing={hovered} freezeFrame={FREEZE_FRAME} />
      <span>{count}</span>
    </motion.span>
  );
}

export default function ReactionBar({
  itemId,
  reactionsSummary = {},
  userReaction = null,
  onReactionUpdate,
  disabled = false,
}) {
  const { auth } = useAuth();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [openedByClick, setOpenedByClick] = useState(false);
  const [isReacting, setIsReacting] = useState(false);
  const [localSummary, setLocalSummary] = useState(reactionsSummary);
  const [localUserReaction, setLocalUserReaction] = useState(userReaction);
  const containerRef = useRef(null);
  const hoverTimerRef = useRef(null);

  useEffect(() => {
    setLocalSummary(reactionsSummary);
    setLocalUserReaction(userReaction);
  }, [reactionsSummary, userReaction]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setPickerOpen(false);
        setOpenedByClick(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (disabled || openedByClick) return;
    hoverTimerRef.current = setTimeout(() => {
      setOpenedByClick(false);
      setPickerOpen(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimerRef.current);
  };

  const handleReact = async (reactionKey) => {
    if (!auth?.access || isReacting) return;
    setPickerOpen(false);
    setIsReacting(true);

    const prevSummary = { ...localSummary };
    const prevUserReaction = localUserReaction;
    const isToggleOff = prevUserReaction === reactionKey;

    const newSummary = { ...localSummary };
    if (prevUserReaction) newSummary[prevUserReaction] = Math.max(0, (newSummary[prevUserReaction] || 0) - 1);
    if (!isToggleOff) newSummary[reactionKey] = (newSummary[reactionKey] || 0) + 1;

    setLocalSummary(newSummary);
    setLocalUserReaction(isToggleOff ? null : reactionKey);

    try {
      const result = await reactToItem(itemId, reactionKey, auth.access);
      setLocalSummary(result.reactions_summary);
      setLocalUserReaction(result.user_reaction);
      onReactionUpdate?.(itemId, result);
    } catch (err) {
      setLocalSummary(prevSummary);
      setLocalUserReaction(prevUserReaction);
      console.error("Reaction failed:", err);
    } finally {
      setIsReacting(false);
    }
  };

  const activeReactions = REACTIONS.filter((r) => (localSummary[r.key] || 0) > 0);
  const userReactionData = REACTIONS.find((r) => r.key === localUserReaction);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-end gap-1.5"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-wrap items-center justify-end gap-1">
        {activeReactions.map((r) => (
          <ReactionCount
            key={r.key}
            reactionKey={r.key}
            count={localSummary[r.key] || 0}
            isActive={localUserReaction === r.key}
          />
        ))}
      </div>

      {!disabled && (
        <motion.button
          type="button"
          aria-label="Add reaction"
          onClick={(e) => {
            e.stopPropagation();
            const opening = !pickerOpen;
            setPickerOpen(opening);
            setOpenedByClick(opening);
          }}
          whileTap={{ scale: 0.9 }}
          className={`inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border transition ${
            pickerOpen
              ? "border-[var(--primary-cta)] bg-[var(--surface)] text-[var(--primary-cta)]"
              : "border-[var(--dividers)] bg-white/60 text-[var(--muted-text)] hover:border-[var(--primary-cta)] hover:text-[var(--primary-cta)]"
          }`}
        >
          {userReactionData
            ? <LottieIcon src={userReactionData.lottie} emoji={userReactionData.emoji} size={22} playing={false} />
            : <Heart size={14} />
          }
        </motion.button>
      )}

      <AnimatePresence>
        {pickerOpen && (
          <ReactionPicker
            onReact={handleReact}
            userReaction={localUserReaction}
            onClose={() => { setPickerOpen(false); setOpenedByClick(false); }}
            openedByClick={openedByClick}
          />
        )}
      </AnimatePresence>
    </div>
  );
}