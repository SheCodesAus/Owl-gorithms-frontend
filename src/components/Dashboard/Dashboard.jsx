import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBucketLists } from "../../hooks/useBucketLists";
import { useVotes } from "../../hooks/useVotes";
import DashboardBanner from "./DashboardBanner";
import DashboardCardGrid from "./DashboardCardGrid";
import DashboardFocusPanel from "./DashboardFocusPanel";
import FormModal from "../UI/FormModal";
import CreateBucketListForm from "../forms/CreateBucketListForm";
import CreateItemForm from "../forms/CreateItemForm";
import InviteMembersModal from "../modals/InviteMembersModal";

function getNextVoteState(currentVote, currentScore, clickedVote) {
  const nextVote = currentVote === clickedVote ? null : clickedVote;

  let nextScore = currentScore;

  if (currentVote === "upvote") nextScore -= 1;
  if (currentVote === "downvote") nextScore += 1;

  if (nextVote === "upvote") nextScore += 1;
  if (nextVote === "downvote") nextScore -= 1;

  return {
    nextVote,
    nextScore,
  };
}

function Dashboard({ user }) {
  const { bucketLists, isLoading, bucketListsError, loadBucketLists } =
    useBucketLists();
  const { voteOnItem, clearVote } = useVotes();

  const [selectedListId, setSelectedListId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isVotingItemId, setIsVotingItemId] = useState(null);
  const [voteOverrides, setVoteOverrides] = useState({});
  const [dashboardMessage, setDashboardMessage] = useState("");
  const [focusPanelMessage, setFocusPanelMessage] = useState("");

  const handleOpenCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);

  const handleCreateSuccess = async (newBucketList) => {
    await loadBucketLists();
    setSelectedListId(newBucketList.id);
    setShowCreateModal(false);
    setDashboardMessage("Created Successfully!");
  };

  const handleCloseAddItemModal = () => setShowAddItemModal(false);

  const handleOpenAddItemModal = () => {
    if (!selectedListId) return;
    setShowAddItemModal(true);
  };

  const handleAddItemSuccess = async () => {
    await loadBucketLists();
    setShowAddItemModal(false);
    setFocusPanelMessage("Item added! Let's go!");
  };

  const handleOpenInviteModal = () => {
    if (!selectedListId) return;
    setShowInviteModal(true);
  };

  const handleCloseInviteModal = () => setShowInviteModal(false);

  useEffect(() => {
    if (!bucketLists.length) {
      setSelectedListId(null);
      return;
    }

    const selectedStillExists = bucketLists.some(
      (bucketList) => bucketList.id === selectedListId,
    );

    if (selectedListId && !selectedStillExists) {
      setSelectedListId(null);
    }
  }, [bucketLists, selectedListId]);

  useEffect(() => {
    if (!dashboardMessage) return;

    const timer = window.setTimeout(() => {
      setDashboardMessage("");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [dashboardMessage]);

  useEffect(() => {
    if (!focusPanelMessage) return;

    const timer = window.setTimeout(() => {
      setFocusPanelMessage("");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [focusPanelMessage]);

  const getBaseVoteScore = (item) => {
    return item.vote_score ?? item.votes_count ?? item.score ?? 0;
  };

  const getBaseUserVote = (item) => {
    return item.user_vote ?? item.current_user_vote ?? item.vote_type ?? null;
  };

  const getEffectiveItemVoteState = (item) => {
    const override = voteOverrides[item.id];

    return {
      voteScore: override?.voteScore ?? getBaseVoteScore(item),
      userVote: override?.userVote ?? getBaseUserVote(item),
    };
  };

  const setVoteOverride = (itemId, voteScore, userVote) => {
    setVoteOverrides((prev) => ({
      ...prev,
      [itemId]: {
        voteScore,
        userVote,
      },
    }));
  };

  const handleVote = async (item, clickedVote) => {
    const previousState = getEffectiveItemVoteState(item);

    const { nextVote, nextScore } = getNextVoteState(
      previousState.userVote,
      previousState.voteScore,
      clickedVote,
    );

    setVoteOverride(item.id, nextScore, nextVote);
    setIsVotingItemId(item.id);

    try {
      if (nextVote === null) {
        await clearVote(item.id);
      } else {
        await voteOnItem(item.id, nextVote);
      }
    } catch (error) {
      setVoteOverride(
        item.id,
        previousState.voteScore,
        previousState.userVote,
      );
      console.error("Vote failed:", error);
    } finally {
      setIsVotingItemId(null);
    }
  };

  const selectedList = useMemo(() => {
    const baseList =
      bucketLists.find((bucketList) => bucketList.id === selectedListId) ||
      null;

    if (!baseList) return null;

    return {
      ...baseList,
      items: (baseList.items ?? []).map((item) => {
        const effectiveVote = getEffectiveItemVoteState(item);

        return {
          ...item,
          vote_score: effectiveVote.voteScore,
          score: effectiveVote.voteScore,
          user_vote: effectiveVote.userVote,
          vote_type: effectiveVote.userVote,
        };
      }),
    };
  }, [bucketLists, selectedListId, voteOverrides]);

  useEffect(() => {
    if (!selectedList?.items?.length) return;

    const validItemIds = new Set(
      selectedList.items.map((item) => String(item.id)),
    );

    setVoteOverrides((prev) => {
      const next = Object.fromEntries(
        Object.entries(prev).filter(([itemId]) =>
          validItemIds.has(String(itemId)),
        ),
      );

      const hasChanged = Object.keys(next).length !== Object.keys(prev).length;
      return hasChanged ? next : prev;
    });
  }, [selectedList]);

  const isSelectedListOwner =
    selectedList?.owner?.id && user?.id
      ? selectedList.owner.id === user.id
      : false;

  const panelOpen = !!selectedList;

  return (
    <>
      <motion.div
        className="flex flex-col gap-6 lg:gap-7"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <DashboardBanner
          onVote={handleVote}
          isVotingItemId={isVotingItemId}
          message={dashboardMessage}
        />

        <motion.section
          className="relative pb-30"
          animate={{ maxWidth: panelOpen ? "1480px" : "920px" }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="relative">
            <motion.div
              className="flex flex-col"
              animate={{ width: panelOpen ? "46%" : "100%" }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              style={{ minWidth: 0 }}
            >
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
            </motion.div>

            <AnimatePresence>
              {panelOpen && (
                <motion.div
                  key="dashboard-focus-panel"
                  className="absolute top-0 right-0 bottom-0"
                  style={{ width: "52%" }}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                >
                  <DashboardFocusPanel
                    bucketList={selectedList}
                    isLoading={isLoading}
                    onUpvoteItem={(item) => handleVote(item, "upvote")}
                    onDownvoteItem={(item) => handleVote(item, "downvote")}
                    isVotingItemId={isVotingItemId}
                    onAddItemClick={handleOpenAddItemModal}
                    onInviteMembersClick={
                      isSelectedListOwner ? handleOpenInviteModal : undefined
                    }
                    message={focusPanelMessage}
                    onClose={() => setSelectedListId(null)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      </motion.div>

      <FormModal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        title="Create a new bucket list"
        subtitle="Start a fresh collection of goals, plans, and big ideas."
      >
        <CreateBucketListForm
          onClose={handleCloseCreateModal}
          onSuccess={handleCreateSuccess}
        />
      </FormModal>

      <FormModal
        isOpen={showAddItemModal}
        onClose={handleCloseAddItemModal}
        title="Drop in a fresh idea"
        subtitle="Add something wild to this list."
      >
        <CreateItemForm
          bucketListId={selectedListId}
          onClose={handleCloseAddItemModal}
          onSuccess={handleAddItemSuccess}
        />
      </FormModal>

      <InviteMembersModal
        isOpen={showInviteModal}
        onClose={handleCloseInviteModal}
        bucketListId={selectedListId}
      />
    </>
  );
}

export default Dashboard;