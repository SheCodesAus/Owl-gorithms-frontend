import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import ViewMembersModal from "../modals/ViewMembersModal";
import ConfirmActionModal from "../modals/ConfirmActionModal";
import updateMembershipRole from "../../api/memberships/update-membership";
import deleteMembership from "../../api/memberships/delete-membership";

function getNextVoteState(currentVote, currentScore, clickedVote) {
  const nextVote = currentVote === clickedVote ? null : clickedVote;
  let nextScore = currentScore;

  if (currentVote === "upvote") nextScore -= 1;
  if (currentVote === "downvote") nextScore += 1;
  if (nextVote === "upvote") nextScore += 1;
  if (nextVote === "downvote") nextScore -= 1;

  return { nextVote, nextScore };
}

const MOBILE_BREAKPOINT = 1024;

function Dashboard({ user }) {
  const navigate = useNavigate();

  const { bucketLists, isLoading, bucketListsError, loadBucketLists } =
    useBucketLists();
  const { voteOnItem, clearVote } = useVotes();

  const [selectedListId, setSelectedListId] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);

  const [isUpdatingMemberId, setIsUpdatingMemberId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [isConfirmingAction, setIsConfirmingAction] = useState(false);

  const [isVotingItemId, setIsVotingItemId] = useState(null);
  const [voteOverrides, setVoteOverrides] = useState({});

  const [dashboardMessage, setDashboardMessage] = useState("");
  const [focusPanelMessage, setFocusPanelMessage] = useState("");

  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < MOBILE_BREAKPOINT
  );

  const token = user?.token;

  // ── Responsive state ───────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setSelectedListId(null);
    }
  }, [isMobile]);

  // ── Simple modal handlers ──────────────────────────────────────────────
  const handleOpenCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);

  const handleOpenAddItemModal = () => {
    if (!selectedListId) return;
    setShowAddItemModal(true);
  };
  const handleCloseAddItemModal = () => setShowAddItemModal(false);

  const handleOpenInviteModal = () => {
    if (!selectedListId) return;
    setShowInviteModal(true);
  };
  const handleCloseInviteModal = () => setShowInviteModal(false);

  const handleOpenMembersModal = () => {
    if (!selectedListId) return;
    setShowMembersModal(true);
  };
  const handleCloseMembersModal = () => setShowMembersModal(false);

  // ── Success handlers ───────────────────────────────────────────────────
  const handleCreateSuccess = async (newBucketList) => {
    await loadBucketLists();
    setSelectedListId(newBucketList.id);
    setShowCreateModal(false);
    setDashboardMessage("Created successfully!");
  };

  const handleAddItemSuccess = async () => {
    await loadBucketLists();
    setShowAddItemModal(false);
    setFocusPanelMessage("Item added! Let's go!");
  };

  // ── Vote helpers ───────────────────────────────────────────────────────
  const getBaseVoteScore = (item) =>
    item.vote_score ?? item.votes_count ?? item.score ?? 0;

  const getBaseUserVote = (item) =>
    item.user_vote ?? item.current_user_vote ?? item.vote_type ?? null;

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
      [itemId]: { voteScore, userVote },
    }));
  };

  const handleVote = async (item, clickedVote) => {
    const previousState = getEffectiveItemVoteState(item);

    const { nextVote, nextScore } = getNextVoteState(
      previousState.userVote,
      previousState.voteScore,
      clickedVote
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
      setVoteOverride(item.id, previousState.voteScore, previousState.userVote);
      console.error("Vote failed:", error);
    } finally {
      setIsVotingItemId(null);
    }
  };

  // ── Derived selected list ──────────────────────────────────────────────
  const selectedList = useMemo(() => {
    const baseList = bucketLists.find((bl) => bl.id === selectedListId) || null;
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

  const isSelectedListOwner =
    selectedList?.owner?.id && user?.id
      ? selectedList.owner.id === user.id
      : false;

  const panelOpen = !!selectedList;

  // ── Membership actions ─────────────────────────────────────────────────
  async function handleChangeMemberRole(membershipId, newRole) {
    if (!selectedListId || !token) return;

    try {
      setIsUpdatingMemberId(membershipId);

      await updateMembershipRole(
        selectedListId,
        membershipId,
        { role: newRole },
        token
      );

      await loadBucketLists();
      setFocusPanelMessage("Member role updated.");
    } catch (error) {
      setFocusPanelMessage(error.message || "Could not update member role.");
    } finally {
      setIsUpdatingMemberId(null);
    }
  }

  function handleRequestRemoveMember(membership) {
    setConfirmAction({
      type: "remove-member",
      membership,
      title: "Are you sure?",
      description:
        "This person will lose access to this bucket list unless they are invited again.",
      confirmLabel: "Remove",
      tone: "danger",
    });
  }

  function handleRequestLeaveList(membership) {
    setConfirmAction({
      type: "leave-list",
      membership,
      title: "Are you sure?",
      description:
        "You will lose access to this bucket list unless someone invites you again.",
      confirmLabel: "Leave",
      tone: "danger",
    });
  }

  async function handleConfirmAction() {
    if (!confirmAction?.membership || !selectedListId || !token) return;

    const membership = confirmAction.membership;

    try {
      setIsConfirmingAction(true);
      setIsUpdatingMemberId(membership.id);

      await deleteMembership(selectedListId, membership.id, token);

      if (confirmAction.type === "leave-list") {
        setConfirmAction(null);
        setShowMembersModal(false);
        setSelectedListId(null);
        await loadBucketLists();
        setDashboardMessage("You left the bucket list.");
        return;
      }

      await loadBucketLists();
      setConfirmAction(null);
      setFocusPanelMessage("Member removed.");
    } catch (error) {
      setFocusPanelMessage(error.message || "Could not complete that action.");
    } finally {
      setIsConfirmingAction(false);
      setIsUpdatingMemberId(null);
    }
  }

  // ── Effects that depend on selectedList ────────────────────────────────
  useEffect(() => {
    if (!bucketLists.length) {
      setSelectedListId(null);
      return;
    }

    const selectedStillExists = bucketLists.some(
      (bucketList) => bucketList.id === selectedListId
    );

    if (selectedListId && !selectedStillExists) {
      setSelectedListId(null);
    }
  }, [bucketLists, selectedListId]);

  useEffect(() => {
    if (!selectedList) {
      setShowMembersModal(false);
    }
  }, [selectedList]);

  useEffect(() => {
    if (!selectedList?.items?.length) return;

    const validItemIds = new Set(
      selectedList.items.map((item) => String(item.id))
    );

    setVoteOverrides((prev) => {
      const next = Object.fromEntries(
        Object.entries(prev).filter(([id]) => validItemIds.has(String(id)))
      );

      return Object.keys(next).length !== Object.keys(prev).length
        ? next
        : prev;
    });
  }, [selectedList]);

  useEffect(() => {
    if (!dashboardMessage) return;

    const timer = window.setTimeout(() => setDashboardMessage(""), 3000);
    return () => window.clearTimeout(timer);
  }, [dashboardMessage]);

  useEffect(() => {
    if (!focusPanelMessage) return;

    const timer = window.setTimeout(() => setFocusPanelMessage(""), 3000);
    return () => window.clearTimeout(timer);
  }, [focusPanelMessage]);

  // ── Focus panel props ──────────────────────────────────────────────────
  const focusPanelProps = {
    bucketList: selectedList,
    isLoading,
    onUpvoteItem: (item) => handleVote(item, "upvote"),
    onDownvoteItem: (item) => handleVote(item, "downvote"),
    isVotingItemId,
    onAddItemClick: handleOpenAddItemModal,
    onInviteMembersClick: isSelectedListOwner
      ? handleOpenInviteModal
      : undefined,
    onViewMembersClick: handleOpenMembersModal,
    message: focusPanelMessage,
    onClose: () => setSelectedListId(null),
  };

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

        {!isMobile && (
          <motion.section
            className="relative pb-20"
            animate={{ maxWidth: panelOpen ? "1480px" : "920px" }}
            style={{ width: "100%", margin: "0 auto" }}
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
                    key="dashboard-focus-panel-desktop"
                    className="absolute top-0 right-0 bottom-0"
                    style={{ width: "52%" }}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <DashboardFocusPanel {...focusPanelProps} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        )}

        {isMobile && (
          <div className="flex flex-col pb-10">
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
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {isMobile && panelOpen && (
          <>
            <motion.div
              key="mobile-backdrop"
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedListId(null)}
            />

            <motion.div
              key="dashboard-focus-panel-mobile"
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              <DashboardFocusPanel {...focusPanelProps} isMobileOverlay />
            </motion.div>
          </>
        )}
      </AnimatePresence>

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

      <ViewMembersModal
        isOpen={showMembersModal}
        onClose={handleCloseMembersModal}
        bucketList={selectedList}
        currentUser={user}
        onChangeRole={handleChangeMemberRole}
        onRemoveMember={handleRequestRemoveMember}
        onLeaveList={handleRequestLeaveList}
        isUpdatingMemberId={isUpdatingMemberId}
      />

      <ConfirmActionModal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        title={confirmAction?.title}
        description={confirmAction?.description}
        confirmLabel={confirmAction?.confirmLabel}
        tone={confirmAction?.tone}
        isLoading={isConfirmingAction}
      />
    </>
  );
}

export default Dashboard;