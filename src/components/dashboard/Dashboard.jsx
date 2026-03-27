import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useBucketLists } from "../../hooks/useBucketLists";
import { useVotes } from "../../hooks/useVotes";
import { useAuth } from "../../hooks/use-auth";
import DashboardBanner from "./DashboardBanner";
import DashboardCardGrid from "./DashboardCardGrid";
import DashboardFocusPanel from "./DashboardFocusPanel";
import SurpriseMeModal from "../modals/SurpriseMeModal";
import FormModal from "../UI/FormModal";
import CreateBucketListForm from "../forms/CreateBucketListForm";
import CreateItemForm from "../forms/CreateItemForm";
import InviteMembersModal from "../modals/InviteMembersModal";
import ViewMembersModal from "../modals/ViewMembersModal";
import ConfirmActionModal from "../modals/ConfirmActionModal";
import EditBucketListModal from "../modals/EditBucketListModal";
import updateMembershipRole from "../../api/memberships/update-membership";
import deleteMembership from "../../api/memberships/delete-membership";
import deleteBucketList from "../../api/bucketlists/delete-bucketlist";
import updateBucketList from "../../api/bucketlists/update-bucketlist";
import { toggleFreezeList } from "../../api/bucketlists";

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
  const { bucketLists, isLoading, bucketListsError, loadBucketLists } = useBucketLists();
  const { voteOnItem, clearVote } = useVotes();
  const { auth } = useAuth();
  const token = auth?.access;

  const [selectedListId, setSelectedListId] = useState(null);
  const [dashboardSearch, setDashboardSearch] = useState("");
  const [dashboardFilter, setDashboardFilter] = useState("all");
  const [dashboardSort, setDashboardSort] = useState("default");
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleSurpriseNavigate = (listId, itemId) => {
    navigate(`/bucketlists/${listId}?item=${itemId}`);
  };
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [editingBucketList, setEditingBucketList] = useState(null);
  const [isSavingBucketList, setIsSavingBucketList] = useState(false);
  const [editBucketListErrors, setEditBucketListErrors] = useState({});
  const [isUpdatingMemberId, setIsUpdatingMemberId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [isConfirmingAction, setIsConfirmingAction] = useState(false);
  const [isVotingItemId, setIsVotingItemId] = useState(null);
  const [voteOverrides, setVoteOverrides] = useState({});
  const [dashboardMessage, setDashboardMessage] = useState("");
  const [focusPanelMessage, setFocusPanelMessage] = useState("");
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) setSelectedListId(null);
  }, [isMobile]);

  // ── Modal handlers ────────────────────────────────────────────────────────
  const handleOpenCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);
  const handleOpenAddItemModal = () => { if (!selectedListId) return; setShowAddItemModal(true); };
  const handleCloseAddItemModal = () => setShowAddItemModal(false);
  const handleOpenInviteModal = () => { if (!selectedListId) return; setShowInviteModal(true); };
  const handleCloseInviteModal = () => setShowInviteModal(false);
  const handleOpenMembersModal = () => { if (!selectedListId) return; setShowMembersModal(true); };
  const handleCloseMembersModal = () => setShowMembersModal(false);

  const handleCreateSuccess = async (newBucketList) => {
    await loadBucketLists();
    setSelectedListId(newBucketList.id);
    setShowCreateModal(false);
    setDashboardMessage("Fresh list unlocked. Let the chaos begin.");
  };

  const handleAddItemSuccess = async () => {
    await loadBucketLists();
    setShowAddItemModal(false);
    setFocusPanelMessage("New idea dropped. This list is heating up.");
  };

  // ── Votes ─────────────────────────────────────────────────────────────────
  const getBaseVoteScore = (item) => item.vote_score ?? item.votes_count ?? item.score ?? 0;
  const getBaseUserVote = (item) => item.user_vote ?? item.current_user_vote ?? item.vote_type ?? null;

  const getEffectiveItemVoteState = (item) => {
    const override = voteOverrides[item.id];
    return {
      voteScore: override?.voteScore ?? getBaseVoteScore(item),
      userVote: override?.userVote ?? getBaseUserVote(item),
    };
  };

  const setVoteOverride = (itemId, voteScore, userVote) => {
    setVoteOverrides((prev) => ({ ...prev, [itemId]: { voteScore, userVote } }));
  };

  const handleVote = async (item, clickedVote) => {
    const previousState = getEffectiveItemVoteState(item);
    const { nextVote, nextScore } = getNextVoteState(previousState.userVote, previousState.voteScore, clickedVote);
    setVoteOverride(item.id, nextScore, nextVote);
    setIsVotingItemId(item.id);
    try {
      if (nextVote === null) await clearVote(item.id);
      else await voteOnItem(item.id, nextVote);
    } catch (error) {
      setVoteOverride(item.id, previousState.voteScore, previousState.userVote);
      setFocusPanelMessage("That vote refused to cooperate. Try again.");
    } finally {
      setIsVotingItemId(null);
    }
  };

  // ── Filtered + sorted bucket lists ───────────────────────────────────────
  const filteredBucketLists = useMemo(() => {
    let result = [...bucketLists];

    // Search
    if (dashboardSearch.trim()) {
      const q = dashboardSearch.trim().toLowerCase();
      result = result.filter(
        (bl) =>
          bl.title?.toLowerCase().includes(q) ||
          bl.description?.toLowerCase().includes(q)
      );
    }

    // Icon filters
    if (dashboardFilter === "frozen")  result = result.filter((bl) => bl.is_frozen);
    else if (dashboardFilter === "public") result = result.filter((bl) => bl.is_public);
    else if (dashboardFilter === "mine")   result = result.filter((bl) => bl.owner?.id === user?.id);
    else if (dashboardFilter === "shared") result = result.filter((bl) => bl.owner?.id !== user?.id);

    // Sort
    if (dashboardSort === "recent")
      result.sort((a, b) => new Date(b.updated_at ?? b.created_at) - new Date(a.updated_at ?? a.created_at));
    else if (dashboardSort === "newest")
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    else if (dashboardSort === "oldest")
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    else if (dashboardSort === "az")
      result.sort((a, b) => a.title?.localeCompare(b.title));
    else if (dashboardSort === "most_items")
      result.sort((a, b) => (b.items?.length ?? 0) - (a.items?.length ?? 0));
    else if (dashboardSort === "most_complete") {
      result.sort((a, b) => {
        const pctA = a.items?.length ? a.items.filter((i) => i.status === "complete").length / a.items.length : 0;
        const pctB = b.items?.length ? b.items.filter((i) => i.status === "complete").length / b.items.length : 0;
        return pctB - pctA;
      });
    }

    return result;
  }, [bucketLists, dashboardSearch, dashboardFilter, dashboardSort, user]);

  // ── Selected list ─────────────────────────────────────────────────────────
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

  // ── Edit bucket list ──────────────────────────────────────────────────────
  function handleEditBucketList(bucketList) {
    if (!bucketList) return;
    setEditBucketListErrors({});
    setEditingBucketList(bucketList);
  }

  function handleCloseEditBucketListModal() {
    if (isSavingBucketList) return;
    setEditingBucketList(null);
    setEditBucketListErrors({});
  }

  async function handleSaveBucketListEdits(updatedData) {
    if (!editingBucketList?.id || !token) return;
    try {
      setIsSavingBucketList(true);
      setEditBucketListErrors({});
      await updateBucketList(editingBucketList.id, updatedData, token);
      await loadBucketLists();
      setEditingBucketList(null);
      setFocusPanelMessage("Fresh polish applied. Your list just leveled up.");
    } catch (error) {
      if (error?.responseData && typeof error.responseData === "object") {
        setEditBucketListErrors(error.responseData);
      } else {
        setEditBucketListErrors({ non_field_errors: error.message || "Could not update bucket list." });
      }
    } finally {
      setIsSavingBucketList(false);
    }
  }

  // ── Freeze / unfreeze ─────────────────────────────────────────────────────
  async function handleFreezeBucketList(bucketList) {
    if (!bucketList?.id || !token) return;

    const willFreeze = !bucketList.is_frozen;

    try {
      await toggleFreezeList(bucketList.id, willFreeze, token);
      await loadBucketLists();
      setFocusPanelMessage(
        willFreeze
          ? "List frozen. Voting and new items are now locked."
          : "List unfrozen. The squad can vote and add again."
      );
    } catch (error) {
      setFocusPanelMessage(error.message || "Could not update freeze state.");
    }
  }

  // ── Delete bucket list ────────────────────────────────────────────────────
  function handleDeleteBucketList(bucketList) {
    if (!bucketList?.id) return;
    setConfirmAction({
      type: "delete-list",
      bucketList,
      title: "Are you sure?",
      description: "This list and everything inside it will vanish into the void. No dramatic comeback. No undo.",
      confirmLabel: "Delete list",
      tone: "danger",
    });
  }

  // ── Copy link ─────────────────────────────────────────────────────────────
  async function handleCopyBucketListLink(bucketList) {
    if (!bucketList) return;
    if (!bucketList.is_public) {
      setFocusPanelMessage("This one's still under wraps. Only public lists can be shared with the world.");
      return;
    }
    try {
      const shareUrl = `${window.location.origin}/bucketlists/${bucketList.id}`;
      await navigator.clipboard.writeText(shareUrl);
      setFocusPanelMessage("Link copied. Time to spark a little bucket list envy.");
    } catch (error) {
      setFocusPanelMessage("Copy failed. The link slipped through our fingers.");
    }
  }

  // ── Members ───────────────────────────────────────────────────────────────
  async function handleChangeMemberRole(membershipId, newRole) {
    if (!selectedListId || !token) return;
    try {
      setIsUpdatingMemberId(membershipId);
      await updateMembershipRole(selectedListId, membershipId, { role: newRole }, token);
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
      description: "This person will lose access to this bucket list unless they are invited again.",
      confirmLabel: "Remove",
      tone: "danger",
    });
  }

  function handleRequestLeaveList(membership) {
    setConfirmAction({
      type: "leave-list",
      membership,
      title: "Are you sure?",
      description: "You will lose access to this bucket list unless someone invites you again.",
      confirmLabel: "Leave",
      tone: "danger",
    });
  }

  async function handleConfirmAction() {
    if (!confirmAction || !token) return;
    try {
      setIsConfirmingAction(true);

      if (confirmAction.type === "delete-list") {
        const bucketListId = confirmAction.bucketList?.id;
        if (!bucketListId) return;
        await deleteBucketList(bucketListId, token);
        const wasSelected = selectedListId === bucketListId;
        setConfirmAction(null);
        if (wasSelected) {
          setSelectedListId(null);
          setShowMembersModal(false);
          setShowInviteModal(false);
          setShowAddItemModal(false);
          setEditingBucketList(null);
        }
        await loadBucketLists();
        setDashboardMessage("That list had its final scene. Deleted.");
        return;
      }

      if (!confirmAction.membership || !selectedListId) return;
      const membership = confirmAction.membership;
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
      const fallbackMessage = confirmAction?.type === "delete-list"
        ? "Could not delete that bucket list."
        : "Could not complete that action.";
      setFocusPanelMessage(error.message || fallbackMessage);
    } finally {
      setIsConfirmingAction(false);
      setIsUpdatingMemberId(null);
    }
  }

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!bucketLists.length) { setSelectedListId(null); return; }
    const selectedStillExists = bucketLists.some((bl) => bl.id === selectedListId);
    if (selectedListId && !selectedStillExists) setSelectedListId(null);
  }, [bucketLists, selectedListId]);

  useEffect(() => {
    if (!selectedList) setShowMembersModal(false);
  }, [selectedList]);

  useEffect(() => {
    if (!selectedList?.items?.length) return;
    const validItemIds = new Set(selectedList.items.map((item) => String(item.id)));
    setVoteOverrides((prev) => {
      const next = Object.fromEntries(Object.entries(prev).filter(([id]) => validItemIds.has(String(id))));
      return Object.keys(next).length !== Object.keys(prev).length ? next : prev;
    });
  }, [selectedList]);

  useEffect(() => {
    if (!dashboardMessage) return;
    const timer = window.setTimeout(() => setDashboardMessage(""), 3200);
    return () => window.clearTimeout(timer);
  }, [dashboardMessage]);

  useEffect(() => {
    if (!focusPanelMessage) return;
    const timer = window.setTimeout(() => setFocusPanelMessage(""), 3200);
    return () => window.clearTimeout(timer);
  }, [focusPanelMessage]);

  // ── Focus panel props ─────────────────────────────────────────────────────
  const focusPanelProps = {
    bucketList: selectedList,
    isLoading,
    onUpvoteItem: (item) => handleVote(item, "upvote"),
    onDownvoteItem: (item) => handleVote(item, "downvote"),
    isVotingItemId,
    onAddItemClick: handleOpenAddItemModal,
    onInviteMembersClick: isSelectedListOwner ? handleOpenInviteModal : undefined,
    onViewMembersClick: handleOpenMembersModal,
    message: focusPanelMessage,
    onClose: () => setSelectedListId(null),
    onEditBucketList: isSelectedListOwner ? handleEditBucketList : undefined,
    onFreezeBucketList: isSelectedListOwner ? handleFreezeBucketList : undefined,
    onDeleteBucketList: isSelectedListOwner ? handleDeleteBucketList : undefined,
    onCopyBucketListLink: handleCopyBucketListLink,
  };

  return (
    <>
      <motion.div
        className="flex flex-col gap-6 lg:gap-7"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        
        <DashboardBanner message={dashboardMessage} />

        {/* Desktop layout */}
        {!isMobile && (
          <motion.section
            className="pb-20"
            animate={{ maxWidth: panelOpen ? "1480px" : "920px" }}
            style={{ width: "100%", margin: "0 auto" }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-stretch gap-5">
                {/* Card grid — scrolls only when taller than focus panel */}
                <motion.div
                  className="min-w-0"
                  animate={{ width: panelOpen ? "46%" : "100%" }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  style={panelOpen ? {
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(107,78,170,0.22) transparent",
                  } : {}}
                >
                  <DashboardCardGrid
                    user={user}
                    bucketLists={filteredBucketLists}
                    onSurpriseClick={() => setShowSurpriseModal(true)}
                    selectedListId={selectedListId}
                    onSelectList={setSelectedListId}
                    isLoading={isLoading}
                    error={bucketListsError}
                    onRetry={loadBucketLists}
                    onCreateClick={handleOpenCreateModal}
                    search={dashboardSearch}
                    onSearchChange={setDashboardSearch}
                    filter={dashboardFilter}
                    onFilterChange={setDashboardFilter}
                    sort={dashboardSort}
                    onSortChange={setDashboardSort}
                  />
                </motion.div>

                {/* Focus panel — renders full height, no scroll */}
                <AnimatePresence>
                  {panelOpen && (
                    <motion.div
                      key="dashboard-focus-panel-desktop"
                      style={{ width: "52%" }}
                      className="shrink-0"
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
            </div>
          </motion.section>
        )}

        {/* Mobile layout */}
        {isMobile && (
          <div className="flex flex-col gap-4 pb-10">
            <DashboardCardGrid
              user={user}
              bucketLists={filteredBucketLists}
              onSurpriseClick={() => setShowSurpriseModal(true)}
              selectedListId={selectedListId}
              onSelectList={setSelectedListId}
              isLoading={isLoading}
              error={bucketListsError}
              onRetry={loadBucketLists}
              onCreateClick={handleOpenCreateModal}
              search={dashboardSearch}
              onSearchChange={setDashboardSearch}
              filter={dashboardFilter}
              onFilterChange={setDashboardFilter}
              sort={dashboardSort}
              onSortChange={setDashboardSort}
            />
          </div>
        )}
      </motion.div>

      {/* Mobile focus panel overlay */}
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
              className="fixed inset-0 z-50 w-full overflow-y-auto"
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

      <FormModal isOpen={showCreateModal} onClose={handleCloseCreateModal} title="Create a new bucket list" subtitle="Start a fresh collection of goals, plans, and big ideas.">
        <CreateBucketListForm onClose={handleCloseCreateModal} onSuccess={handleCreateSuccess} />
      </FormModal>

      <FormModal isOpen={showAddItemModal} onClose={handleCloseAddItemModal} title="Drop in a fresh idea" subtitle="Add something wild to this list.">
        <CreateItemForm bucketListId={selectedListId} onClose={handleCloseAddItemModal} onSuccess={handleAddItemSuccess} />
      </FormModal>

      <EditBucketListModal
        bucketList={editingBucketList}
        isOpen={!!editingBucketList}
        onClose={handleCloseEditBucketListModal}
        onSave={handleSaveBucketListEdits}
        isSaving={isSavingBucketList}
        errors={editBucketListErrors}
      />

      <InviteMembersModal isOpen={showInviteModal} onClose={handleCloseInviteModal} bucketListId={selectedListId} />

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
      <SurpriseMeModal
        isOpen={showSurpriseModal}
        onClose={() => setShowSurpriseModal(false)}
        bucketLists={bucketLists}
        onNavigate={handleSurpriseNavigate}
      />
    </>
  );
}

export default Dashboard;