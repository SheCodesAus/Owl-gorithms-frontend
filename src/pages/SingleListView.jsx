import { useEffect, useMemo, useState } from "react";
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

export default function SingleListView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { bucketList, isLoading, bucketListError, loadBucketList } =
    useBucketList(Number(id));
  const { voteOnItem, clearVote } = useVotes();

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [filter, setFilter] = useState("all");

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const [isVotingItemId, setIsVotingItemId] = useState(null);
  const [voteOverrides, setVoteOverrides] = useState({});
  const [panelMessage, setPanelMessage] = useState("");

  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [isSavingDate, setIsSavingDate] = useState(false);
  const [dateErrors, setDateErrors] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editErrors, setEditErrors] = useState({});
  const [statusError, setStatusError] = useState("");

  const baseItems = bucketList?.items ?? [];
  const currentUser = auth?.user;

  const getBaseVoteScore = (item) =>
    item.vote_score ?? item.votes_count ?? item.score ?? 0;

  const getBaseUserVote = (item) =>
    item.user_vote ?? item.current_user_vote ?? item.vote_type ?? null;

  const getEffectiveVoteState = (item) => {
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

  const items = useMemo(() => {
    return baseItems.map((item) => {
      const effectiveVote = getEffectiveVoteState(item);

      return {
        ...item,
        vote_score: effectiveVote.voteScore,
        score: effectiveVote.voteScore,
        user_vote: effectiveVote.userVote,
        vote_type: effectiveVote.userVote,
      };
    });
  }, [baseItems, voteOverrides]);

  useEffect(() => {
    if (!items.length) {
      setSelectedItemId(null);
      return;
    }

    const selectedStillExists = items.some(
      (item) => item.id === selectedItemId,
    );

    if (selectedItemId && !selectedStillExists) {
      setSelectedItemId(null);
    }
  }, [items, selectedItemId]);

  useEffect(() => {
    if (!panelMessage) return;

    const timer = window.setTimeout(() => setPanelMessage(""), 3000);
    return () => window.clearTimeout(timer);
  }, [panelMessage]);

useEffect(() => {
    if (!baseItems.length) {
      setVoteOverrides({});
      return;
    }

    const validItemIds = new Set(baseItems.map((item) => String(item.id)));

    setVoteOverrides((prev) => {
      const next = Object.fromEntries(
        Object.entries(prev).filter(([itemId]) => validItemIds.has(String(itemId))),
      );

      const hasChanged = Object.keys(next).length !== Object.keys(prev).length;
      return hasChanged ? next : prev;
    });
  }, [baseItems]);

  const filteredItems = useMemo(() => {
    if (filter === "complete") return items.filter((item) => item.is_completed);
    if (filter === "pending") return items.filter((item) => !item.is_completed);
    return items;
  }, [items, filter]);

  const selectedItem = useMemo(() => {
    return items.find((item) => item.id === selectedItemId) ?? null;
  }, [items, selectedItemId]);

  const completedCount = useMemo(
    () => items.filter((item) => item.is_completed).length,
    [items],
  );

  const isOwner =
    bucketList?.owner?.id && currentUser?.id
      ? bucketList.owner.id === currentUser.id
      : false;

  const isCreator =
    selectedItem?.created_by?.id && currentUser?.id
      ? selectedItem.created_by.id === currentUser.id
      : false;

  const canEdit = isOwner || isCreator;

  const handleVote = async (item, clickedVote) => {
    const previousState = getEffectiveVoteState(item);

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
      await updateItem(selectedItem.id, dateData, auth?.access);
      await loadBucketList();
      setShowDateModal(false);
      setPanelMessage("Date saved.");
    } catch (error) {
      setDateErrors({ non_field_errors: error.message });
    } finally {
      setIsSavingDate(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedItem) return;
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

  if (isLoading) {
    return (
      <section className="page-shell">
        <div className="page-width page-width-wide">
          <div className="empty-state-card">Loading bucket list...</div>
        </div>
      </section>
    );
  }

  if (bucketListError || !bucketList) {
    return (
      <section className="page-shell">
        <div className="page-width page-width-wide">
          <div className="error-state-card">
            {bucketListError || "Something went wrong."}
          </div>
        </div>
      </section>
    );
  }

  const panelOpen = !!selectedItem;

  return (
    <>
      <section className="page-shell">
        <motion.div
          className="page-width page-width-wide"
          animate={{ maxWidth: panelOpen ? "1440px" : "860px" }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="relative">
            <motion.div
              className="flex flex-col gap-5"
              animate={{ width: panelOpen ? "45%" : "100%" }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              style={{ minWidth: 0 }}
            >
              <BucketListHeader
                bucketList={bucketList}
                onAddItemClick={() => setShowAddItemModal(true)}
                onInviteMembersClick={() => setShowInviteModal(true)}
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

            <AnimatePresence>
              {panelOpen && (
                <motion.div
                  key="focus-panel"
                  className="absolute top-0 right-0 bottom-0"
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
                    voteScore={effectiveVoteState.voteScore}
                    userVote={effectiveVoteState.userVote}
                    isVoting={isVotingItemId === selectedItem?.id}
                    onUpvote={() =>
                      selectedItem && handleVote(selectedItem, "upvote")
                    }
                    onDownvote={() =>
                      selectedItem && handleVote(selectedItem, "downvote")
                    }
                    onAddToCalendar={() => setShowCalendarModal(true)}
                    onAddDate={() => setShowDateModal(true)}
                    onEditDate={() => setShowDateModal(true)}
                    onEdit={() => setShowEditModal(true)}
                    onDelete={() => setShowDeleteModal(true)}
                    onUpdateStatus={() => setShowStatusModal(true)}
                    onOptionsClick={() => console.log("Open item options menu")}
                    onClose={() => setSelectedItemId(null)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      <FormModal
        isOpen={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        title="Drop in a fresh idea"
        subtitle="Add something wild to this list."
      >
        <CreateItemForm
          bucketListId={bucketList.id}
          onClose={() => setShowAddItemModal(false)}
          onSuccess={handleAddItemSuccess}
        />
      </FormModal>

      <InviteMembersModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        bucketListId={bucketList.id}
      />

      <CalendarExportModal
        item={selectedItem}
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
      />

      <EditItemModal
        item={selectedItem}
        isOpen={showEditModal}
        onSave={handleSave}
        onClose={() => {
          setShowEditModal(false);
          setEditErrors({});
        }}
        isSaving={isSaving}
        errors={editErrors}
      />

      <DeleteItemModal
        item={selectedItem}
        isOpen={showDeleteModal}
        isDeleting={isDeleting}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />

      <ItemDateModal
        item={selectedItem}
        isOpen={showDateModal}
        onSave={handleSaveDate}
        onClose={() => {
          setShowDateModal(false);
          setDateErrors({});
        }}
        isSaving={isSavingDate}
        errors={dateErrors}
      />

      <StatusUpdateModal
        item={selectedItem}
        isOpen={showStatusModal}
        onSave={handleStatusUpdate}
        onClose={() => {
          setShowStatusModal(false);
          setStatusError("");
        }}
        isSaving={isSavingStatus}
        error={statusError}
      />
    </>
  );
}