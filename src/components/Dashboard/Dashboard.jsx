import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useBucketLists } from "../../hooks/useBucketLists";
import { useVotes } from "../../hooks/useVotes";
import DashboardBanner from "./DashboardBanner";
import DashboardCardGrid from "./DashboardCardGrid";
import DashboardFocusPanel from "./DashboardFocusPanel";
import FormModal from "../UI/FormModal";
import CreateBucketListForm from "../forms/CreateBucketListForm";
import CreateItemForm from "../forms/CreateItemForm";
import InviteMembersModal from "../modals/InviteMembersModal";

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
    setDashboardMessage("Created Successfully!")
  };

  const handleCloseAddItemModal = () => setShowAddItemModal(false);
  const handleOpenAddItemModal = () => {
    if (!selectedListId) return;
    setShowAddItemModal(true);
  };
  const handleAddItemSuccess = async () => {
    await loadBucketLists();
    setShowAddItemModal(false);
    setFocusPanelMessage("Item added! Let's go!")
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

    if (!selectedListId || !selectedStillExists) {
      setSelectedListId(bucketLists[0].id);
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
    return item.user_vote ?? item.current_user_vote ?? null;
  };

  const getEffectiveItemVoteState = (item) => {
    const override = voteOverrides[item.id];

    return {
      voteScore: override?.voteScore ?? getBaseVoteScore(item),
      userVote: override?.userVote ?? getBaseUserVote(item),
    };
  };

  const applyVoteOverride = (item, nextVote) => {
    const current = getEffectiveItemVoteState(item);
    let nextScore = current.voteScore;

    if (current.userVote === "upvote") nextScore -= 1;
    if (current.userVote === "downvote") nextScore += 1;

    if (nextVote === "upvote") nextScore += 1;
    if (nextVote === "downvote") nextScore -= 1;

    setVoteOverrides((prev) => ({
      ...prev,
      [item.id]: {
        voteScore: nextScore,
        userVote: nextVote,
      },
    }));
  };

  const handleVote = async (item, nextVote) => {
    const previousState = getEffectiveItemVoteState(item);

    try {
      setIsVotingItemId(item.id);

      if (previousState.userVote === nextVote) {
        applyVoteOverride(item, null);
        await clearVote(item.id);
        await loadBucketLists();
        return;
      }

      applyVoteOverride(item, nextVote);
      await voteOnItem(item.id, nextVote);
      await loadBucketLists();
    } catch (error) {
      setVoteOverrides((prev) => ({
        ...prev,
        [item.id]: {
          voteScore: previousState.voteScore,
          userVote: previousState.userVote,
        },
      }));
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
          user_vote: effectiveVote.userVote,
        };
      }),
    };
  }, [bucketLists, selectedListId, voteOverrides]);

  const isSelectedListOwner =
    selectedList?.owner?.id && user?.id
      ? selectedList.owner.id === user.id
      : false;

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

        <section className="grid gap-6 xl:grid-cols-[1.55fr_1.15fr]">
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
            selectedListId={selectedListId}
            isLoading={isLoading}
            onUpvoteItem={(item) => handleVote(item, "upvote")}
            onDownvoteItem={(item) => handleVote(item, "downvote")}
            isVotingItemId={isVotingItemId}
            onAddItemClick={handleOpenAddItemModal}
            onInviteMembersClick={
              isSelectedListOwner ? handleOpenInviteModal : undefined
            }
            message={focusPanelMessage}
          />
        </section>
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
