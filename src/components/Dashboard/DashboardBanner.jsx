import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronsDown, ChevronsUp, Bell } from "lucide-react";
import { useNotifications } from "../../hooks/useNotification";
import VoteControls from "../UI/VoteControls";
import RelativeTime from "../UI/RelativeTime";
import { Plus, Lock, CheckCircle2, Snowflake, Clock } from "lucide-react";

const MAX_EXPANDED = 4;

const TYPE_ICON_MAP = {
  item_added:      { icon: Plus,         color: "bg-[var(--surface-soft)] text-[var(--primary-cta)]" },
  item_locked_in:  { icon: Lock,         color: "bg-amber-50 text-amber-600" },
  item_completed:  { icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
  list_frozen:     { icon: Snowflake,    color: "bg-sky-50 text-sky-500" },
  freeze_reminder: { icon: Clock,        color: "bg-red-50 text-[var(--accent)]" },
};

function NotificationIcon({ type, size = 14 }) {
  const config = TYPE_ICON_MAP[type];
  if (!config) return null;
  const Icon = config.icon;
  return (
    <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${config.color}`}>
      <Icon size={size} strokeWidth={2.2} />
    </span>
  );
}

function DashboardBanner({ onVote, isVotingItemId, message }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const unread = notifications.filter((n) => !n.is_read);
  const latest = unread[0] ?? notifications[0] ?? null;
  const expandedItems = unread.slice(0, MAX_EXPANDED);
  const hasMore = unread.length > MAX_EXPANDED;

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) markAsRead(notification.id);
  };

  return (
    <>
      <motion.section
        className="dashboard-gradient-card overflow-hidden"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.35 }}
      >
        {/* ── Collapsed bar ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
            {/* Icon */}
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ff9a6c] to-[#ff5ea8]">
              <Bell size={16} strokeWidth={2.2} className="text-white" />
              {unreadCount > 0 && (
                <span className="sr-only">{unreadCount} unread</span>
              )}
            </span>

            {/* Latest notification message */}
            <div className="min-w-0 flex-1">
              {latest ? (
                <div className="flex items-center gap-2">
                  <NotificationIcon type={latest.notification_type} size={13} />
                  <p className="truncate text-sm font-semibold text-white sm:text-base">
                    {latest.message}
                  </p>
                </div>
              ) : (
                <p className="text-sm font-semibold text-white/70 sm:text-base">
                  No new notifications
                </p>
              )}
            </div>

            {/* Unread count badge */}
            {unreadCount > 0 && (
              <span className="shrink-0 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>

          {/* Inline vote controls if latest notification has an item */}
          {latest?.item_id && !isExpanded && (
            <div className="shrink-0">
              <VoteControls
                itemTitle={latest.item_title ?? "item"}
                score={latest.item_score ?? 0}
                activeVote={latest.item_user_vote ?? null}
                isVoting={isVotingItemId === latest.item_id}
                onUpvote={() => {
                  handleNotificationClick(latest);
                  onVote?.({ id: latest.item_id, title: latest.item_title }, "upvote");
                }}
                onDownvote={() => {
                  handleNotificationClick(latest);
                  onVote?.({ id: latest.item_id, title: latest.item_title }, "downvote");
                }}
                variant="focus"
              />
            </div>
          )}

          {/* Expand/collapse button */}
          {unread.length > 0 && (
            <motion.button
              type="button"
              className="shrink-0 cursor-pointer rounded-2xl bg-white/65 px-3 py-2 text-sm font-semibold text-[#4c2f6e] backdrop-blur-sm transition hover:bg-white/80 sm:px-4"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-label={isExpanded ? "Collapse notifications" : "Expand notifications"}
            >
              {isExpanded ? <ChevronsUp size={18} /> : <ChevronsDown size={18} />}
            </motion.button>
          )}
        </div>

        {/* ── Expanded notification list ─────────────────────────────────── */}
        <AnimatePresence initial={false}>
          {isExpanded && expandedItems.length > 0 && (
            <motion.div
              key="expanded"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div
                className="mx-4 mb-4 space-y-2 overflow-y-auto"
                style={{ maxHeight: `${MAX_EXPANDED * 80}px` }}
              >
                {expandedItems.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
                      notification.is_read
                        ? "bg-white/40"
                        : "bg-white/75"
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {/* Icon */}
                    <NotificationIcon type={notification.notification_type} />

                    {/* Message + time */}
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm leading-snug text-[var(--heading-text)] ${
                        notification.is_read ? "font-normal" : "font-semibold"
                      }`}>
                        {notification.message}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--muted-text)]">
                        <RelativeTime timestamp={notification.created_at} />
                      </p>
                    </div>

                    {/* Inline vote if item attached */}
                    {notification.item_id && (
                      <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                        <VoteControls
                          itemTitle={notification.item_title ?? "item"}
                          score={notification.item_score ?? 0}
                          activeVote={notification.item_user_vote ?? null}
                          isVoting={isVotingItemId === notification.item_id}
                          onUpvote={() => {
                            handleNotificationClick(notification);
                            onVote?.({ id: notification.item_id, title: notification.item_title }, "upvote");
                          }}
                          onDownvote={() => {
                            handleNotificationClick(notification);
                            onVote?.({ id: notification.item_id, title: notification.item_title }, "downvote");
                          }}
                          variant="focus"
                        />
                      </div>
                    )}

                    {/* Unread dot */}
                    {!notification.is_read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                    )}
                  </motion.div>
                ))}

                {hasMore && (
                  <p className="pb-1 text-center text-xs font-medium text-white/70">
                    +{unread.length - MAX_EXPANDED} more — open notifications for all
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Dashboard success message */}
      {message ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          {message}
        </div>
      ) : null}
    </>
  );
}

export default DashboardBanner;