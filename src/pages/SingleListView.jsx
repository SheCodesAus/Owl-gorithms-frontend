import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
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

export default function SingleListView() {
  const { id } = useParams();
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

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingStatus, setIsSavingStatus] = useState(false);

  const [editErrors, setEditErrors] = useState({});
  const [statusError, setStatusError] = useState("");

  const items = bucketList?.items ?? [];
  const currentUser = auth?.user;

  useEffect(() => {
    if (!items.length) {
      setSelectedItemId(null);
      return;
    }

    const selectedStillExists = items.some((item) => item.id === selectedItemId);

    if (!selectedItemId || !selectedStillExists) {
      setSelectedItemId(items[0].id);
    }
  }, [items, selectedItemId]);

  useEffect(() => {
    if (!panelMessage) return;

    const timer = window.setTimeout(() => {
      setPanelMessage("");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [panelMessage]);

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
    [items]
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

  const getBaseVoteScore = (item) => {
    return item.vote_score ?? item.votes_count ?? item.score ?? 0;
  };

  const getBaseUserVote = (item) => {
    return item.user_vote ?? item.current_user_vote ?? null;
  };

  const getEffectiveVoteState = (item) => {
    const override = voteOverrides[item.id];

    return {
      voteScore: override?.voteScore ?? getBaseVoteScore(item),
      userVote: override?.userVote ?? getBaseUserVote(item),
    };
  };

  const applyVoteOverride = (item, nextVote) => {
    const current = getEffectiveVoteState(item);
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
    const previousState = getEffectiveVoteState(item);

    try {
      setIsVotingItemId(item.id);

      if (previousState.userVote === nextVote) {
        applyVoteOverride(item, null);
        await clearVote(item.id);
        await loadBucketList();
        return;
      }

      applyVoteOverride(item, nextVote);
      await voteOnItem(item.id, nextVote);
      await loadBucketList();
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

  return (
    <>
      <section className="page-shell">
        <div className="page-width page-width-wide bucketlist-view-stack">
          <BucketListHeader bucketList={bucketList} />

          <BucketListActionBar
            completedCount={completedCount}
            totalCount={items.length}
            filter={filter}
            onFilterChange={setFilter}
            onAddItemClick={() => setShowAddItemModal(true)}
            onInviteMembersClick={() => setShowInviteModal(true)}
          />

          <section className="bucketlist-split-layout bucketlist-split-layout-tall">
            <BucketListItemsPanel
              items={filteredItems}
              selectedItemId={selectedItemId}
              onSelectItem={setSelectedItemId}
            />

            <ItemDetailPanel
              item={selectedItem}
              bucketList={bucketList}
              message={panelMessage}
              canEdit={canEdit}
              isOwner={isOwner}
              voteScore={effectiveVoteState.voteScore}
              userVote={effectiveVoteState.userVote}
              isVoting={isVotingItemId === selectedItem?.id}
              onUpvote={() => selectedItem && handleVote(selectedItem, "upvote")}
              onDownvote={() => selectedItem && handleVote(selectedItem, "downvote")}
              onAddToCalendar={() => setShowCalendarModal(true)}
              onEdit={() => setShowEditModal(true)}
              onDelete={() => setShowDeleteModal(true)}
              onUpdateStatus={() => setShowStatusModal(true)}
            />
          </section>
        </div>
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