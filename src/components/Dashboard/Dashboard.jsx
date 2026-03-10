import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useBucketLists } from "../../hooks/useBucketLists";
import DashboardBanner from "./DashboardBanner";
import DashboardCardGrid from "./DashboardCardGrid";
import DashboardFocusPanel from "./DashboardFocusPanel";
import FormModal from "../UI/FormModal"
import CreateBucketListForm from "../forms/CreateBucketListForm"

function Dashboard({ user }) {
  const { bucketLists, isLoading, bucketListsError, loadBucketLists } =
    useBucketLists();

  const [selectedListId, setSelectedListId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };
  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleCreateSuccess = async (newBucketList) => {
    await loadBucketLists();
    setSelectedListId(newBucketList.id);
    setShowCreateModal(false);
  };

  useEffect(() => {
    if (!bucketLists.length) {
      setSelectedListId(null);
      return;
    }

    const selectedStillExists = bucketLists.some(
      (bucketList) => bucketList.id === selectedListId,
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
    <>
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
            onCreateClick={handleOpenCreateModal}
          />

          <DashboardFocusPanel
            bucketList={selectedList}
            isLoading={isLoading}
          />
        </section>
      </motion.div>

      <FormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create a new bucket list"
        subtitle="Start a fresh collection of goals, plans, and big ideas."
      >
        <CreateBucketListForm
          user={user}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      </FormModal>
    </>
  );
}

export default Dashboard;
