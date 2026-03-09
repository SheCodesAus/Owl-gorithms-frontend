import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useBucketLists } from "../../hooks/useBucketLists";
import DashboardBanner from "./DashboardBanner";
import DashboardCardGrid from "./DashboardCardGrid";
import DashboardFocusPanel from "./DashboardFocusPanel";

function Dashboard({ user }) {
  const {
    bucketLists,
    isLoading,
    bucketListsError,
    loadBucketLists,
  } = useBucketLists();

  const [selectedListId, setSelectedListId] = useState(null);

  useEffect(() => {
    if (!bucketLists.length) {
      setSelectedListId(null);
      return;
    }

    const selectedStillExists = bucketLists.some(
      (bucketList) => bucketList.id === selectedListId
    );

    if (!selectedListId || !selectedStillExists) {
      setSelectedListId(bucketLists[0].id);
    }
  }, [bucketLists, selectedListId]);

  const selectedList = useMemo(() => {
    return (
      bucketLists.find((bucketList) => bucketList.id === selectedListId) || null
    );
  }, [bucketLists, selectedListId]);

  return (
    <motion.div
      className="flex flex-col gap-6 lg:gap-7"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <DashboardBanner />

      <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <DashboardCardGrid
          user={user}
          bucketLists={bucketLists}
          selectedListId={selectedListId}
          onSelectList={setSelectedListId}
          isLoading={isLoading}
          error={bucketListsError}
          onRetry={loadBucketLists}
        />

        <div className="section-card">
        <DashboardFocusPanel
          bucketList={selectedList}
          isLoading={isLoading}
        />
        </div>
      </section>
    </motion.div>
  );
}

export default Dashboard;