import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../NotificationsProvider";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsDown, ChevronsUp, Bell, ArrowRight, X } from "lucide-react";
import { Plus, Lock, CheckCircle2, Snowflake, Clock } from "lucide-react";
import RelativeTime from "../UI/RelativeTime";

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

function DashboardBanner({ message }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const { notifications, unreadCount, markAsRead, dismiss, dismissAll } = useNotifications();

  const unread = notifications.filter((n) => !n.is_read);
  const latest = unread[0] ?? null;
  const expandedItems = notifications.slice(0, MAX_EXPANDED);
  const hasMore = notifications.length > MAX_EXPANDED;

  const getDestination = (notification) => {
    if (notification.item_id && notification.bucket_list_id) {
      return `/bucketlists/${notification.bucket_list_id}/items/${notification.item_id}`;
    }
    if (notification.bucket_list_id) {
      return `/bucketlists/${notification.bucket_list_id}`;
    }
    return null;
  };

  const handleView = (notification) => {
    if (!notification.is_read) markAsRead(notification.id);
    const dest = getDestination(notification);
    if (dest) {
      setIsExpanded(false);
      navigate(dest);
    }
  };

  const handleDismiss = (e, notification) => {
    e.stopPropagation();
    dismiss(notification.id);
  };

  return (
    <>
      <motion.section
        className="dashboard-gradient-banner overflow-hidden"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.35 }}
      >
        {/* ── Collapsed bar ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">

            {/* Bell icon */}
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ff9a6c] to-[#ff5ea8]">
              <Bell size={16} strokeWidth={2.2} className="text-white" />
            </span>

            {/* Latest unread message or all-clear state */}
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
                  {notifications.length > 0 ? "All caught up!" : "No new notifications"}
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

          <div className="flex shrink-0 items-center gap-2">
            {/* View button for latest unread */}
            {latest && getDestination(latest) && (
              <motion.button
                type="button"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-2xl bg-white/65 px-3 py-2 text-sm font-semibold text-[#4c2f6e] backdrop-blur-sm transition hover:bg-white/90"
                whileTap={{ scale: 0.97 }}
                onClick={() => handleView(latest)}
              >
                View
                <ArrowRight size={14} strokeWidth={2.4} />
              </motion.button>
            )}

            {/* Expand/collapse — show if any notifications exist */}
            {notifications.length > 0 && (
              <motion.button
                type="button"
                className="shrink-0 cursor-pointer rounded-2xl bg-gradient-to-br from-[#ff9a6c] to-[#ff5ea8] px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90 sm:px-4"
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsExpanded((prev) => !prev)}
                aria-label={isExpanded ? "Collapse notifications" : "Expand notifications"}
              >
                {isExpanded ? <ChevronsUp size={18} /> : <ChevronsDown size={18} />}
              </motion.button>
            )}
          </div>
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
                className="mx-4 mb-3 space-y-2 overflow-y-auto"
                style={{ maxHeight: `${MAX_EXPANDED * 76}px` }}
              >
                {expandedItems.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.04, duration: 0.2 }}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
                      notification.is_read ? "bg-white/40" : "bg-white/75"
                    }`}
                  >
                    {/* Type icon */}
                    <NotificationIcon type={notification.notification_type} />

                    {/* Message + time */}
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm leading-snug text-[var(--heading-text)] ${
                        notification.is_read ? "font-normal opacity-70" : "font-semibold"
                      }`}>
                        {notification.message}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--muted-text)]">
                        <RelativeTime timestamp={notification.created_at} />
                      </p>
                    </div>

                    {/* View button */}
                    {getDestination(notification) && (
                      <button
                        type="button"
                        onClick={() => handleView(notification)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[var(--dividers)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--primary-cta)] transition hover:bg-[var(--surface-soft)]"
                      >
                        View
                        <ArrowRight size={12} strokeWidth={2.4} />
                      </button>
                    )}

                    {/* Dismiss button */}
                    <button
                      type="button"
                      onClick={(e) => handleDismiss(e, notification)}
                      className="inline-flex cursor-pointer h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--muted-text)] transition hover:bg-black/8 hover:text-[var(--heading-text)]"
                      aria-label="Dismiss notification"
                    >
                      <X size={13} strokeWidth={2.4} />
                    </button>
                  </motion.div>
                ))}

                {hasMore && (
                  <p className="pb-1 text-center text-xs font-medium text-white/70">
                    +{notifications.length - MAX_EXPANDED} more — check the bell icon for all
                  </p>
                )}
              </div>

              {/* Dismiss all */}
              {notifications.length > 1 && (
                <div className="flex justify-end px-4 pb-3">
                  <button
                    type="button"
                    onClick={dismissAll}
                    className="cursor-pointer text-xs font-medium text-white/60 transition hover:text-white/90"
                  >
                    Dismiss all
                  </button>
                </div>
              )}
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