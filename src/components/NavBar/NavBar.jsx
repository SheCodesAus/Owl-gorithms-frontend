import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";

function NavBar() {
    const { auth, setAuth } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const notifications = [
        "Steven added “Visit the pyramids”",
        "Ian completed “Climb Mt Fuji”",
        "“Visit Rome” is trending 🔥",
        "Vote in Easter Trip!"
    ];

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
                        <img src="../text_logo_light.png" width={100}/>
                    </NavLink>

                    <div className="hidden items-center gap-2 md:flex">
                        <NavLink to="/" className={desktopLinkClass}>
                            Home
                        </NavLink>

                        <NavLink to="/dashboard" className={desktopLinkClass}>
                            Dashboard
                        </NavLink>

                        <NavLink to="/account" className={desktopLinkClass}>
                            Placeholder
                        </NavLink>
                    </div>
                </div>

                <div className="flex items-center gap-3">
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
                            </span>
                            <span className="hidden text-base font-medium md:inline">3</span>
                        </motion.button>

                        <AnimatePresence>
                            {isNotificationsOpen && (
                                <motion.div
                                    className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-[280px] sm:w-[320px]"
                                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                >
                                    <div className="section-card-dark rounded-[1.5rem] p-3">
                                        <div className="mb-2 flex items-center justify-between px-2 pt-1">
                                            <h3 className="text-md font-semibold text-white/90">
                                                Notifications
                                            </h3>
                                            <span className="text-xs font-medium text-white/90">
                                                3 new
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            {notifications.map((item, index) => (
                                                <motion.button
                                                    key={item}
                                                    type="button"
                                                    className="w-full rounded-2xl bg-white/80 px-4 py-3 text-left text-sm text-[#312a46] transition hover:bg-white cursor-pointer"
                                                    initial={{ opacity: 0, y: 6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{
                                                        delay: index * 0.05,
                                                        duration: 0.18,
                                                    }}
                                                >
                                                    {item}
                                                </motion.button>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            className="mt-3 w-full rounded-2xl bg-[#f6f1ff] px-4 py-3 text-sm font-semibold text-[#6b4eaa] transition hover:bg-white cursor-pointer"
                                            onClick={closeNotifications}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

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

                    <button
                        type="button"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-sm transition duration-200 hover:bg-white/16 md:hidden cursor-pointer"
                        onClick={toggleMenu}
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMenuOpen}
                    >
                        <div className="relative flex h-5 w-6 flex-col justify-center">
                            <span
                                className={`absolute h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${
                                    isMenuOpen ? "rotate-45" : "-translate-y-2"
                                }`}
                            />
                            <span
                                className={`absolute h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${
                                    isMenuOpen ? "opacity-0" : "opacity-100"
                                }`}
                            />
                            <span
                                className={`absolute h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${
                                    isMenuOpen ? "-rotate-45" : "translate-y-2"
                                }`}
                            />
                        </div>
                    </button>
                </div>
            </nav>

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
                            <NavLink
                                to="/"
                                className={mobileLinkClass}
                                onClick={closeMenu}
                            >
                                Home
                            </NavLink>

                            <NavLink
                                to="/dashboard"
                                className={mobileLinkClass}
                                onClick={closeMenu}
                            >
                                Dashboard
                            </NavLink>

                            <NavLink
                                to="/account"
                                className={mobileLinkClass}
                                onClick={closeMenu}
                            >
                                Placeholder
                            </NavLink>

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