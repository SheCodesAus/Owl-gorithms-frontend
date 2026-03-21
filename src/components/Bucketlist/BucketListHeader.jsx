import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Lock, Globe, CalendarDays, ChevronRight, Plus, UserPlus, Eye,
  CheckCircle2, Ellipsis, Pencil, Trash2, Copy, Snowflake, Flame,
} from "lucide-react";
import AvatarGroup from "../UI/AvatarGroup";
import ViewMembersModal from "../modals/ViewMembersModal";

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric", month: "short", year: "numeric",
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
  onInviteMembersClick,
  onEditBucketList,
  onFreezeBucketList,
  onDeleteBucketList,
  onCopyLink,
  onChangeRole,
  onRemoveMember,
  onLeaveList,
  isUpdatingMemberId = null,
}) {
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const optionsMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(e.target)) {
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

  const memberships       = bucketList.memberships ?? [];
  const memberUsers       = memberships.map((m) => m.user).filter(Boolean);
  const memberCount       = memberships.length || 1;
  const items             = bucketList.items ?? [];
  const completedCount    = items.filter((i) => i.status === "complete").length;
  const completionPercent = items.length
    ? Math.round((completedCount / items.length) * 100)
    : 0;

  const daysLeft          = daysUntil(bucketList.decision_deadline);
  const formattedDeadline = formatDate(bucketList.decision_deadline);
  const ownerName         = bucketList.owner?.display_name ?? bucketList.owner?.username ?? "Unknown";

  const handleEdit   = () => { onEditBucketList?.(bucketList);   setShowOptionsMenu(false); };
  const handleFreeze = () => { onFreezeBucketList?.(bucketList); setShowOptionsMenu(false); };
  const handleDelete = () => { onDeleteBucketList?.(bucketList); setShowOptionsMenu(false); };
  const handleCopy   = () => { onCopyLink?.(bucketList);         setShowOptionsMenu(false); };

  return (
    <>
    <motion.header
      className="overflow-hidden rounded-[1.75rem] border border-white/18"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="dashboard-focus-band px-5 py-5 sm:px-6 sm:py-6">
        <div className="dashboard-focus-band-inner flex flex-col gap-5">

          {/* ── Frozen banner ─────────────────────────────────────────────── */}
          {bucketList.is_frozen && (
            <div className="flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-700">
              <Snowflake size={15} aria-hidden="true" />
              This list is frozen — voting and new items are locked.
            </div>
          )}

          {/* ── Top row: breadcrumb + badges + options ─────────────────────── */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-3">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-xs font-semibold text-black/60">
                <Link to="/dashboard" className="transition hover:text-black/90">
                  Dashboard
                </Link>
                <ChevronRight size={13} aria-hidden="true" />
                <span className="text-black/90">Bucket List</span>
              </nav>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/8 px-3 py-1.5 text-xs font-semibold text-black/80 backdrop-blur-sm">
                  {bucketList.is_public
                    ? <Globe size={13} aria-hidden="true" />
                    : <Lock size={13} aria-hidden="true" />}
                  {bucketList.is_public ? "Public" : "Private"}
                </span>
                <span className="rounded-full bg-black/8 px-3 py-1.5 text-xs font-semibold text-black/80 backdrop-blur-sm">
                  By {ownerName}
                </span>
                {bucketList.is_frozen && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
                    <Snowflake size={12} aria-hidden="true" />
                    Frozen
                  </span>
                )}
              </div>
            </div>

            {/* Options menu */}
            <div className="relative shrink-0" ref={optionsMenuRef}>
              <button
                type="button"
                className="item-options-button"
                onClick={() => setShowOptionsMenu((p) => !p)}
                aria-label="Bucket list options"
                aria-haspopup="menu"
                aria-expanded={showOptionsMenu}
              >
                <Ellipsis size={18} aria-hidden="true" />
              </button>

              {showOptionsMenu && (
                <div className="absolute right-0 top-12 z-30 w-56 overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-xl">
                  <button type="button" onClick={handleCopy} className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--body-text)] transition hover:bg-black/5">
                    <Copy size={16} aria-hidden="true" /> Copy link
                  </button>
                  {isOwner && (
                    <>
                      <button type="button" onClick={handleEdit} className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--body-text)] transition hover:bg-black/5">
                        <Pencil size={16} aria-hidden="true" /> Edit
                      </button>
                      <button type="button" onClick={handleFreeze} className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--body-text)] transition hover:bg-black/5">
                        {bucketList.is_frozen
                          ? <Flame size={16} aria-hidden="true" />
                          : <Snowflake size={16} aria-hidden="true" />}
                        {bucketList.is_frozen ? "Unfreeze list" : "Freeze list"}
                      </button>
                      <div className="mx-3 h-px bg-black/8" />
                      <button type="button" onClick={handleDelete} className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50">
                        <Trash2 size={16} aria-hidden="true" /> Delete
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Title + description ────────────────────────────────────────── */}
          <div className="space-y-2">
            <h1 className="brand-font text-[clamp(1.8rem,4vw,2.5rem)] font-bold leading-tight tracking-tight text-black">
              {bucketList.title}
            </h1>
            {bucketList.description && (
              <p className="max-w-2xl text-sm leading-relaxed text-black/70 sm:text-base">
                {bucketList.description}
              </p>
            )}
          </div>

          {/* ── Members row + add button ───────────────────────────────────── */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/50">Members</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <AvatarGroup users={memberUsers} size="sm" max={4} />
                <button
                  type="button"
                  onClick={() => setShowMembersModal(true)}
                  className="inline-flex gradient-border cursor-pointer items-center gap-2 rounded-full bg-[#ff9966]/8 px-4 py-2 text-sm font-semibold text-black backdrop-blur-sm transition hover:bg-[#ff9966]/12 focus:outline-none"
                >
                  <Eye size={15} aria-hidden="true" />
                  View
                </button>
                {onInviteMembersClick && (
                  <button
                    type="button"
                    className="inline-flex gradient-border cursor-pointer items-center gap-2 rounded-full bg-[#ff9966]/8 px-4 py-2 text-sm font-semibold text-black backdrop-blur-sm transition hover:bg-[#ff9966]/12 focus:outline-none"
                    onClick={onInviteMembersClick}
                  >
                    <UserPlus size={15} aria-hidden="true" />
                    Invite
                  </button>
                )}
                <p className="text-sm text-black/60">
                  {memberCount} connected member{memberCount === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            {/* Add item — hidden when frozen */}
            {!bucketList.is_frozen && (
              <button
                type="button"
                onClick={onAddItemClick}
                aria-label="Add item to this list"
                className="group inline-flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[linear-gradient(135deg,#15803d_0%,#4ade80_100%)] text-white shadow-[0_14px_36px_rgba(8,38,20,0.35)] transition hover:scale-105 hover:shadow-[0_18px_46px_rgba(8,38,20,0.45)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/80"
              >
                <Plus size={24} strokeWidth={2.8} className="transition group-hover:rotate-90" />
              </button>
            )}
          </div>

          {/* ── Progress bar ───────────────────────────────────────────────── */}
          <div className="space-y-3 border-t border-black/8 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-[var(--heading-text)]">Progress</h3>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/6 px-3 py-1 text-xs font-medium text-[var(--heading-text)]">
                <CheckCircle2 size={13} aria-hidden="true" />
                {completedCount} of {items.length} completed
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 overflow-hidden rounded-full bg-black/10">
                <motion.div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#6326c9_0%,#8d42d0_55%,#f48c93_100%)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercent}%` }}
                  transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-[var(--muted-text)]">
                <p>{completionPercent}% complete</p>
                <p className="inline-flex items-center gap-1.5">
                  <CalendarDays size={12} aria-hidden="true" />
                  {formattedDeadline
                    ? daysLeft !== null && daysLeft > 0
                      ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} until deadline`
                      : daysLeft === 0
                        ? "Deadline is today"
                        : "Deadline passed"
                    : "No deadline set"}
                </p>
              </div>
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