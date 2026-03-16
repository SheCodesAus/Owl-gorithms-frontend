import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Globe, CalendarDays, ChevronRight } from "lucide-react";

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysUntil(iso) {
  if (!iso) return null;
  return Math.ceil((new Date(iso) - new Date()) / (1000 * 60 * 60 * 24));
}

export default function BucketListHeader({ bucketList }) {
  if (!bucketList) return null;

  const daysLeft =
    bucketList?.has_deadline && bucketList?.deadline
      ? daysUntil(bucketList.deadline)
      : null;

  return (
    <motion.header
      className="overflow-hidden rounded-[1.75rem] border border-white/18"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Gradient hero band — matches DashboardFocusPanel */}
      <div className="dashboard-focus-band px-6 py-6 sm:px-7 sm:py-7">
        <div className="relative z-10 text-white">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-white/60">
            <Link
              to="/dashboard"
              className="transition hover:text-white/90"
            >
              My Lists
            </Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span className="text-white/90">Detail View</span>
          </nav>

          {/* Badges */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm">
              {bucketList.is_public ? (
                <Globe size={13} aria-hidden="true" />
              ) : (
                <Lock size={13} aria-hidden="true" />
              )}
              {bucketList.is_public ? "Public" : "Private"}
            </span>

            <span
              className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-sm ${
                bucketList.is_open
                  ? "bg-emerald-500/20 text-emerald-200"
                  : "bg-white/10 text-white/60"
              }`}
            >
              {bucketList.is_open ? "Open" : "Archived"}
            </span>
          </div>

          {/* Title + description */}
          <h1 className="brand-font text-[clamp(1.8rem,4vw,2.5rem)] font-bold leading-tight tracking-tight">
            {bucketList.title}
          </h1>

          {bucketList.description ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
              {bucketList.description}
            </p>
          ) : null}

          {/* Meta row */}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/55">
            {bucketList.date_created ? (
              <span>Created {formatDate(bucketList.date_created)}</span>
            ) : null}

            {bucketList.owner?.username ? (
              <span>Owner: {bucketList.owner.display_name ?? bucketList.owner.username}</span>
            ) : null}

            {daysLeft !== null ? (
              <span
                className={`inline-flex items-center gap-1.5 ${
                  daysLeft < 30 ? "font-semibold text-[var(--accent)]" : "text-white/55"
                }`}
              >
                <CalendarDays size={12} aria-hidden="true" />
                {daysLeft > 0
                  ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} until deadline`
                  : "Deadline passed"}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </motion.header>
  );
}