import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Lock,
  Globe,
  CalendarDays,
  ChevronRight,
  Plus,
  UserPlus,
} from "lucide-react";
import AvatarGroup from "../UI/AvatarGroup";

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

export default function BucketListHeader({
  bucketList,
  onAddItemClick,
  onInviteMembersClick,
}) {
  if (!bucketList) return null;

  const daysLeft =
    bucketList?.has_deadline && bucketList?.deadline
      ? daysUntil(bucketList.deadline)
      : null;

  const memberships = bucketList.memberships ?? [];
  const memberUsers =
    memberships.map((membership) => membership.user).filter(Boolean) ?? [];
  const memberCount = memberships.length || 1;

  const memberNames = memberUsers
    .map((user) => user?.display_name ?? user?.username)
    .filter(Boolean);

  return (
    <motion.header
      className="overflow-hidden rounded-[1.75rem] border border-white/18"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="dashboard-focus-band px-6 py-6 sm:px-7 sm:py-7">
        <div className="relative z-10 text-white">
          <nav className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-white/60">
            <Link to="/dashboard" className="transition hover:text-white/90">
              Dashboard
            </Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span className="text-white/90">Bucket List</span>
          </nav>

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

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="brand-font text-[clamp(1.8rem,4vw,2.5rem)] font-bold leading-tight tracking-tight">
                {bucketList.title}
              </h1>

              {bucketList.description ? (
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                  {bucketList.description}
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/55">
                {bucketList.date_created ? (
                  <span>Created {formatDate(bucketList.date_created)}</span>
                ) : null}

                {bucketList.owner?.username ? (
                  <span>
                    Owner:{" "}
                    {bucketList.owner.display_name ?? bucketList.owner.username}
                  </span>
                ) : null}

                {daysLeft !== null ? (
                  <span
                    className={`inline-flex items-center gap-1.5 ${
                      daysLeft < 30
                        ? "font-semibold text-[var(--accent)]"
                        : "text-white/55"
                    }`}
                  >
                    <CalendarDays size={12} aria-hidden="true" />
                    {daysLeft > 0
                      ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} until deadline`
                      : "Deadline passed"}
                  </span>
                ) : null}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="shrink-0">
                  <AvatarGroup users={memberUsers} />
                </div>

                <div className="min-w-0">
                  <div className="flex shrink-0 items-center gap-3">
                  <p className="text-sm font-semibold text-white">
                    {memberCount} member{memberCount === 1 ? "" : "s"}
                  </p>

                  {onInviteMembersClick ? (
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/18 bg-white/12 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/18 focus:outline-none focus:ring-2 focus:ring-white/70"
                  onClick={onInviteMembersClick}
                >
                  <UserPlus size={15} aria-hidden="true" />
                  Invite
                </button>
              ) : null}

                </div>
              </div>
              </div>
            </div>

              <button
                type="button"
                onClick={onAddItemClick}
                aria-label="Add item to this list"
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
    </motion.header>
  );
}