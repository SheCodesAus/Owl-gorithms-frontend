import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";

function NavBar() {
    const { auth, setAuth } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        window.localStorage.removeItem("access");
        setAuth({ access: null });
        setIsOpen(false);
    };

    const linkBase =
        "px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-sm";

    return (
        <div className="fixed top-0 left-0 w-full z-20 px-4 pt-4">
            <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-[#EEEAF7] bg-[#F8FAFC] px-5 py-4 shadow-md">
                <div className="nav-left">
                    <NavLink
                        to="/"
                        className="text-xl font-black tracking-tight text-[#6b4EAA] transition hover:scale-105 hover:text-[#A78BFA]"
                    >
                        Logo
                    </NavLink>
                </div>

                {/* Hamburger button */}
                <div
                    className="flex cursor-pointer flex-col gap-1.5 md:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span
                        className={`h-0.5 w-6 rounded-full bg-[#6b4EAA] transition-all duration-300 ${
                            isOpen ? "translate-y-2 rotate-45" : ""
                        }`}
                    />
                    <span
                        className={`h-0.5 w-6 rounded-full bg-[#6b4EAA] transition-all duration-300 ${
                            isOpen ? "opacity-0" : ""
                        }`}
                    />
                    <span
                        className={`h-0.5 w-6 rounded-full bg-[#6b4EAA] transition-all duration-300 ${
                            isOpen ? "-translate-y-2 -rotate-45" : ""
                        }`}
                    />
                </div>

                {/* Links */}
                <div
                    className={`absolute left-4 right-4 top-[calc(100%+0.75rem)] rounded-2xl border border-[#EEEAF7] bg-white p-4 shadow-lg md:static md:flex md:items-center md:gap-3 md:border-0 md:bg-transparent md:p-0 md:shadow-none ${
                        isOpen ? "flex flex-col gap-3" : "hidden md:flex"
                    }`}
                >
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `${linkBase} ${
                                isActive
                                    ? "bg-[#6b4EAA] text-white shadow-md"
                                    : "bg-[#EEEAF7] text-[#0F172A] hover:-translate-y-0.5 hover:bg-[#A78BFA] hover:text-white"
                            }`
                        }
                        onClick={() => setIsOpen(false)}
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `${linkBase} ${
                                isActive
                                    ? "bg-[#6b4EAA] text-white shadow-md"
                                    : "bg-[#EEEAF7] text-[#0F172A] hover:-translate-y-0.5 hover:bg-[#A78BFA] hover:text-white"
                            }`
                        }
                        onClick={() => setIsOpen(false)}
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/account"
                        className={({ isActive }) =>
                            `${linkBase} ${
                                isActive
                                    ? "bg-[#6b4EAA] text-white shadow-md"
                                    : "bg-[#EEEAF7] text-[#0F172A] hover:-translate-y-0.5 hover:bg-[#A78BFA] hover:text-white"
                            }`
                        }
                        onClick={() => setIsOpen(false)}
                    >
                        Placeholder
                    </NavLink>

                    {auth.access ? (
                        <Link
                            to="/"
                            onClick={handleLogout}
                            className="rounded-xl bg-[#FF5A5F] px-4 py-2 font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02]"
                        >
                            Log Out
                        </Link>
                    ) : (
                        <NavLink
                            to="/login"
                            onClick={() => setIsOpen(false)}
                            className="rounded-xl bg-[#6b4EAA] px-4 py-2 font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-[#A78BFA]"
                        >
                            Log In
                        </NavLink>
                    )}
                </div>
            </nav>
        </div>
    );
}

export default NavBar;