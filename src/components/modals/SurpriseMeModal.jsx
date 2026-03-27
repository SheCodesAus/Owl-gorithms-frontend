import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, ArrowRight, Zap } from "lucide-react";

const REVEAL_LINES = [
  "The universe has spoken. Time to make it happen.",
  "Stop saving it for later. Later is now.",
  "This one's been waiting. Don't let it down.",
  "Fate picked this. Who are you to argue?",
  "Your bucket list called. This is the one.",
  "No excuses. This is yours to claim.",
];

export default function SurpriseMeModal({ isOpen, onClose, bucketLists, onNavigate }) {
  const [phase, setPhase] = useState("spinning"); // spinning | revealed
  const [displayTitle, setDisplayTitle] = useState("");
  const [chosenItem, setChosenItem] = useState(null);
  const [chosenList, setChosenList] = useState(null);
  const [revealLine, setRevealLine] = useState("");
  const intervalRef = useRef(null);
  const allItemsRef = useRef([]);

  // Build flat list of all items across all lists
  useEffect(() => {
    if (!isOpen) return;

    const all = [];
    bucketLists.forEach((list) => {
      (list.items ?? []).forEach((item) => {
        all.push({ item, list });
      });
    });
    allItemsRef.current = all;

    if (all.length === 0) return;

    // Pick the winner upfront
    const winner = all[Math.floor(Math.random() * all.length)];
    setChosenItem(winner.item);
    setChosenList(winner.list);
    setRevealLine(REVEAL_LINES[Math.floor(Math.random() * REVEAL_LINES.length)]);
    setPhase("spinning");

    // Slot machine spin
    let delay = 60;
    let elapsed = 0;
    const totalDuration = 1400;

    const spin = () => {
      const random = all[Math.floor(Math.random() * all.length)];
      setDisplayTitle(random.item.title);
      elapsed += delay;

      // Slow down progressively
      if (elapsed > 800) delay = Math.min(delay * 1.18, 300);

      if (elapsed >= totalDuration) {
        clearInterval(intervalRef.current);
        setDisplayTitle(winner.item.title);
        setTimeout(() => setPhase("revealed"), 120);
      }
    };

    intervalRef.current = setInterval(spin, delay);

    return () => clearInterval(intervalRef.current);
  }, [isOpen, bucketLists]);

  const handlePickAnother = () => {
    const all = allItemsRef.current;
    if (!all.length) return;

    const winner = all[Math.floor(Math.random() * all.length)];
    setChosenItem(winner.item);
    setChosenList(winner.list);
    setRevealLine(REVEAL_LINES[Math.floor(Math.random() * REVEAL_LINES.length)]);
    setPhase("spinning");

    let delay = 60;
    let elapsed = 0;
    const totalDuration = 1000;

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const random = all[Math.floor(Math.random() * all.length)];
      setDisplayTitle(random.item.title);
      elapsed += delay;
      if (elapsed > 600) delay = Math.min(delay * 1.18, 300);
      if (elapsed >= totalDuration) {
        clearInterval(intervalRef.current);
        setDisplayTitle(winner.item.title);
        setTimeout(() => setPhase("revealed"), 120);
      }
    }, delay);
  };

  const handleLetsGo = () => {
    if (!chosenItem || !chosenList) return;
    onNavigate(chosenList.id, chosenItem.id);
    onClose();
  };

  if (!isOpen) return null;

  const allItems = allItemsRef.current;

  if (allItems.length === 0) {
    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md rounded-[1.75rem] border border-white/40 bg-white/95 p-8 text-center shadow-[0_32px_80px_rgba(39,16,76,0.22)] backdrop-blur-xl"
        >
          <p className="text-lg font-semibold text-[var(--heading-text)]">No items yet!</p>
          <p className="mt-2 text-sm text-[var(--muted-text)]">Add some ideas to your lists first, then let fate decide.</p>
          <button type="button" onClick={onClose} className="secondary-modal-button mt-6">Close</button>
        </motion.div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 24 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-[1.75rem] shadow-[0_40px_100px_rgba(39,16,76,0.3)]"
      >
        {/* Background — matches your dashboard-focus-band aesthetic */}
        <div
          className="dashboard-focus-band"
          style={{ backgroundImage: "url('/wave.png')" }}
        >
          <div className="px-6 py-7">

            {/* Header */}
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Shuffle size={15} className="text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                Surprise me
              </span>
            </div>

            {/* Spin / reveal area */}
            <div className="min-h-[8rem] rounded-[1.25rem] border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
              <AnimatePresence mode="wait">
                {phase === "spinning" ? (
                  <motion.div
                    key="spinning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-2"
                  >
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/50">
                      Finding your destiny...
                    </p>
                    <p
                      className="brand-font text-2xl font-bold leading-tight text-white transition-all"
                      style={{ minHeight: "2.5rem" }}
                    >
                      {displayTitle || "..."}
                    </p>
                    {/* Shimmer bar */}
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full bg-white/40"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="revealed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col gap-2"
                  >
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/50">
                      Your pick
                    </p>
                    <p className="brand-font text-2xl font-bold leading-tight text-white">
                      {chosenItem?.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/60">
                      <span className="rounded-full bg-white/15 px-2.5 py-0.5 font-semibold">
                        {chosenList?.title}
                      </span>
                      {(chosenItem?.vote_score ?? chosenItem?.score) !== undefined && (
                        <span className="inline-flex items-center gap-1">
                          <Zap size={11} />
                          {chosenItem?.vote_score ?? chosenItem?.score ?? 0} votes
                        </span>
                      )}
                      {chosenItem?.created_by?.display_name && (
                        <span>by {chosenItem.created_by.display_name}</span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Reveal line */}
            <AnimatePresence>
              {phase === "revealed" && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 text-center text-sm font-semibold italic text-white/70"
                >
                  "{revealLine}"
                </motion.p>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={handlePickAnother}
                className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <Shuffle size={14} />
                Pick another
              </button>

              <motion.button
                type="button"
                onClick={handleLetsGo}
                disabled={phase === "spinning"}
                whileTap={{ scale: 0.96 }}
                className="inline-flex flex-[2] cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[var(--primary-cta)] shadow-[0_8px_24px_rgba(255,255,255,0.2)] transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Let's go
                <ArrowRight size={15} />
              </motion.button>
            </div>

          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}