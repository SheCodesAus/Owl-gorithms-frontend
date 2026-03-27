import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Lock,
  Globe,
  CalendarDays,
  ChevronRight,
  Plus,
  UserPlus,
  Eye,
  CheckCircle2,
  Ellipsis,
  Pencil,
  Trash2,
  Copy,
  Snowflake,
  Flame,
} from "lucide-react";
import AvatarGroup from "../UI/AvatarGroup";
import ViewMembersModal from "../modals/ViewMembersModal";

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysUntil(iso) {
  if (!iso) return null;
  return Math.ceil((new Date(iso) - new Date()) / (1000 * 60 * 60 * 24));
}

export default function BucketListHeader({
  bucketList,
  isOwner = false,
  currentUser,
  onAddItemClick,
  onViewMembersClick,
  onInviteMembersClick,
  onEditBucketList,
  onFreezeBucketList,
  onDeleteBucketList,
  onCopyLink,
  onChangeRole,
  onRemoveMember,
  onLeaveList,
  isUpdatingMemberId = null,
  isFrozen,
}) {
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const optionsMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(e.target)
      ) {
        setShowOptionsMenu(false);
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") setShowOptionsMenu(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  if (!bucketList) return null;

  const memberships = bucketList.memberships ?? [];
  const memberUsers = memberships.map((m) => m.user).filter(Boolean);
  const items = bucketList.items ?? [];
  const completedCount = items.filter((i) => i.status === "complete").length;
  const completionPercent = items.length
    ? Math.round((completedCount / items.length) * 100)
    : 0;

  const daysLeft = daysUntil(bucketList.decision_deadline);
  const formattedDeadline = formatDate(bucketList.decision_deadline);
  const ownerName =
    bucketList.owner?.display_name ?? bucketList.owner?.username ?? "Unknown";

  const handleEdit = () => {
    onEditBucketList?.(bucketList);
    setShowOptionsMenu(false);
  };

  const handleFreeze = () => {
    onFreezeBucketList?.(bucketList);
    setShowOptionsMenu(false);
  };

  const handleDelete = () => {
    onDeleteBucketList?.(bucketList);
    setShowOptionsMenu(false);
  };

  const handleCopy = () => {
    onCopyLink?.(bucketList);
    setShowOptionsMenu(false);
  };

  return (
    <>
      <motion.header
        className={`relative overflow-hidden rounded-[1.75rem] border border-white/18 ${
          isFrozen ? "shadow-[inset_0_0_18px_rgba(190,230,255,0.28)]" : ""
        }`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {/* ❄️ Cold tint */}
        {isFrozen && (
          <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#d9f1ff]/28 via-[#eef9ff]/10 to-transparent" />
        )}

        <div className="dashboard-focus-band relative z-[2] overflow-hidden px-5 py-5 sm:px-6 sm:py-6">
          {/* ❄️ Bottom icicles (outer container) */}
          {isFrozen && (
            <>
              {/* top ice on outer band */}
              {/* <img
                src="/frozenlist.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[50%] w-full object-cover object-top opacity-80"
              /> */}

              {/* bottom ice on outer band, flipped */}
              <img
                src="/frozenlist.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-full w-full rotate-180 object-cover object-top opacity-80"
              />
            </>
          )}

          {/* ── INNER CARD ── */}
          <div className="dashboard-focus-band-inner relative overflow-hidden flex flex-col gap-5">
            {/* 🔥 CONTENT */}
            <div className="relative z-[2] flex flex-col gap-5">
              {isFrozen && (
                <div className="flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-700">
                  <Snowflake size={15} />
                  This list is frozen — voting and new items are locked.
                </div>
              )}

              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-3">
                  <nav className="flex items-center gap-1.5 text-xs font-semibold text-black/60">
                    <Link to="/dashboard">Dashboard</Link>
                    <ChevronRight size={13} />
                    <span className="text-black/90">Bucket List</span>
                  </nav>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/8 px-3 py-1.5 text-xs font-semibold text-black/80">
                      {bucketList.is_public ? (
                        <Globe size={13} />
                      ) : (
                        <Lock size={13} />
                      )}
                      {bucketList.is_public ? "Public" : "Private"}
                    </span>

                    <span className="rounded-full bg-black/8 px-3 py-1.5 text-xs font-semibold text-black/80">
                      By {ownerName}
                    </span>

                    {isFrozen && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
                        <Snowflake size={12} />
                        Frozen
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative shrink-0" ref={optionsMenuRef}>
                  <button
                    type="button"
                    className="item-options-button"
                    onClick={() => setShowOptionsMenu((p) => !p)}
                  >
                    <Ellipsis size={18} />
                  </button>

                  {showOptionsMenu && (
                    <div className="absolute right-0 top-12 z-30 w-56 overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-xl">
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--body-text)] transition hover:bg-black/5"
                      >
                        <Copy size={16} aria-hidden="true" />
                        Copy link
                      </button>

                      {isOwner && (
                        <>
                          <button
                            type="button"
                            onClick={handleEdit}
                            className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--body-text)] transition hover:bg-black/5"
                          >
                            <Pencil size={16} aria-hidden="true" />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={handleFreeze}
                            className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--body-text)] transition hover:bg-black/5"
                          >
                            {isFrozen ? (
                              <Flame size={16} aria-hidden="true" />
                            ) : (
                              <Snowflake size={16} aria-hidden="true" />
                            )}
                            {isFrozen ? "Unfreeze list" : "Freeze list"}
                          </button>

                          <div className="mx-3 h-px bg-black/8" />

                          <button
                            type="button"
                            onClick={handleDelete}
                            className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                          >
                            <Trash2 size={16} aria-hidden="true" />
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <h1 className="text-3xl font-bold">{bucketList.title}</h1>
              <p className="text-sm text-black/70">{bucketList.description}</p>

              <div className="flex items-center gap-3">
                <AvatarGroup users={memberUsers} size="sm" max={4} />
                <button onClick={onViewMembersClick}>View</button>
                {onInviteMembersClick && (
                  <button onClick={onInviteMembersClick}>Invite</button>
                )}
              </div>

              <div>
                <p>Progress</p>
                <p>{completionPercent}% complete</p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <ViewMembersModal
        isOpen={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        bucketList={bucketList}
        currentUser={currentUser}
        onChangeRole={onChangeRole}
        onRemoveMember={onRemoveMember}
        onLeaveList={onLeaveList}
        isUpdatingMemberId={isUpdatingMemberId}
      />
    </>
  );
}
