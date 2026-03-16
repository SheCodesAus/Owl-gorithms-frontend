import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Globe,
  CalendarDays,
  CheckCircle2,
  Plus,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import Avatar from "../UI/Avatar";
import AvatarGroup from "../UI/AvatarGroup";
import RelativeTime from "../UI/RelativeTime";
import VoteControls from "../UI/VoteControls";

function DashboardFocusPanel({
  bucketList,
  isLoading,
  onUpvoteItem,
  onDownvoteItem,
  isVotingItemId,
  onAddItemClick,
  onInviteMembersClick,
  message,
}) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <motion.aside
        className="section-card flex min-h-[380px] items-center justify-center overflow-hidden p-5 sm:p-6"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.18, duration: 0.35 }}
      >
        <div className="space-y-3 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#d8d1ee] border-t-[#6b4eaa]" />
          <p className="text-base font-medium text-[var(--heading-text)] sm:text-lg">
            Loading your preview...
          </p>
        </div>
      </motion.aside>
    );
  }

  if (!bucketList) {
    return (
      <motion.aside
        className="section-card flex min-h-[380px] items-center justify-center overflow-hidden p-5 text-center sm:p-6"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.18, duration: 0.35 }}
      >
        <div className="space-y-3">
          <h2 className="brand-font text-2xl font-semibold text-[var(--heading-text)]">
            Pick a bucket list
          </h2>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-[var(--muted-text)] sm:text-base">
            Tap a card to see its progress, members, and most recent activity.
          </p>
        </div>
      </motion.aside>
    );
  }

  const items = bucketList.items ?? [];
  const completedCount = items.filter((item) => item.is_completed).length;
  const totalCount = items.length;
  const completionPercent = totalCount
    ? Math.round((completedCount / totalCount) * 100)
    : 0;

  const memberCount = bucketList.memberships?.length ?? 1;
  const memberUsers =
    bucketList.memberships?.map((membership) => membership.user) || [];

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

  const ownerName = bucketList.owner?.display_name || "Unknown owner";

  return (
    <motion.aside
      className="section-card h-full overflow-hidden p-0"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.18, duration: 0.35 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={bucketList.id}
          className="flex h-full flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Gradient header band */}
          <div className="dashboard-focus-band relative border-b border-white/12">
            <div className="relative z-10 px-5 py-5 text-white sm:px-6 sm:py-6">
              <div className="flex h-full flex-col gap-5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <p className="mr-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-white/68">
                    Overview
                  </p>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 text-sm text-white/90 backdrop-blur-sm">
                    {bucketList.is_public ? (
                      <Globe size={15} aria-hidden="true" />
                    ) : (
                      <Lock size={15} aria-hidden="true" />
                    )}
                    {bucketList.is_public ? "Public" : "Private"}
                  </span>

                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/90 backdrop-blur-sm">
                    By {ownerName}
                  </span>
                </div>

                <div className="space-y-3">
                  <h2 className="brand-font max-w-3xl text-[1.7rem] font-semibold leading-tight sm:text-[2rem]">
                    {bucketList.title}
                  </h2>

                  <p className="max-w-2xl text-sm leading-relaxed text-white/82 sm:text-base">
                    {bucketList.description ||
                      "No description yet for this bucket list."}
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/60">
                      Members
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <div className="shrink-0">
                        <AvatarGroup users={memberUsers} size="sm" max={4} />
                      </div>

                      <p className="text-sm text-white/82">
                        {memberCount} connected member
                        {memberCount === 1 ? "" : "s"}
                      </p>

                      {onInviteMembersClick ? (
                        <button
                          type="button"
                          onClick={onInviteMembersClick}
                          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/18 bg-white/12 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/18 focus:outline-none focus:ring-2 focus:ring-white/70"
                        >
                          <UserPlus size={16} aria-hidden="true" />
                          Invite
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onAddItemClick}
                      aria-label={`Add item to ${bucketList.title}`}
                      title="Add item"
                      className="group inline-flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-[linear-gradient(135deg,#15803d_0%,#4ade80_100%)] text-white shadow-[0_14px_36px_rgba(8,38,20,0.35)] transition hover:scale-105 hover:shadow-[0_18px_46px_rgba(8,38,20,0.45)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/80"
                    >
                      <Plus
                        size={28}
                        strokeWidth={2.8}
                        className="transition group-hover:rotate-90"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Success message */}
          {message ? (
            <div className="mx-5 mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 sm:mx-6">
              {message}
            </div>
          ) : null}

          <div className="flex flex-1 flex-col p-5 sm:p-6">
            {/* Progress */}
            <section className="space-y-4 border-b border-[var(--card-border)] pb-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-[var(--heading-text)] sm:text-xl">
                  Progress
                </h3>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-soft)] px-3 py-1 text-sm font-medium text-[var(--heading-text)]">
                  <CheckCircle2 size={15} aria-hidden="true" />
                  {completedCount} of {totalCount} completed
                </span>
              </div>

              <div className="space-y-2">
                <div className="h-3 overflow-hidden rounded-full bg-[#ddd4f0]">
                  <motion.div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#6326c9_0%,#8d42d0_55%,#f48c93_100%)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercent}%` }}
                    transition={{ delay: 0.18, duration: 0.7, ease: "easeOut" }}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <p className="text-[var(--muted-text)]">
                    {completionPercent}% complete
                  </p>

                  <p className="inline-flex items-center gap-1.5 text-[var(--muted-text)]">
                    <CalendarDays size={14} aria-hidden="true" />
                    {formattedDeadline
                      ? `Deadline: ${formattedDeadline}`
                      : "No deadline set"}
                  </p>
                </div>
              </div>
            </section>

            {/* Recent activity */}
            <section className="flex-1 pt-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-[var(--heading-text)] sm:text-xl">
                  Recent activity
                </h3>

                {items.length ? (
                  <span className="text-sm text-[var(--muted-text)]">
                    {items.length} total item{items.length === 1 ? "" : "s"}
                  </span>
                ) : null}
              </div>

              {recentItems.length ? (
                <div className="space-y-3">
                  {recentItems.map((item, index) => {
                    const isVoting = isVotingItemId === item.id;

                    return (
                      <motion.div
                        key={item.id ?? `${item.title}-${index}`}
                        className="rounded-2xl border border-[var(--card-border)] bg-white/72 p-3 shadow-[0_6px_20px_rgba(49,42,70,0.05)] backdrop-blur-[2px] sm:p-4"
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
                                  <p className="mt-1 line-clamp-1 text-sm text-[var(--muted-text)]">
                                    {item.description}
                                  </p>
                                ) : null}

                                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                                  <p className="text-xs font-medium text-[var(--heading-text)] sm:text-sm">
                                    {item.creator?.display_name || "Unknown member"}
                                  </p>

                                  <p className="text-xs text-black/42 sm:text-sm">
                                    <RelativeTime timestamp={item.updated_at} />
                                  </p>
                                </div>
                              </div>

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
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <motion.div
                  className="rounded-2xl border border-dashed border-[var(--card-border)] bg-[rgba(255,255,255,0.58)] p-4 text-sm text-[var(--muted-text)] sm:p-5 sm:text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  No updates yet. Bucket lists don't write themselves.
                </motion.div>
              )}
            </section>

            {/* Open button — now navigates correctly */}
            <button
              type="button"
              onClick={() => navigate(`/bucketlists/${bucketList.id}`)}
              className="primary-gradient-button mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition sm:text-lg"
            >
              Open list
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.aside>
  );
}

export default DashboardFocusPanel;