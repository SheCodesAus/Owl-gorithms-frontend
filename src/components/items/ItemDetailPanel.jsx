import { motion } from "framer-motion";
import { X } from "lucide-react";
import ItemDetailCard from "./ItemDetailCard";
import ExtendedItemCard from "./ExtendedItemCard";

export default function ItemDetailPanel({
  item,
  bucketList,
  message,
  canEdit,
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
    ? "relative flex flex-col h-full overflow-hidden"
    : "focus-panel-shell";

  return (
    <aside className={shellClass}>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white/70 text-black shadow-sm backdrop-blur-sm transition hover:bg-white"
        aria-label="Close focus panel"
      >
        <X size={16} />
      </button>

      <motion.div
        key={item.id}
        className="dashboard-focus-band"
        style={{
          backgroundImage: "url('/deep-dusk2.jpg')",
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(107,78,170,0.22) transparent",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {message && (
          <div className="item-panel-message-banner">{message}</div>
        )}

        <div className="px-3 pb-3 pt-3">
          <div className="flex flex-col gap-5">
            <ItemDetailCard
              bucketList={bucketList}
              item={item}
              canEdit={canEdit}
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
            />
            <ExtendedItemCard itemTitle={item.title} isMobileOverlay={isMobileOverlay} />
          </div>
        </div>
      </motion.div>
    </aside>
  );
}