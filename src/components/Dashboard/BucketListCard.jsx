function BucketListCard({ bucketList, index, isSelected, onSelect }) {
  const title = bucketList?.title || "Untitled bucket list";
  const isPublic = bucketList?.is_public;
  const privacyLabel = isPublic ? "Public" : "Private";

  const memberCount =
    bucketList?.member_count ??
    bucketList?.members_count ??
    bucketList?.members?.length ??
    1;

  const itemCount = bucketList?.item_count ?? bucketList?.items_count ?? 0;

  const completedCount =
    bucketList?.completed_items_count ?? bucketList?.completed_count ?? 0;

  const gradients = [
    "linear-gradient(120deg, #3B2E7E 0%, #6B4EAA 55%, #DDA0C8 82%, #FFB19A 100%)",
    "linear-gradient(120deg, #4B378F 0%, #7B5CD6 52%, #F0A8C6 80%, #FFC2A8 100%)",
    "linear-gradient(120deg, #433286 0%, #6F56C2 52%, #BE96F6 78%, #FFB3B3 100%)",
    "linear-gradient(120deg, #4F3B97 0%, #7C6EE6 48%, #D89AD5 78%, #FFB48C 100%)",
  ];

  const gradient = gradients[index % gradients.length];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative min-h-[220px] overflow-hidden rounded-[1.6rem] border text-left transition duration-200 hover:scale-[1.02] ${
        isSelected
          ? "scale-[1.01] border-[#A78BFA] shadow-[0_18px_40px_rgba(107,78,170,0.18)]"
          : "border-white/60 shadow-[0_14px_30px_rgba(107,78,170,0.12)]"
      }`}
      aria-pressed={isSelected}
      aria-label={`Preview ${title}`}
    >
      <div className="absolute inset-0" style={{ background: gradient }} />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.10),transparent_22%)]" />

      <div className="relative z-10 flex h-full flex-col justify-between p-6">
        <div className="max-w-[80%] rounded-[1.3rem] bg-[rgba(35,20,80,0.35)] p-5 backdrop-blur-sm">
          <h3 className="text-[2rem] leading-[1.05] font-semibold tracking-[-0.03em] text-white">
            {title}
          </h3>

          <p className="mt-4 text-[0.95rem] font-medium text-white/90">
            {privacyLabel} · {memberCount} members
          </p>

          <p className="mt-5 text-[1.05rem] font-medium text-white/95">
            {itemCount} items · {completedCount} completed
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center -space-x-3">
            <div className="h-10 w-10 rounded-full border-2 border-white/80 bg-[#F9C5B6]" />
            <div className="h-10 w-10 rounded-full border-2 border-white/80 bg-[#E7B8D7]" />
            <div className="h-10 w-10 rounded-full border-2 border-white/80 bg-[#C1B8F5]" />
          </div>

          {isSelected ? (
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm">
              Selected
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}

export default BucketListCard;