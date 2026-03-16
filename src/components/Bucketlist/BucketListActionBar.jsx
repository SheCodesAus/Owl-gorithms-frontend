import { motion } from "framer-motion";
import { Plus, UserPlus } from "lucide-react";

export default function BucketListActionBar({
  completedCount,
  totalCount,
  filter,
  onFilterChange,
  onAddItemClick,
  onInviteMembersClick,
}) {
  const FILTERS = ["all", "pending", "complete"];

  return (
    <motion.section
      className="bucketlist-action-bar-shell"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
    >
      <div className="bucketlist-action-bar">
        {/* Left: progress chip + filters */}
        <div className="bucketlist-action-bar-left">
          <div className="bucketlist-progress-chip">
            <span className="bucketlist-progress-chip-value">
              {completedCount}/{totalCount}
            </span>
            <span className="bucketlist-progress-chip-label">complete</span>
          </div>

          <div
            className="bucketlist-filter-row"
            role="tablist"
            aria-label="Item filters"
          >
            {FILTERS.map((value) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={filter === value}
                className={`bucketlist-filter-button cursor-pointer ${
                  filter === value ? "bucketlist-filter-button-active" : ""
                }`}
                onClick={() => onFilterChange(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Right: invite + add */}
        <div className="bucketlist-action-bar-right">
          {onInviteMembersClick ? (
            <button
              type="button"
              className="bucketlist-secondary-action inline-flex cursor-pointer items-center gap-2"
              onClick={onInviteMembersClick}
            >
              <UserPlus size={15} aria-hidden="true" />
              Invite
            </button>
          ) : null}

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
    </motion.section>
  );
}
