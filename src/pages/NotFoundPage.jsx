import { Link } from "react-router-dom";
import { useState } from "react";

//update style

export default function NotFound() {
    const [hovering, setHovering] = useState(false);

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
            <div
                className="dashboard-gradient-card px-12 py-14 flex flex-col items-center gap-4"
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                style={{
                    boxShadow: hovering
                        ? "none"
                        : "0 28px 70px rgba(10, 4, 25, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
                    transition: "box-shadow 0.25s ease",
                }}
            >
                <h1 className="brand-font text-[4rem] font-bold leading-none text-white">
                    404
                </h1>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-white/60">
                    Not found
                </p>
                <p className="text-xl text-white/90">
                    Looks like you're lost...
                </p>
                <p className="text-xl">😕</p>
                <Link
                    to="/"
                    className="primary-gradient-button mt-4 rounded-full px-8 py-3 text-sm font-bold"
                >
                    Go back home
                </Link>
            </div>
        </div>
    );
}