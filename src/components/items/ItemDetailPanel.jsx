import { motion } from "framer-motion";
import { X } from "lucide-react";
import ItemDetailCard from "./ItemDetailCard";
import ExtendedItemCard from "./ExtendedItemCard";

export default function ItemDetailPanel({
  item,
  bucketList,
  message,
  canEdit,
  canManageDates,
  isOwner,
  canVote,
  voteScore,
  userVote,
  isVoting,
  onUpvote,
  onDownvote,
  onAddToCalendar,
  onAddDate,
  onEditDate,
  onEdit,
  onDelete,
  onUpdateStatus,
  onOptionsClick,
  onClose,
  isMobileOverlay = false,
}) {
  if (!item) return null;

  const shellClass = isMobileOverlay
    ? "relative flex h-full flex-col overflow-hidden"
    : "focus-panel-shell relative";

  return (
    <aside className={shellClass}>
      <motion.div
        key={item.id}
        className="dashboard-focus-band"
        style={{
          backgroundImage: "url('/wave.png')",
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(107,78,170,0.22) transparent",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {message && <div className="item-panel-message-banner">{message}</div>}

        <div className="px-3 pb-3 pt-3">
          <div className={`flex flex-col ${isMobileOverlay ? "gap-3" : "gap-5"}`}>
            <div className="relative">
              <button
                type="button"
                onClick={onClose}
                className={`absolute z-20 inline-flex cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white/78 text-black shadow-sm backdrop-blur-sm transition hover:bg-white ${
                  isMobileOverlay
                    ? "right-3 top-3 h-9 w-9"
                    : "right-4 top-4 h-9 w-9"
                }`}
                aria-label="Close focus panel"
              >
                <X size={16} />
              </button>

              <ItemDetailCard
                bucketList={bucketList}
                item={item}
                canEdit={canEdit}
                canManageDates={canManageDates}
                isOwner={isOwner}
                canVote={canVote}
                voteScore={voteScore}
                userVote={userVote}
                isVoting={isVoting}
                onBack={() => {}}
                onUpvote={onUpvote}
                onDownvote={onDownvote}
                onAddToCalendar={onAddToCalendar}
                onAddDate={onAddDate}
                onEditDate={onEditDate}
                onEdit={onEdit}
                onDelete={onDelete}
                onUpdateStatus={onUpdateStatus}
                onOptionsClick={onOptionsClick}
                showBreadcrumb={false}
                isMobileOverlay={isMobileOverlay}
              />
            </div>

            <ExtendedItemCard
              itemTitle={item.title}
              isMobileOverlay={isMobileOverlay}
            />
          </div>
        </div>
      </motion.div>
    </aside>
  );
}