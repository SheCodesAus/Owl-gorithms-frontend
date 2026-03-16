import { X } from "lucide-react";
import ItemDetailCard from "./ItemDetailCard";
import ExtendedItemCard from "./ExtendedItemCard";

export default function ItemDetailPanel({
  item,
  bucketList,
  message,
  canEdit,
  isOwner,
  voteScore,
  userVote,
  isVoting,
  onUpvote,
  onDownvote,
  onAddToCalendar,
  onEdit,
  onDelete,
  onUpdateStatus,
  onClose,
}) {
  if (!item) return null;

  return (
    <aside
      className="item-detail-panel"
      style={{ position: "sticky", top: "1rem" }}
    >
      <div
        className="item-detail-panel-shell"
        style={{
          minHeight: "calc(100vh - 8rem)",
          maxHeight: "calc(100vh - 8rem)",
          overflowY: "auto",
          overscrollBehavior: "contain",
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="modal-close-button absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full"
          aria-label="Close focus panel"
        >
          <X size={16} />
        </button>

        {message ? (
          <div className="item-panel-message-banner">{message}</div>
        ) : null}

        <div className="item-detail-panel-scroll" style={{ overflowY: "unset", maxHeight: "unset", height: "auto", padding: "1rem" }}>
          <ItemDetailCard
            bucketList={bucketList}
            item={item}
            canEdit={canEdit}
            isOwner={isOwner}
            voteScore={voteScore}
            userVote={userVote}
            isVoting={isVoting}
            onBack={() => {}}
            onUpvote={onUpvote}
            onDownvote={onDownvote}
            onAddToCalendar={onAddToCalendar}
            onEdit={onEdit}
            onDelete={onDelete}
            onUpdateStatus={onUpdateStatus}
            showBreadcrumb={false}
          />

          <ExtendedItemCard itemTitle={item.title} />
        </div>
      </div>
    </aside>
  );
}