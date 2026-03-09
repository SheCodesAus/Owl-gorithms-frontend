import { motion } from "framer-motion";
import Avatar from "../UI/Avatar";
import RelativeTime from "../UI/RelativeTime";

function DashboardFocusPanel({ bucketList, isLoading }) {
  if (isLoading) {
    return (
      <motion.aside
        className="section-card flex min-h-[420px] items-center justify-center p-6 sm:p-7"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.18, duration: 0.35 }}
      >
        <div className="space-y-3 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#d8d1ee] border-t-[#6b4eaa]" />
          <p className="text-lg font-medium text-[var(--heading-text)]">
            Loading preview...
          </p>
        </div>
      </motion.aside>
    );
  }

  if (!bucketList) {
    return (
      <motion.aside
        className="section-card flex min-h-[420px] items-center justify-center p-6 text-center sm:p-7"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.18, duration: 0.35 }}
      >
        <div className="space-y-3">
          <h2 className="brand-font text-2xl font-semibold text-[var(--heading-text)]">
            Select a bucket list
          </h2>
          <p className="text-[var(--muted-text)]">
            Choose a list on the left to preview its details.
          </p>
        </div>
      </motion.aside>
    );
  }

  const items = bucketList.items ?? [];
  const completedCount = items.filter((item) => item.is_completed).length;
  const totalCount = items.length;
  const completionPercent = totalCount
    ? Math.round((completedCount / totalCount) * 100)
    : 0;

  const memberCount = bucketList.memberships?.length ?? 1;

  const recentItems = [...items]
    .sort((a, b) => {
      const aTime = a.updated_at ? new Date(a.updated_at).getTime() : 0;
      const bTime = b.updated_at ? new Date(b.updated_at).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 3);

  const formattedDeadline = bucketList.decision_deadline
    ? new Date(bucketList.decision_deadline).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const ownerName =
    bucketList.owner.display_name ||
    "";

  return (
    <motion.aside
      className="section-card h-full p-5 sm:p-6 lg:p-7"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.18, duration: 0.35 }}
    >
      <div className="flex h-full flex-col">
        <div className="space-y-3 border-b pb-5">
          <h2 className="brand-font text-[1.7rem] font-semibold text-[var(--heading-text)] sm:text-[2rem]">
            {bucketList.title}
          </h2>

          <p className="text-base text-[var(--body-text)] sm:text-lg">
            {bucketList.is_public ? "Public" : "Private"} · {memberCount} member
            {memberCount === 1 ? "" : "s"} · by {ownerName}
          </p>

          <p className="text-base leading-relaxed text-[var(--body-text)] sm:text-lg">
            {bucketList.description || "No description yet for this bucket list."}
          </p>
        </div>

        <div className="space-y-4 border-b py-5 soft-divider">
          <p className="text-lg font-semibold text-[var(--heading-text)] sm:text-[1.45rem]">
            Progress: <span className="font-medium">{completedCount} / {totalCount} completed</span>
          </p>

          <div className="h-4 overflow-hidden rounded-full bg-[#ddd4f0]">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,#6326c9_0%,#8d42d0_55%,#f48c93_100%)]"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercent}%` }}
              transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
            />
          </div>

          <p className="text-lg text-[var(--heading-text)] sm:text-[1.35rem]">
            {formattedDeadline ? `Deadline: ${formattedDeadline}` : "No deadline set"}
          </p>
        </div>

        <div className="flex-1 pt-5">
          <h3 className="mb-4 text-xl font-semibold text-[var(--heading-text)] sm:text-[1.6rem]">
            Recent
          </h3>

          {recentItems.length ? (
            <div className="space-y-4">
              {recentItems.map((item, index) => (
                <motion.div
                  key={item.id ?? `${item.title}-${index}`}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.26 + index * 0.08, duration: 0.28 }}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#7c37c6_0%,#f07ca6_100%)] text-sm font-semibold text-white sm:h-12 sm:w-12">
                    <Avatar
                    user={item.creator}
                    size="md"
                    />
                  </div>

                  <div>
                    <p className="text-sm leading-relaxed text-[var(--body-text)] sm:text-base">
                      <span className="font-semibold">
                        
                      {" "}
                      {item.title}</span>
                    </p>

                    {item.description ? (
                      <p className="mt-1 text-sm text-[var(--muted-text)]">
                        {item.description}
                      </p>
                    ) : null}
                    <p className="mt-1 text-xs text-[var(--muted-text)] justify-right">
                      {item.creator.display_name}</p>
                      <p className="text-black/50">
                    <RelativeTime timestamp={item.updated_at} />
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--muted-text)]">
              No recent item updates yet.
            </p>
          )}
        </div>

        <button
          type="button"
          className="primary-gradient-button mt-6 rounded-full px-6 py-3 text-base font-semibold transition sm:text-lg"
        >
          Let's Go
        </button>
      </div>
    </motion.aside>
  );
}

export default DashboardFocusPanel;