import AvatarGroup from "../UI/AvatarGroup";
import { Lock } from "lucide-react";
import RelativeTime from "../UI/RelativeTime";

function DashboardBucketCard({ bucketList, isSelected, onSelect, index }) {
  const completedCount =
    bucketList.items?.filter((item) => item.is_completed).length ?? 0;
  const totalCount = bucketList.items?.length ?? 0;
  const memberCount = bucketList.memberships?.length ?? 1;
  const memberUsers = bucketList.memberships?.map((membership) => membership.user) || [];

  return (
    <button
      type="button"
      onClick={() => onSelect(bucketList.id)}
      className={`dashboard-gradient-card min-h-[170px] p-5 text-left text-white sm:min-h-[185px] sm:p-6 cursor-pointer ${
        isSelected ? "ring-2 ring-white/80" : "ring-1 ring-transparent"
      }`}
    >
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="space-y-3">
          <h2 className="brand-font text-[1.5rem] font-semibold leading-tight sm:text-[1.8rem]">
            {bucketList.title}
          </h2>

          <div className="space-y-2 text-sm text-white/92 sm:text-base">
            <div className="flex items-center gap-2">
              {!bucketList.is_public ? <Lock size={16} /> : null}
              <span>
                {bucketList.is_public ? "Public" : "Private"} · {memberCount} member
                {memberCount === 1 ? "" : "s"}
              </span>
            </div>

            <p>
              {totalCount} item{totalCount === 1 ? "" : "s"} · {completedCount} completed
            </p>
            <p className="text-white/50">
              <RelativeTime timestamp={bucketList.updated_at} />
              </p>
          </div>
        </div>

        <div className="mt-4 flex -space-x-2">
          <AvatarGroup users={memberUsers} size="xs" max={4} />
        </div>
      </div>
    </button>
  );
}

export default DashboardBucketCard;