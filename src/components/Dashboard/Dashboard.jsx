import { useEffect, useMemo, useState } from "react";
import { useBucketLists } from "../../hooks/useBucketLists";
import NotificationsBanner from "./NotificationsBanner";
import DashboardHeader from "./DashboardHeader";
import BucketListGrid from "./BucketListGrid";
import BucketListPreview from "./BucketListPreview";
import DashboardEmptyState from "./DashboardEmptyState";
import DashboardLoadingState from "./DashboardLoadingState";
import DashboardErrorState from "./DashboardErrorState";

function Dashboard({ user, setUser }) {
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
    <div className="page-shell">
      <div className="page-width space-y-6">
        <NotificationsBanner />

        <section className="page-panel p-5 sm:p-6 lg:p-7">
          {isLoading ? (
            <DashboardLoadingState />
          ) : bucketListsError ? (
            <DashboardErrorState
              message={bucketListsError}
              onRetry={loadBucketLists}
            />
          ) : !bucketLists.length ? (
            <DashboardEmptyState />
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
              <div className="space-y-5">
                <DashboardHeader user={user} />
                <BucketListGrid
                  bucketLists={bucketLists}
                  selectedListId={selectedListId}
                  onSelectList={setSelectedListId}
                />
              </div>

              <BucketListPreview bucketList={selectedList} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;