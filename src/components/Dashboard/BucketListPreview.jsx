import RecentUpdates from "./RecentUpdates";

function BucketListPreview({ bucketList }) {
  if (!bucketList) {
    return (
      <aside className="soft-panel p-6 lg:p-7">
        <p className="body-muted">Select a bucket list to preview it here.</p>
      </aside>
    );
  }

  const title = bucketList?.title || "Untitled bucket list";
  const isPublic = bucketList?.is_public;
  const privacyLabel = isPublic ? "Public" : "Private";

  const memberCount =
    bucketList?.member_count ??
    bucketList?.members_count ??
    bucketList?.members?.length ??
    1;

  const itemCount =
    bucketList?.item_count ??
    bucketList?.items_count ??
    0;

  const completedCount =
    bucketList?.completed_items_count ??
    bucketList?.completed_count ??
    0;

  const description =
    bucketList?.description?.trim() ||
    "No description yet. Open this list to start building it out with your team.";

  const ownerName =
    bucketList?.owner_name ||
    bucketList?.owner?.first_name ||
    bucketList?.owner ||
    "the owner";

  const deadlineText = bucketList?.deadline
    ? new Date(bucketList.deadline).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No deadline set";

  const progressPercent =
    itemCount > 0 ? Math.round((completedCount / itemCount) * 100) : 0;

  return (
    <aside className="soft-panel p-6 lg:p-7">
      <div className="space-y-6">
        <div className="rounded-[1.5rem] bg-[linear-gradient(120deg,#FFFFFF_0%,#F5EEFF_50%,#FFE4E0_100%)] p-5">
          <h2 className="section-title">{title}</h2>
          <p className="mt-3 body-text">
            {privacyLabel} · {memberCount} members · Created by {ownerName}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <p className="body-text">{description}</p>
          </div>

          <div className="border-t border-[var(--card-border)] pt-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="section-title !text-[1.25rem]">Progress</h3>
              <p className="meta-text">
                {completedCount} / {itemCount} completed
              </p>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-[#DDD6F6]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progressPercent}%`,
                  background:
                    "linear-gradient(90deg, #6B4EAA 0%, #A78BFA 50%, #FF8B8F 100%)",
                }}
              />
            </div>
          </div>

          <div className="border-t border-[var(--card-border)] pt-5">
            <h3 className="section-title !text-[1.25rem]">Deadline</h3>
            <p className="body-text mt-3">{deadlineText}</p>
          </div>

          <div className="border-t border-[var(--card-border)] pt-5">
            <RecentUpdates bucketList={bucketList} />
          </div>

          <div className="border-t border-[var(--card-border)] pt-6">
            <button type="button" className="btn-primary w-full">
              Open Bucket List
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default BucketListPreview;