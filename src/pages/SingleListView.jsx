import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useBucketList } from "../hooks/useBucketList";
import { useVotes } from "../hooks/useVotes";
import { useAuth } from "../hooks/use-auth";
import { updateItem, deleteItem } from "../api/items";

import BucketListHeader from "../components/bucketlist/BucketListHeader";
import BucketListActionBar from "../components/bucketlist/BucketListActionBar";
import BucketListItemsPanel from "../components/bucketlist/BucketListItemsPanel";
import ItemDetailPanel from "../components/items/ItemDetailPanel";

import FormModal from "../components/UI/FormModal";
import CreateItemForm from "../components/forms/CreateItemForm";
import InviteMembersModal from "../components/modals/InviteMembersModal";
import CalendarExportModal from "../components/modals/CalendarExportModal";
import EditItemModal from "../components/modals/EditItemModal";
import DeleteItemModal from "../components/modals/DeleteItemModal";
import StatusUpdateModal from "../components/modals/StatusUpdateModal";
import ItemDateModal from "../components/modals/ItemDateModal";
import EditBucketListModal from "../components/modals/EditBucketListModal";
import ConfirmActionModal from "../components/modals/ConfirmActionModal";

function getNextVoteState(currentVote, currentScore, clickedVote) {
  const nextVote = currentVote === clickedVote ? null : clickedVote;
  let nextScore = currentScore;
  if (currentVote === "upvote") nextScore -= 1;
  if (currentVote === "downvote") nextScore += 1;
  if (nextVote === "upvote") nextScore += 1;
  if (nextVote === "downvote") nextScore -= 1;
  return { nextVote, nextScore };
}

export default function SingleListView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { bucketList, isLoading, bucketListError, loadBucketList } = useBucketList(Number(id));
  const { voteOnItem, clearVote } = useVotes();

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showEditListModal, setShowEditListModal] = useState(false);
  const [showDeleteListModal, setShowDeleteListModal] = useState(false);
  const [isVotingItemId, setIsVotingItemId] = useState(null);
  const [voteOverrides, setVoteOverrides] = useState({});
  const [panelMessage, setPanelMessage] = useState("");
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isSavingDate, setIsSavingDate] = useState(false);
  const [dateErrors, setDateErrors] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editErrors, setEditErrors] = useState({});
  const [statusError, setStatusError] = useState("");
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) setSelectedItemId(null);
  }, [isMobile]);

  const panelScrollRef = useRef(null);

  // Scroll page to top of detail panel when a new item is selected
  useEffect(() => {
    if (selectedItemId && panelScrollRef.current) {
      panelScrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedItemId]);

  const baseItems = bucketList?.items ?? [];
  const currentUser = auth?.user;

  // ── Permissions ───────────────────────────────────────────────────────────
  const currentUserMembership = useMemo(() => {
    if (!currentUser?.id || !bucketList?.memberships) return null;
    return bucketList.memberships.find(
      (m) => Number(m.user?.id) === Number(currentUser.id)
    ) ?? null;
  }, [bucketList, currentUser]);

  const isOwner = bucketList?.owner?.id && currentUser?.id
    ? Number(bucketList.owner.id) === Number(currentUser.id)
    : false;

  const memberRole = currentUserMembership?.role ?? null;

  // canVote: frozen = no. Owner/editor = yes. Viewer = only if allow_viewer_voting.
  const canVote = useMemo(() => {
    if (!currentUser) return false;
    if (bucketList?.is_frozen) return false;
    if (isOwner || memberRole === "editor") return true;
    if (memberRole === "viewer") return bucketList?.allow_viewer_voting ?? false;
    return false;
  }, [currentUser, bucketList, isOwner, memberRole]);

  // ── Vote helpers ──────────────────────────────────────────────────────────
  const getBaseVoteScore = (item) => item.vote_score ?? item.votes_count ?? item.score ?? 0;
  const getBaseUserVote = (item) => item.user_vote ?? item.current_user_vote ?? item.vote_type ?? null;

  const getEffectiveVoteState = (item) => {
    const override = voteOverrides[item.id];
    return {
      voteScore: override?.voteScore ?? getBaseVoteScore(item),
      userVote: override?.userVote ?? getBaseUserVote(item),
    };
  };

  const setVoteOverride = (itemId, voteScore, userVote) => {
    setVoteOverrides((prev) => ({ ...prev, [itemId]: { voteScore, userVote } }));
  };

  // ── Items ─────────────────────────────────────────────────────────────────
  const items = useMemo(() => {
    return baseItems.map((item) => {
      const effectiveVote = getEffectiveVoteState(item);
      return {
        ...item,
        is_completed: item.status === "complete",
        created_by: item.created_by ?? item.creator ?? null,
        date_created: item.date_created ?? item.created_at ?? item.created ?? null,
        vote_score: effectiveVote.voteScore,
        score: effectiveVote.voteScore,
        user_vote: effectiveVote.userVote,
        vote_type: effectiveVote.userVote,
      };
    });
  }, [baseItems, voteOverrides]);

  useEffect(() => {
    if (!selectedItemId) return;
    const selectedStillExists = items.some((item) => item.id === selectedItemId);
    if (!selectedStillExists) setSelectedItemId(null);
  }, [items, selectedItemId]);

  useEffect(() => {
    if (!panelMessage) return;
    const timer = window.setTimeout(() => setPanelMessage(""), 3000);
    return () => window.clearTimeout(timer);
  }, [panelMessage]);

  const filteredItems = useMemo(() => {
    if (filter === "complete") return items.filter((item) => item.status === "complete");
    if (filter === "pending") return items.filter((item) => item.status !== "complete");
    return items;
  }, [items, filter]);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId) ?? null,
    [items, selectedItemId]
  );

  const completedCount = useMemo(
    () => items.filter((item) => item.status === "complete").length,
    [items]
  );

  const isCreator = selectedItem?.created_by?.id && currentUser?.id
    ? Number(selectedItem.created_by.id) === Number(currentUser.id)
    : false;

  // Owner can always edit. Editors can edit their own items on unfrozen lists.
  const canEdit = isOwner || (
    !bucketList?.is_frozen && memberRole === "editor" && isCreator
  );

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleFreezeList = async () => {
    if (!auth?.access || !bucketList) return;
    try {
      const { toggleFreezeList } = await import("../api/bucketlists");
      await toggleFreezeList(bucketList.id, !bucketList.is_frozen, auth.access);
      await loadBucketList();
    } catch (err) {
      console.error("Freeze failed:", err);
    }
  };

  const handleCopyLink = async () => {
    if (!bucketList.is_public) return;
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/bucketlists/${bucketList.id}`
      );
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleVote = async (item, clickedVote) => {
    if (!canVote) return;
    const previousState = getEffectiveVoteState(item);
    const { nextVote, nextScore } = getNextVoteState(previousState.userVote, previousState.voteScore, clickedVote);
    setVoteOverride(item.id, nextScore, nextVote);
    setIsVotingItemId(item.id);
    try {
      if (nextVote === null) await clearVote(item.id);
      else await voteOnItem(item.id, nextVote);
    } catch (error) {
      setVoteOverride(item.id, previousState.voteScore, previousState.userVote);
    } finally {
      setIsVotingItemId(null);
    }
  };

  const effectiveVoteState = selectedItem
    ? getEffectiveVoteState(selectedItem)
    : { voteScore: 0, userVote: null };

  const handleAddItemSuccess = async () => {
    await loadBucketList();
    setShowAddItemModal(false);
    setPanelMessage("Item added! Let's go!");
  };

  const handleSave = async (formData) => {
    if (!selectedItem) return;
    setIsSaving(true);
    setEditErrors({});
    try {
      await updateItem(selectedItem.id, formData, auth?.access);
      await loadBucketList();
      setShowEditModal(false);
      setPanelMessage("Item updated.");
    } catch (error) {
      setEditErrors({ non_field_errors: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    setIsDeleting(true);
    try {
      await deleteItem(selectedItem.id, auth?.access);
      await loadBucketList();
      setShowDeleteModal(false);
      setPanelMessage("Item deleted.");
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveDate = async (dateData) => {
    if (!selectedItem) return;
    setIsSavingDate(true);
    setDateErrors({});
    try {
      const shouldAutoLock =
        isOwner &&
        selectedItem?.status === "proposed" &&
        !!(dateData?.start_date ?? selectedItem?.start_date);
      const payload = shouldAutoLock ? { ...dateData, status: "locked_in" } : dateData;
      await updateItem(selectedItem.id, payload, auth?.access);
      await loadBucketList();
      setShowDateModal(false);
      setPanelMessage("Date saved.");
    } catch (error) {
      setDateErrors({ non_field_errors: error.message });
    } finally {
      setIsSavingDate(false);
    }
  };

  const handleStatusUpdate = async (val) => {
    if (!selectedItem) return;
    const newStatus = typeof val === "string" ? val : val?.status;
    if (!newStatus) return;
    setIsSavingStatus(true);
    setStatusError("");
    try {
      await updateItem(selectedItem.id, { status: newStatus }, auth?.access);
      await loadBucketList();
      setShowStatusModal(false);
      setPanelMessage("Status updated.");
    } catch (error) {
      setStatusError(error.message);
    } finally {
      setIsSavingStatus(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (isLoading) return (
    <div style={{ width: "min(100%, 860px)", margin: "0 auto" }}>
      <div className="empty-state-card">Loading bucket list...</div>
    </div>
  );

  if (bucketListError || !bucketList) return (
    <div style={{ width: "min(100%, 860px)", margin: "0 auto" }}>
      <div className="error-state-card">{bucketListError || "Something went wrong."}</div>
    </div>
  );

  const panelOpen = !!selectedItem;

  return (
    <>
      <motion.section
          animate={{ maxWidth: panelOpen ? "1440px" : "860px" }}
          style={{ width: "100%", margin: "0 auto" }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* ── Desktop layout ─────────────────────────────────────────────── */}
          {!isMobile && (
            <div className="flex items-stretch gap-5">
              {/* Left column — stretches to match right panel height */}
              <motion.div
                className="flex flex-col gap-5 min-w-0"
                animate={{ width: panelOpen ? "45%" : "100%" }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                <BucketListHeader
                  bucketList={bucketList}
                  isOwner={isOwner}
                  onAddItemClick={() => setShowAddItemModal(true)}
                  onInviteMembersClick={isOwner ? () => setShowInviteModal(true) : undefined}
                  onEditBucketList={() => setShowEditListModal(true)}
                  onFreezeBucketList={handleFreezeList}
                  onDeleteBucketList={() => setShowDeleteListModal(true)}
                  onCopyLink={handleCopyLink}
                />
                <BucketListActionBar
                  completedCount={completedCount}
                  totalCount={items.length}
                  filter={filter}
                  onFilterChange={setFilter}
                />
                <BucketListItemsPanel
                  items={filteredItems}
                  selectedItemId={selectedItemId}
                  onSelectItem={setSelectedItemId}
                  onDoubleSelectItem={(itemId) => navigate(`/bucketlists/${id}/items/${itemId}`)}
                />
              </motion.div>

              {/* Right column — natural height, panel scrolls internally */}
              <AnimatePresence>
                {panelOpen && (
                  <motion.div
                    key="focus-panel-desktop"
                    ref={panelScrollRef}
                    className="shrink-0"
                    style={{ width: "53%" }}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <ItemDetailPanel
                      item={selectedItem}
                      bucketList={bucketList}
                      message={panelMessage}
                      canEdit={canEdit}
                      isOwner={isOwner}
                      canVote={canVote}
                      voteScore={effectiveVoteState.voteScore}
                      userVote={effectiveVoteState.userVote}
                      isVoting={isVotingItemId === selectedItem?.id}
                      onUpvote={() => selectedItem && handleVote(selectedItem, "upvote")}
                      onDownvote={() => selectedItem && handleVote(selectedItem, "downvote")}
                      onAddToCalendar={() => setShowCalendarModal(true)}
                      onAddDate={() => setShowDateModal(true)}
                      onEditDate={() => setShowDateModal(true)}
                      onEdit={() => setShowEditModal(true)}
                      onDelete={() => setShowDeleteModal(true)}
                      onUpdateStatus={(val) => {
                        if (typeof val === "string") handleStatusUpdate(val);
                        else setShowStatusModal(true);
                      }}
                      onClose={() => setSelectedItemId(null)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ── Mobile layout — full width list ────────────────────────────── */}
          {isMobile && (
            <div className="flex flex-col gap-5 pb-10">
              <BucketListHeader
                bucketList={bucketList}
                isOwner={isOwner}
                onAddItemClick={() => setShowAddItemModal(true)}
                onInviteMembersClick={isOwner ? () => setShowInviteModal(true) : undefined}
                onEditBucketList={() => setShowEditListModal(true)}
                onFreezeBucketList={handleFreezeList}
                onDeleteBucketList={() => setShowDeleteListModal(true)}
                onCopyLink={handleCopyLink}
              />
              <BucketListActionBar
                completedCount={completedCount}
                totalCount={items.length}
                filter={filter}
                onFilterChange={setFilter}
              />
              <BucketListItemsPanel
                items={filteredItems}
                selectedItemId={selectedItemId}
                onSelectItem={setSelectedItemId}
                onDoubleSelectItem={(itemId) => navigate(`/bucketlists/${id}/items/${itemId}`)}
              />
            </div>
          )}
        </motion.section>

      {/* ── Mobile overlay — slides in from right ──────────────────────────── */}
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
              onClick={() => setSelectedItemId(null)}
            />
            <motion.div
              key="focus-panel-mobile"
              className="fixed inset-y-4 left-4 right-4 z-50 overflow-y-auto sm:inset-y-6 sm:left-6 sm:right-6 lg:inset-y-8 lg:left-8 lg:right-8"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              <ItemDetailPanel
                item={selectedItem}
                bucketList={bucketList}
                message={panelMessage}
                canEdit={canEdit}
                isOwner={isOwner}
                canVote={canVote}
                voteScore={effectiveVoteState.voteScore}
                userVote={effectiveVoteState.userVote}
                isVoting={isVotingItemId === selectedItem?.id}
                onUpvote={() => selectedItem && handleVote(selectedItem, "upvote")}
                onDownvote={() => selectedItem && handleVote(selectedItem, "downvote")}
                onAddToCalendar={() => setShowCalendarModal(true)}
                onAddDate={() => setShowDateModal(true)}
                onEditDate={() => setShowDateModal(true)}
                onEdit={() => setShowEditModal(true)}
                onDelete={() => setShowDeleteModal(true)}
                onUpdateStatus={(val) => {
                  if (typeof val === "string") handleStatusUpdate(val);
                  else setShowStatusModal(true);
                }}
                onClose={() => setSelectedItemId(null)}
                isMobileOverlay
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <FormModal isOpen={showAddItemModal} onClose={() => setShowAddItemModal(false)} title="Drop in a fresh idea" subtitle="Add something wild to this list.">
        <CreateItemForm bucketListId={bucketList?.id} onClose={() => setShowAddItemModal(false)} onSuccess={handleAddItemSuccess} />
      </FormModal>

      <InviteMembersModal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} bucketListId={bucketList?.id} />
      <CalendarExportModal item={selectedItem} isOpen={showCalendarModal} onClose={() => setShowCalendarModal(false)} />

      <EditItemModal
        item={selectedItem}
        isOpen={showEditModal}
        onSave={handleSave}
        onClose={() => { setShowEditModal(false); setEditErrors({}); }}
        isSaving={isSaving}
        errors={editErrors}
      />

      <DeleteItemModal item={selectedItem} isOpen={showDeleteModal} isDeleting={isDeleting} onClose={() => setShowDeleteModal(false)} onConfirm={handleDelete} />

      <ItemDateModal
        item={selectedItem}
        isOpen={showDateModal}
        onSave={handleSaveDate}
        onClose={() => { setShowDateModal(false); setDateErrors({}); }}
        isSaving={isSavingDate}
        errors={dateErrors}
      />

      <StatusUpdateModal
        item={selectedItem}
        isOpen={showStatusModal}
        onSave={handleStatusUpdate}
        onClose={() => { setShowStatusModal(false); setStatusError(""); }}
        isSaving={isSavingStatus}
        error={statusError}
      />

      <EditBucketListModal
        bucketList={bucketList}
        isOpen={showEditListModal}
        onClose={() => setShowEditListModal(false)}
        onSave={async (data) => {
          const { default: updateBucketList } = await import("../api/bucketlists/update-bucketlist");
          await updateBucketList(bucketList.id, data, auth?.access);
          await loadBucketList();
          setShowEditListModal(false);
        }}
      />

      <ConfirmActionModal
        isOpen={showDeleteListModal}
        onClose={() => setShowDeleteListModal(false)}
        onConfirm={async () => {
          const { default: deleteBucketList } = await import("../api/bucketlists/delete-bucketlist");
          await deleteBucketList(bucketList.id, auth?.access);
          navigate("/dashboard");
        }}
        title="Delete this list?"
        description="This list and everything inside it will be permanently deleted. This cannot be undone."
        confirmLabel="Delete list"
        tone="danger"
      />
    </>
  );
}