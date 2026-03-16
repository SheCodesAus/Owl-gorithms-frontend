import BucketListItemCard from "./BucketListItemCard";

export default function BucketListItemsPanel({
  items,
  selectedItemId,
  onSelectItem,
}) {
  return (
    <section className="bucketlist-items-panel">
      <div className="bucketlist-items-panel-scroll">
        {items.length === 0 ? (
          <div className="empty-state-card">
            Nothing here yet — make a plan, do something new!
          </div>
        ) : (
          <div className="bucketlist-items-stack">
            {items.map((item) => (
              <BucketListItemCard
                key={item.id}
                item={item}
                isSelected={item.id === selectedItemId}
                onSelect={() => onSelectItem(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}