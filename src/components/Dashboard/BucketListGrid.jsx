import BucketListCard from "./BucketListCard";

function BucketListGrid({ bucketLists, selectedListId, onSelectList }) {
  return (
    <section aria-label="Your bucket lists">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {bucketLists.map((bucketList, index) => (
          <BucketListCard
            key={bucketList.id}
            bucketList={bucketList}
            index={index}
            isSelected={bucketList.id === selectedListId}
            onSelect={() => onSelectList(bucketList.id)}
          />
        ))}
      </div>
    </section>
  );
}

export default BucketListGrid;