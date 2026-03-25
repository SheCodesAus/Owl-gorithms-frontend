import AvatarGroup from "../UI/AvatarGroup";
import { Lock } from "lucide-react";
import RelativeTime from "../UI/RelativeTime";

function DashboardBucketCard({ bucketList, isSelected, onSelect, index }) {
const completedCount =
    bucketList.items?.filter((item) => item.status === "complete" || item.is_completed).length ?? 0;
  const totalCount = bucketList.items?.length ?? 0;
  const memberCount = bucketList.memberships?.length ?? 1;
  const memberUsers =
    bucketList.memberships?.map((membership) => membership.user) || [];

  return (
    <button
      type="button"
      onClick={() => onSelect(bucketList.id)}
      aria-pressed={isSelected}
      className={`dashboard-gradient-card w-full cursor-pointer text-left transition ${
        isSelected ? "ring-2 ring-white/80" : "ring-1 ring-transparent"
      }`}
    >
      <div className="dashboard-gradient-card-inner min-h-[140px] p-4 sm:min-h-[150px] sm:p-5">
        <div className="flex h-full flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="brand-font line-clamp-2 text-[1.2rem] font-semibold leading-tight text-white-900 sm:text-[1.45rem]">
                  {bucketList.title}
                </h2>

                {bucketList.description ? (
                  <p className="mt-1 line-clamp-2 text-sm text-white-600 sm:text-[0.95rem]">
                    {bucketList.description}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white-700">
              <span className="inline-flex items-center gap-1.5">
                {!bucketList.is_public ? <Lock size={15} aria-hidden="true" /> : null}
                {bucketList.is_public ? "Public" : "Private"}
              </span>

              <span>
                {memberCount} member{memberCount === 1 ? "" : "s"}
              </span>

              <span>
                {totalCount} item{totalCount === 1 ? "" : "s"}
              </span>

              <span>
                {completedCount} completed
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="min-w-0 text-sm text-white-500">
              <RelativeTime timestamp={bucketList.updated_at} />
            </p>

            <div className="shrink-0">
              <AvatarGroup users={memberUsers} size="xs" max={4} />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

export default DashboardBucketCard;