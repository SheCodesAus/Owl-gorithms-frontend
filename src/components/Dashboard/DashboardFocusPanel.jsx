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

function formatDisplayDate(dateString) {
  if (!dateString) return "";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

function formatDisplayTime(timeString) {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  if (hours == null || minutes == null) return "";
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" });
}

function getItemScheduleText(item) {
  const startDate = formatDisplayDate(item.start_date);
  const endDate = formatDisplayDate(item.end_date);
  const startTime = formatDisplayTime(item.start_time);
  const endTime = formatDisplayTime(item.end_time);
  const hasDate = Boolean(startDate || endDate);
  const hasTime = Boolean(startTime || endTime);
  if (!hasDate && !hasTime) return "";
  let dateText = "";
  let timeText = "";
  if (startDate && endDate && startDate !== endDate) {
    dateText = `${startDate} → ${endDate}`;
  } else {
    dateText = startDate || endDate || "";
  }
  if (startTime && endTime && startTime !== endTime) {
    timeText = `${startTime} → ${endTime}`;
  } else {
    timeText = startTime || endTime || "";
  }
  if (dateText && timeText) return `${dateText} • ${timeText}`;
  return dateText || timeText;
}

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
  const isOwner =
    bucketList?.owner?.id && user?.id
      ? Number(bucketList.owner.id) === Number(user.id)
      : false;

  const navigate = useNavigate();
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const optionsMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
        setShowOptionsMenu(false);
      }
    }
    function handleEscape(event) {
      if (event.key === "Escape") setShowOptionsMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const shellClass = isMobileOverlay
    ? "relative h-full"
    : "focus-panel-shell relative rounded-[1.75rem]";

  const bandClass = isMobileOverlay
    ? "dashboard-focus-band flex flex-col min-h-full px-5 py-6 sm:px-6"
    : "dashboard-focus-band flex flex-col px-5 py-5 sm:px-6 sm:py-6";

  if (isLoading) {
    return (
      <aside className={shellClass}>
        <div className={`${bandClass} items-center justify-center`}>
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

  if (!bucketList) return null;

  const items = bucketList.items ?? [];
  const completedCount = items.filter((item) => item.status === "complete").length;
  const totalCount = items.length;
  const completionPercent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
  const memberCount = bucketList.memberships?.length ?? 1;
  const memberUsers = bucketList.memberships?.map((m) => m.user) || [];

  const recentItems = [...items]
    .sort((a, b) => {
      const aTime = a.updated_at ? new Date(a.updated_at).getTime() : 0;
      const bTime = b.updated_at ? new Date(b.updated_at).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 3);

  const formattedDeadline = bucketList.decision_deadline
    ? new Date(bucketList.decision_deadline).toLocaleDateString("en-AU", {
        day: "numeric", month: "short", year: "numeric",
      })
    : null;

  const ownerName = bucketList.owner?.display_name || "Unknown";

  const handleCopyLink = async () => {
    try {
      if (onCopyBucketListLink) {
        onCopyBucketListLink(bucketList);
      } else {
        const url = `${window.location.origin}/bucketlists/${bucketList.id}`;
        await navigator.clipboard.writeText(url);
      }
    } catch (error) {
      console.error("Failed to copy bucket list link", error);
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

  return (
    <aside className={shellClass}>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white/70 text-black shadow-sm backdrop-blur-sm transition hover:bg-white"
          aria-label="Close focus panel"
        >
          <X size={16} />
        </button>
      ) : null}

      <motion.div
        key={bucketList.id}
        className={`${bandClass} flex-col`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* ── Header frosted glass ───────────────────────────────────────── */}
        <div className="dashboard-focus-band-inner flex flex-col gap-5">

          {/* Frozen banner */}
          {bucketList.is_frozen && (
            <div className="flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-700">
              <Snowflake size={15} aria-hidden="true" />
              This list is frozen — voting and new items are locked.
            </div>
          )}

          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <p className="mr-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-black/50">
                Overview
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/8 px-3 py-1.5 text-sm text-black/80 backdrop-blur-sm">
                {bucketList.is_public ? <Globe size={15} aria-hidden="true" /> : <Lock size={15} aria-hidden="true" />}
                {bucketList.is_public ? "Public" : "Private"}
              </span>
              <span className="rounded-full bg-black/8 px-3 py-1.5 text-sm text-black/80 backdrop-blur-sm">
                By {ownerName}
              </span>
            </div>

            {/* Options menu */}
            <div className="relative shrink-0" ref={optionsMenuRef}>
              <button
                type="button"
                className="item-options-button"
                onClick={() => setShowOptionsMenu((prev) => !prev)}
                aria-label="Bucket list options"
                aria-haspopup="menu"
                aria-expanded={showOptionsMenu}
              >
                <Ellipsis size={18} aria-hidden="true" />
              </button>

              {showOptionsMenu ? (
                <div className="absolute right-0 top-12 z-30 w-56 overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-xl">
                  <button type="button" onClick={handleOpenFullPage} className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--body-text)] transition hover:bg-black/5">
                    <ExternalLink size={16} aria-hidden="true" />
                    Open
                  </button>

                  <button type="button" onClick={handleCopyLink} className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--body-text)] transition hover:bg-black/5">
                    <Copy size={16} aria-hidden="true" />
                    Copy link
                  </button>

                  {isOwner ? (
                    <>
                      <button type="button" onClick={handleEdit} className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--body-text)] transition hover:bg-black/5">
                        <Pencil size={16} aria-hidden="true" />
                        Edit
                      </button>

                      {/* Dynamic freeze/unfreeze */}
                      <button type="button" onClick={handleFreeze} className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--body-text)] transition hover:bg-black/5">
                        {bucketList.is_frozen
                          ? <Flame size={16} aria-hidden="true" />
                          : <Snowflake size={16} aria-hidden="true" />
                        }
                        {bucketList.is_frozen ? "Unfreeze list" : "Freeze list"}
                      </button>

                      <div className="mx-3 h-px bg-black/8" />

                      <button type="button" onClick={handleDelete} className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50">
                        <Trash2 size={16} aria-hidden="true" />
                        Delete
                      </button>
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          {/* Title + description */}
          <div className="space-y-2">
            <h2 className="brand-font max-w-3xl text-[1.7rem] font-semibold leading-tight text-black sm:text-[2rem]">
              {bucketList.title}
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-black/70 sm:text-base">
              {bucketList.description || "No description yet for this bucket list."}
            </p>
          </div>

          {/* Members + add button */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/50">Members</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <div className="shrink-0">
                  <AvatarGroup users={memberUsers} size="sm" max={4} />
                </div>
                {onViewMembersClick ? (
                  <button type="button" onClick={onViewMembersClick} className="inline-flex gradient-border cursor-pointer items-center gap-2 rounded-full bg-[#ff9966]/8 px-4 py-2 text-sm font-semibold text-black backdrop-blur-sm transition hover:bg-[#ff9966]/12 focus:outline-none">
                    <Eye size={16} aria-hidden="true" />
                    View
                  </button>
                ) : null}
                {onInviteMembersClick ? (
                  <button type="button" onClick={onInviteMembersClick} className="inline-flex gradient-border cursor-pointer items-center gap-2 rounded-full bg-[#ff9966]/8 px-4 py-2 text-sm font-semibold text-black backdrop-blur-sm transition hover:bg-[#ff9966]/12 focus:outline-none">
                    <UserPlus size={16} aria-hidden="true" />
                    Invite
                  </button>
                ) : null}
                <p className="text-sm text-black/60">
                  {memberCount} connected member{memberCount === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            {/* Only show Add button if not frozen */}
            {!bucketList.is_frozen && (
              <button
                type="button"
                onClick={onAddItemClick}
                aria-label={`Add item to ${bucketList.title}`}
                className="group inline-flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[linear-gradient(135deg,#15803d_0%,#4ade80_100%)] text-white shadow-[0_14px_36px_rgba(8,38,20,0.35)] transition hover:scale-105 hover:shadow-[0_18px_46px_rgba(8,38,20,0.45)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/80"
              >
                <Plus size={24} strokeWidth={2.8} className="transition group-hover:rotate-90" />
              </button>
            )}
          </div>
        </div>

        {/* ── Body frosted glass ─────────────────────────────────────────── */}
        <div className="dashboard-focus-band-inner mt-4 flex flex-1 flex-col gap-5">
          {message ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
              {message}
            </div>
          ) : null}

          {/* Progress */}
          <section className="space-y-3 border-b border-black/8 pb-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-[var(--heading-text)] sm:text-lg">Progress</h3>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/6 px-3 py-1 text-sm font-medium text-[var(--heading-text)]">
                <CheckCircle2 size={14} aria-hidden="true" />
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
                  <CalendarDays size={12} aria-hidden="true" />
                  {formattedDeadline ? `Deadline: ${formattedDeadline}` : "No deadline set"}
                </p>
              </div>
            </div>
          </section>

          {/* Recent activity */}
          <section className="flex-1">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-[var(--heading-text)] sm:text-lg">Recent activity</h3>
              {items.length ? (
                <span className="text-sm text-[var(--muted-text)]">
                  {items.length} item{items.length === 1 ? "" : "s"}
                </span>
              ) : null}
            </div>

            {recentItems.length ? (
              <div className="space-y-2.5">
                {recentItems.map((item, index) => {
                  const isVoting = isVotingItemId === item.id;
                  const scheduleText = getItemScheduleText(item);
                  return (
                    <motion.div
                      key={item.id ?? `${item.title}-${index}`}
                      className="rounded-2xl border border-black/8 bg-white/60 p-3 backdrop-blur-[2px] sm:p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="shrink-0">
                          <Avatar user={item.creator} size="md" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-2 text-sm font-semibold leading-relaxed text-[var(--body-text)] sm:text-base">
                                {item.title}
                              </p>
                              {item.description ? (
                                <p className="mt-1 text-sm text-[var(--muted-text)]">{item.description}</p>
                              ) : null}
                              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                                <p className="text-xs font-medium text-[var(--heading-text)]">
                                  {item.creator?.display_name || "Unknown member"}
                                </p>
                                <p className="text-xs text-black/40">
                                  <RelativeTime timestamp={item.updated_at} />
                                </p>
                                {scheduleText ? (
                                  <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-black/8 bg-black/[0.04] px-3 py-1.5 text-xs font-medium text-[var(--heading-text)]">
                                    {item.start_time || item.end_time
                                      ? <Clock3 size={13} aria-hidden="true" />
                                      : <CalendarDays size={13} aria-hidden="true" />
                                    }
                                    <span className="truncate">{scheduleText}</span>
                                  </div>
                                ) : null}
                              </div>
                            </div>

                            {/* Only show vote controls if list is not frozen */}
                            {!bucketList.is_frozen && (
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

          <button
            type="button"
            onClick={() => navigate(`/bucketlists/${bucketList.id}`)}
            className="primary-gradient-button inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition sm:text-lg"
          >
            Open
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </motion.div>
    </aside>
  );
}

export default DashboardFocusPanel;