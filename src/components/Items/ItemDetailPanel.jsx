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
}) {
  if (!item) return null;

  return (
    <aside className="item-detail-panel h-full">
      <div className="item-detail-panel-shell h-full">
        {message ? (
          <div className="item-panel-message-banner">{message}</div>
        ) : null}

        <div className="item-detail-panel-scroll">
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