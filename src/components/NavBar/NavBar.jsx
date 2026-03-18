import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, Plus, Lock, CheckCircle2, Snowflake, Clock } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { useNotifications } from "../../hooks/useNotification";
import RelativeTime from "../UI/RelativeTime";

const TYPE_ICON_MAP = {
  item_added:      { icon: Plus,          color: "text-[var(--primary-cta)] bg-[var(--surface)]" },
  item_locked_in:  { icon: Lock,          color: "text-amber-600 bg-amber-50" },
  item_completed:  { icon: CheckCircle2,  color: "text-emerald-600 bg-emerald-50" },
  list_frozen:     { icon: Snowflake,     color: "text-sky-500 bg-sky-50" },
  freeze_reminder: { icon: Clock,         color: "text-[var(--accent)] bg-red-50" },
};

function NotificationIcon({ type }) {
  const config = TYPE_ICON_MAP[type];
  if (!config) return <div className="h-7 w-7 rounded-full bg-[var(--surface)]" />;
  const Icon = config.icon;
  return (
    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${config.color}`}>
      <Icon size={14} strokeWidth={2.2} />
    </div>
  );
}

function NavBar() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const handleLogout = () => {
    window.localStorage.removeItem("access");
    setAuth({ access: null });
    setIsMenuOpen(false);
    setIsNotificationsOpen(false);
  };

  const closeAll = () => {
    setIsMenuOpen(false);
    setIsNotificationsOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);
  const closeNotifications = () => setIsNotificationsOpen(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen((prev) => !prev);
    setIsMenuOpen(false);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    // Navigate to the relevant list or item
    if (notification.item_id && notification.bucket_list_id) {
      navigate(`/bucketlists/${notification.bucket_list_id}/items/${notification.item_id}`);
    } else if (notification.bucket_list_id) {
      navigate(`/bucketlists/${notification.bucket_list_id}`);
    }
    closeNotifications();
  };

  const desktopLinkClass = ({ isActive }) =>
    [
      "rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
      isActive
        ? "text-white bg-[var(--accent)]/70 shadow-white/70"
        : "text-white hover:bg-[var(--accent)]/30 hover:text-white",
    ].join(" ");

  const mobileLinkClass = ({ isActive }) =>
    [
      "rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200",
      isActive
        ? "bg-[#6b4eaa] text-white shadow-md"
        : "bg-white/70 text-[#312a46] hover:bg-white",
    ].join(" ");

  return (
    <motion.header
      className="app-navbar relative z-30"
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <nav className="relative flex items-center justify-between px-5 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 sm:gap-8">
          <NavLink
            to="/"
            onClick={closeAll}
            className="tracking-tight transition-transform duration-200 hover:scale-[1.02]"
          >
            <img src="/text_logo_light.png" width={100} />
          </NavLink>

          <div className="hidden items-center gap-2 md:flex">
            <NavLink to="/" className={desktopLinkClass}>Home</NavLink>
            <NavLink to="/dashboard" className={desktopLinkClass}>Dashboard</NavLink>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications bell */}
          <div className="relative">
            <motion.button
              type="button"
              className="glass-chip flex items-center gap-3 rounded-full px-3 py-2 text-white md:px-4 cursor-pointer"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleNotifications}
              aria-label="Open notifications"
              aria-expanded={isNotificationsOpen}
            >
              <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#ff9a6c] to-[#ff5ca8]">
                <Bell size={16} strokeWidth={2.2} />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </span>
              <span className="hidden text-base font-medium md:inline">
                {unreadCount > 0 ? unreadCount : ""}
              </span>
            </motion.button>

            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-[320px] sm:w-[380px]"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className="section-card-dark rounded-[1.5rem] p-3">
                    {/* Header */}
                    <div className="mb-2 flex items-center justify-between px-2 pt-1">
                      <h3 className="text-sm font-semibold text-white/90">
                        Notifications
                      </h3>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={markAllAsRead}
                            className="flex cursor-pointer items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs font-medium text-white/80 transition hover:bg-white/20"
                          >
                            <CheckCheck size={12} />
                            Mark all read
                          </button>
                        )}
                        <span className="text-xs font-medium text-white/60">
                          {unreadCount > 0 ? `${unreadCount} new` : "All caught up"}
                        </span>
                      </div>
                    </div>

                    {/* Notification list */}
                    <div className="max-h-[400px] overflow-y-auto space-y-1.5">
                      {isLoading ? (
                        <div className="px-4 py-6 text-center text-sm text-white/60">
                          Loading...
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-sm text-white/60">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((notification, index) => (
                          <motion.button
                            key={notification.id}
                            type="button"
                            onClick={() => handleNotificationClick(notification)}
                            className={`w-full cursor-pointer rounded-2xl px-4 py-3 text-left text-sm transition hover:bg-white ${
                              notification.is_read
                                ? "bg-white/60 text-[#312a46]"
                                : "bg-white text-[#312a46]"
                            }`}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04, duration: 0.18 }}
                          >
                            <div className="flex items-start gap-2.5">
                              <div className="mt-0.5 shrink-0">
                                <NotificationIcon type={notification.notification_type} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className={`leading-snug ${notification.is_read ? "font-normal" : "font-semibold"}`}>
                                  {notification.message}
                                </p>
                                <p className="mt-1 text-xs text-[#6b6880]">
                                  <RelativeTime timestamp={notification.created_at} />
                                </p>
                              </div>
                              {!notification.is_read && (
                                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                              )}
                            </div>
                          </motion.button>
                        ))
                      )}
                    </div>

                    <button
                      type="button"
                      className="mt-2 w-full cursor-pointer rounded-2xl bg-[#f6f1ff] px-4 py-3 text-sm font-semibold text-[#6b4eaa] transition hover:bg-white"
                      onClick={closeNotifications}
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Auth button */}
          {auth.access ? (
            <Link
              to="/"
              onClick={handleLogout}
              className="hidden rounded-full bg-[#ff5a5f] px-4 py-2 text-sm font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] md:inline-flex"
            >
              Log Out
            </Link>
          ) : (
            <NavLink
              to="/login"
              onClick={closeAll}
              className="hidden rounded-full bg-white/14 px-4 py-2 text-sm font-bold text-white transition-all duration-200 hover:bg-white/20 md:inline-flex"
            >
              Log In
            </NavLink>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-sm transition duration-200 hover:bg-white/16 md:hidden cursor-pointer"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            <div className="relative flex h-5 w-6 flex-col justify-center">
              <span className={`absolute h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${isMenuOpen ? "rotate-45" : "-translate-y-2"}`} />
              <span className={`absolute h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${isMenuOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${isMenuOpen ? "-rotate-45" : "translate-y-2"}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="px-4 pb-4 md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="section-card flex flex-col gap-3 rounded-[1.5rem] p-3">
              <NavLink to="/" className={mobileLinkClass} onClick={closeMenu}>Home</NavLink>
              <NavLink to="/dashboard" className={mobileLinkClass} onClick={closeMenu}>Dashboard</NavLink>

              {auth.access ? (
                <Link
                  to="/"
                  onClick={handleLogout}
                  className="rounded-2xl bg-[#ff5a5f] px-4 py-3 text-center font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5"
                >
                  Log Out
                </Link>
              ) : (
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-2xl bg-[#6b4eaa] px-4 py-3 text-center font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5"
                >
                  Log In
                </NavLink>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default NavBar;