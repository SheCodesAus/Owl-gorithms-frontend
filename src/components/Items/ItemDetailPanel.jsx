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
  onAddDate,
  onEditDate,
  onEdit,
  onDelete,
  onUpdateStatus,
  onOptionsClick,
  onClose,
}) {
  if (!item) return null;

  return (
    <aside
      className="item-detail-panel"
      style={{ position: "sticky", top: "1rem" }}
    >
      <div className="item-detail-panel-shell">
        <button
          type="button"
          onClick={onClose}
          className="item-detail-panel-close modal-close-button"
          aria-label="Close focus panel"
        >
          <X size={16} />
        </button>

        {message ? (
          <div className="item-panel-message-banner">{message}</div>
        ) : null}

        <div className="item-detail-panel-scroll">
          <div className="item-page-stack">
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
              onAddDate={onAddDate}
              onEditDate={onEditDate}
              onEdit={onEdit}
              onDelete={onDelete}
              onUpdateStatus={onUpdateStatus}
              onOptionsClick={onOptionsClick}
              showBreadcrumb={false}
            />

            <ExtendedItemCard itemTitle={item.title} />
          </div>
        </div>
      </div>
    </aside>
  );
}