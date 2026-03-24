import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import {
  Lock,
  Globe,
  CalendarDays,
  CheckCircle2,
  Plus,
  UserPlus,
  ArrowRight,
  X,
  Eye,
  Clock3,
  Ellipsis,
  Pencil,
  Trash2,
  ExternalLink,
  Copy,
  Snowflake,
  Flame,
} from "lucide-react";
import Avatar from "../UI/Avatar";
import AvatarGroup from "../UI/AvatarGroup";
import RelativeTime from "../UI/RelativeTime";
import VoteControls from "../UI/VoteControls";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDisplayDate(dateString) {
  if (!dateString) return "";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDisplayTime(timeString) {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  if (hours == null || minutes == null) return "";
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getItemScheduleText(item) {
  const startDate = formatDisplayDate(item.start_date);
  const endDate = formatDisplayDate(item.end_date);
  const startTime = formatDisplayTime(item.start_time);
  const endTime = formatDisplayTime(item.end_time);
  if (!startDate && !endDate && !startTime && !endTime) return "";
  let dateText =
    startDate && endDate && startDate !== endDate
      ? `${startDate} → ${endDate}`
      : startDate || endDate || "";
  let timeText =
    startTime && endTime && startTime !== endTime
      ? `${startTime} → ${endTime}`
      : startTime || endTime || "";
  if (dateText && timeText) return `${dateText} • ${timeText}`;
  return dateText || timeText;
}

// ── Component ─────────────────────────────────────────────────────────────────
function DashboardFocusPanel({
  bucketList,
  isLoading,
  onUpvoteItem,
  onDownvoteItem,
  isVotingItemId,
  onAddItemClick,
  onInviteMembersClick,
  onViewMembersClick,
  onEditBucketList,
  onDeleteBucketList,
  onFreezeBucketList,
  onCopyBucketListLink,
  message,
  onClose,
  isMobileOverlay = false,
}) {
  const { auth } = useAuth();
  const user = auth?.user;
  const navigate = useNavigate();

  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
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

  // ── Shell classes ─────────────────────────────────────────────────────────
  const shellClass = isMobileOverlay
    ? "relative flex flex-col min-h-full"
    : "focus-panel-shell";

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <aside className={shellClass}>
        <div className="dashboard-focus-band flex flex-col flex-1 items-center justify-center">
          <div className="dashboard-focus-band-inner space-y-3 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#d8d1ee] border-t-[#6b4eaa]" />
            <p className="text-base font-medium text-[var(--heading-text)] sm:text-lg">
              Loading your preview...
            </p>
          </div>
        </div>
      </aside>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (!bucketList) return null;

  // ── All derived values — safe to compute after null guard ─────────────────
  const isOwner =
    bucketList.owner?.id && user?.id
      ? Number(bucketList.owner.id) === Number(user.id)
      : false;

  const currentUserMembership =
    bucketList.memberships?.find(
      (m) => Number(m.user?.id) === Number(user?.id),
    ) ?? null;
  const memberRole = currentUserMembership?.role ?? null;

  const canVoteInPanel = (() => {
    if (!user) return false;
    if (bucketList.is_frozen) return false;
    if (isOwner || memberRole === "editor") return true;
    if (memberRole === "viewer") return bucketList.allow_viewer_voting ?? false;
    return false;
  })();

  const items = bucketList.items ?? [];
  const completedCount = items.filter((i) => i.status === "complete").length;
  const totalCount = items.length;
  const completionPercent = totalCount
    ? Math.round((completedCount / totalCount) * 100)
    : 0;
  const memberCount = bucketList.memberships?.length ?? 1;
  const memberUsers = bucketList.memberships?.map((m) => m.user) ?? [];
  const ownerName = bucketList.owner?.display_name || "Unknown";

  const recentItems = [...items]
    .sort((a, b) => {
      const aTime = a.updated_at ? new Date(a.updated_at).getTime() : 0;
      const bTime = b.updated_at ? new Date(b.updated_at).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 3);

  const formattedDeadline = bucketList.decision_deadline
    ? new Date(bucketList.decision_deadline).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleCopyLink = async () => {
    try {
      if (onCopyBucketListLink) {
        onCopyBucketListLink(bucketList);
      } else {
        await navigator.clipboard.writeText(
          `${window.location.origin}/bucketlists/${bucketList.id}`,
        );
      }
    } catch (err) {
      console.error("Failed to copy link", err);
    } finally {
      setShowOptionsMenu(false);
    }
  };

  const handleOpenFullPage = () => {
    navigate(`/bucketlists/${bucketList.id}`);
    setShowOptionsMenu(false);
  };
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

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <aside className={shellClass}>
      {/* Close button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white/70 text-black shadow-sm backdrop-blur-sm transition hover:bg-white"
          aria-label="Close focus panel"
        >
          <X size={16} />
        </button>
      )}

      <motion.div
        key={bucketList.id}
        className="dashboard-focus-band"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* ── Sticky header ──────────────────────────────────────────────── */}
        <div
          className={`dashboard-focus-band-inner mx-3 shrink-0 flex flex-col gap-3 ${
            isMobileOverlay ? "mt-3 pt-12" : "mt-3"
          }`}
        >
          {/* Frozen banner */}
          {bucketList.is_frozen && (
            <div className="flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-700">
              <Snowflake size={15} aria-hidden="true" />
              This list is frozen — voting and new items are locked.
            </div>
          )}

          {/* Overview row + options menu */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
              <p className="mr-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-black/50">
                Overview
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/8 px-2.5 py-1.5 text-xs sm:px-3 sm:text-sm text-black/80 backdrop-blur-sm">
                {bucketList.is_public ? (
                  <Globe size={14} />
                ) : (
                  <Lock size={14} />
                )}
                {bucketList.is_public ? "Public" : "Private"}
              </span>
              <span className="rounded-full bg-black/8 px-2.5 py-1.5 text-xs sm:px-3 sm:text-sm text-black/80 backdrop-blur-sm">
                By {ownerName}
              </span>
            </div>

            {!isMobileOverlay && (
              <div className="relative shrink-0" ref={optionsMenuRef}>
                <button
                  type="button"
                  className="item-options-button"
                  onClick={() => setShowOptionsMenu((p) => !p)}
                  aria-label="Bucket list options"
                  aria-haspopup="menu"
                  aria-expanded={showOptionsMenu}
                >
                  <Ellipsis size={18} />
                </button>

                {showOptionsMenu && (
                  <div className="absolute right-0 top-12 z-30 w-56 overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-xl">
                    <button
                      type="button"
                      onClick={handleOpenFullPage}
                      className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--body-text)] transition hover:bg-black/5"
                    >
                      <ExternalLink size={16} /> Open
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--body-text)] transition hover:bg-black/5"
                    >
                      <Copy size={16} /> Copy link
                    </button>
                    {isOwner && (
                      <>
                        <button
                          type="button"
                          onClick={handleEdit}
                          className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--body-text)] transition hover:bg-black/5"
                        >
                          <Pencil size={16} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={handleFreeze}
                          className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--body-text)] transition hover:bg-black/5"
                        >
                          {bucketList.is_frozen ? (
                            <Flame size={16} />
                          ) : (
                            <Snowflake size={16} />
                          )}
                          {bucketList.is_frozen
                            ? "Unfreeze list"
                            : "Freeze list"}
                        </button>
                        <div className="mx-3 h-px bg-black/8" />
                        <button
                          type="button"
                          onClick={handleDelete}
                          className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Title + description */}
          <div className="space-y-1">
            <h2 className="brand-font max-w-3xl text-[1.45rem] font-semibold leading-[1.15] text-black sm:text-[2rem]">
              {" "}
              {bucketList.title}
            </h2>
            <p className="max-w-2xl text-[0.95rem] leading-relaxed text-black/70 sm:text-base">
              {bucketList.description ||
                "No description yet for this bucket list."}
            </p>
          </div>

          {isMobileOverlay && (
            <div className="relative" ref={optionsMenuRef}>
              <button
                type="button"
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white/65 px-4 text-sm font-semibold text-[var(--heading-text)] shadow-sm backdrop-blur-sm transition hover:bg-white"
                onClick={() => setShowOptionsMenu((p) => !p)}
                aria-label="Bucket list options"
                aria-haspopup="menu"
                aria-expanded={showOptionsMenu}
              >
                Options
              </button>

              {showOptionsMenu && (
                <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-xl">
                  <button
                    type="button"
                    onClick={handleOpenFullPage}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--body-text)] transition hover:bg-black/5"
                  >
                    <ExternalLink size={16} /> Open
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--body-text)] transition hover:bg-black/5"
                  >
                    <Copy size={16} /> Copy link
                  </button>
                  {isOwner && (
                    <>
                      <button
                        type="button"
                        onClick={handleEdit}
                        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--body-text)] transition hover:bg-black/5"
                      >
                        <Pencil size={16} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={handleFreeze}
                        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--body-text)] transition hover:bg-black/5"
                      >
                        {bucketList.is_frozen ? (
                          <Flame size={16} />
                        ) : (
                          <Snowflake size={16} />
                        )}
                        {bucketList.is_frozen ? "Unfreeze list" : "Freeze list"}
                      </button>
                      <div className="mx-3 h-px bg-black/8" />
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Members row + add button */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/50">
                Members
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <AvatarGroup users={memberUsers} size="sm" max={4} />
                {onViewMembersClick && (
                  <button
                    type="button"
                    onClick={onViewMembersClick}
                    className="inline-flex gradient-border cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] sm:gap-2 sm:px-4 sm:py-2 sm:text-sm font-semibold text-black backdrop-blur-sm transition hover:bg-[#ff9966]/12 focus:outline-none"
                  >
                    <Eye size={14} /> View
                  </button>
                )}
                {onInviteMembersClick && (
                  <button
                    type="button"
                    onClick={onInviteMembersClick}
                    className="inline-flex gradient-border cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] sm:gap-2 sm:px-4 sm:py-2 sm:text-sm font-semibold text-black backdrop-blur-sm transition hover:bg-[#ff9966]/12 focus:outline-none"
                  >
                    <UserPlus size={14} /> Invite
                  </button>
                )}
                <p className="text-sm text-black/60">
                  {memberCount} connected member{memberCount === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            {!bucketList.is_frozen && (
              <button
                type="button"
                onClick={onAddItemClick}
                aria-label={`Add item to ${bucketList.title}`}
                className="group inline-flex h-10 w-10 sm:h-14 sm:w-14 cursor-pointer items-center justify-center rounded-full bg-[linear-gradient(135deg,#15803d_0%,#4ade80_100%)] text-white shadow-[0_14px_36px_rgba(8,38,20,0.35)] transition hover:scale-105 active:scale-95 focus:outline-none"
              >
                <Plus
                  size={22}
                  strokeWidth={2.8}
                  className="transition group-hover:rotate-90"
                />
              </button>
            )}
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div className="px-3 pb-3 pt-3">
          <div className="dashboard-focus-band-inner flex flex-col gap-5">
            {/* Message banner */}
            {message && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                {message}
              </div>
            )}

            {/* Progress */}
            <section className="space-y-3 border-b border-black/8 pb-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-[var(--heading-text)] sm:text-lg">
                  Progress
                </h3>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/6 px-3 py-1 text-sm font-medium text-[var(--heading-text)]">
                  <CheckCircle2 size={14} />
                  {completedCount} of {totalCount} completed
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="h-2.5 overflow-hidden rounded-full bg-black/10">
                  <motion.div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#6326c9_0%,#8d42d0_55%,#f48c93_100%)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercent}%` }}
                    transition={{ delay: 0.18, duration: 0.7, ease: "easeOut" }}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--muted-text)]">
                  <p>{completionPercent}% complete</p>
                  <p className="inline-flex items-center gap-1.5">
                    <CalendarDays size={12} />
                    {formattedDeadline
                      ? `Deadline: ${formattedDeadline}`
                      : "No deadline set"}
                  </p>
                </div>
              </div>
            </section>

            {/* Recent activity */}
            <section>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-[var(--heading-text)] sm:text-lg">
                  Recent activity
                </h3>
                {items.length > 0 && (
                  <span className="text-sm text-[var(--muted-text)]">
                    {items.length} item{items.length === 1 ? "" : "s"}
                  </span>
                )}
              </div>

              {recentItems.length > 0 ? (
                <div className="space-y-2.5">
                  {recentItems.map((item, index) => {
                    const isVoting = isVotingItemId === item.id;
                    const scheduleText = getItemScheduleText(item);
                    return (
                      <motion.div
                        key={item.id ?? `${item.title}-${index}`}
                        className="rounded-2xl border border-black/8 bg-white/60 p-2.5 backdrop-blur-[2px] sm:p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-start gap-2.5">
                          <Avatar
                            user={item.creator}
                            size="md"
                            className="shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                              <p className="line-clamp-2 text-[0.95rem] font-semibold leading-snug text-[var(--body-text)] sm:text-base">
                                  {item.title}
                                </p>
                                {item.description && (
                                  <p className="mt-0.5 text-[13px] leading-snug text-[var(--muted-text)]">
                                    {item.description}
                                  </p>
                                )}
                                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                                  <p className="text-xs font-medium text-[var(--heading-text)]">
                                    {item.creator?.display_name ||
                                      "Unknown member"}
                                  </p>
                                  <p className="text-xs text-black/40">
                                    <RelativeTime timestamp={item.updated_at} />
                                  </p>
                                  {scheduleText && (
                                    <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-black/8 bg-black/[0.04] px-3 py-1.5 text-xs font-medium text-[var(--heading-text)]">
                                      {item.start_time || item.end_time ? (
                                        <Clock3 size={13} />
                                      ) : (
                                        <CalendarDays size={13} />
                                      )}
                                      <span className="truncate">
                                        {scheduleText}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {canVoteInPanel && (
                                <div className="shrink-0">
                                  <VoteControls
                                    itemTitle={item.title}
                                    score={item.score ?? 0}
                                    activeVote={item.vote_type ?? null}
                                    isVoting={isVoting}
                                    onUpvote={() => onUpvoteItem?.(item)}
                                    onDownvote={() => onDownvoteItem?.(item)}
                                    variant="panel"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-black/12 bg-white/40 p-4 text-sm text-[var(--muted-text)] sm:p-5">
                  Bucket lists don't write themselves — let's add something!
                </div>
              )}
            </section>

            {/* Open button */}
            <button
              type="button"
              onClick={() => navigate(`/bucketlists/${bucketList.id}`)}
              className="primary-gradient-button inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-lg font-semibold transition"
            >
              Open
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </aside>
  );
}

export default DashboardFocusPanel;
