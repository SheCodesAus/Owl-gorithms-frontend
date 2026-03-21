import { Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const [hovering, setHovering] = useState(false);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div
        className="dashboard-gradient-card w-full max-w-lg overflow-hidden transition-all duration-300"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        style={{
          transform: hovering ? "translateY(-4px)" : "none",
          boxShadow: hovering
            ? "0 40px 90px rgba(10, 4, 25, 0.2), inset 0 1px 0 rgba(255,255,255,0.5)"
            : "0 20px 50px rgba(10, 4, 25, 0.1), inset 0 1px 0 rgba(255,255,255,0.3)",
        }}
      >
        <div className="dashboard-gradient-card-inner flex flex-col items-center gap-6 p-10 sm:p-14">
          <div className="space-y-2">
            <h1 className="brand-font text-[5rem] font-bold leading-none text-black sm:text-[6rem]">
              404
            </h1>
            <div className="mx-auto h-1.5 w-16 rounded-full bg-gradient-to-right from-[#ff9966] to-[#ff5e62]" />
          </div>

          <div className="space-y-3">
            <p className="text-[0.8rem] font-bold uppercase tracking-[0.25em] text-black/50">
              Page Not Found
            </p>
            <p className="text-xl font-medium text-black/90 sm:text-2xl">
              This path is off the bucket list.
            </p>
            <p className="mx-auto max-w-[280px] text-sm leading-relaxed text-black/60">
              The page you're looking for doesn't exist or has been moved to a private list.
            </p>
          </div>

          <div className="mt-4 flex flex-col items-center gap-4 w-full">
            <Link
              to="/"
              className="primary-gradient-button inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Home size={20} />
              Back to Dashboard
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-sm font-semibold text-black/40 transition hover:text-black/80"
            >
              <ArrowLeft size={16} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}