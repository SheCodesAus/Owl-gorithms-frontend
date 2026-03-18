import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBucketList } from "../hooks/useBucketList";
import { useVotes } from "../hooks/useVotes";
import { useAuth } from "../hooks/use-auth";
import { updateItem, deleteItem } from "../api/items";

import ItemDetailCard from "../components/items/ItemDetailCard";
import ExtendedItemCard from "../components/items/ExtendedItemCard";
import CalendarExportModal from "../components/modals/CalendarExportModal";
import EditItemModal from "../components/modals/EditItemModal";
import DeleteItemModal from "../components/modals/DeleteItemModal";
import StatusUpdateModal from "../components/modals/StatusUpdateModal";
import ItemDateModal from "../components/modals/ItemDateModal";

export default function BucketListItemPage() {
  const { listId, itemId } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { bucketList, isLoading, bucketListError, loadBucketList } =
    useBucketList(Number(listId));
  const { voteOnItem, clearVote } = useVotes();

  const [item, setItem] = useState(null);
  const [isVotingItemId, setIsVotingItemId] = useState(null);
  const [voteOverrides, setVoteOverrides] = useState({});

  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [isSavingDate, setIsSavingDate] = useState(false);
  const [dateErrors, setDateErrors] = useState({});

  const [editErrors, setEditErrors] = useState({});
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    if (!bucketList?.items) return;
    const found = bucketList.items.find((entry) => entry.id === Number(itemId));
    setItem(found || null);
  }, [bucketList, itemId]);

  const currentUser = auth?.user;
  const isOwner = bucketList?.owner?.id === currentUser?.id;
  const isCreator = item?.created_by?.id === currentUser?.id;
  const canEdit = isOwner || isCreator;

  const getBaseVoteScore = (currentItem) =>
    currentItem?.vote_score ?? currentItem?.votes_count ?? currentItem?.score ?? 0;

  const getBaseUserVote = (currentItem) =>
    currentItem?.user_vote ?? currentItem?.current_user_vote ?? null;

  const getEffectiveVoteState = (currentItem) => {
    const override = voteOverrides[currentItem.id];

    return {
      voteScore: override?.voteScore ?? getBaseVoteScore(currentItem),
      userVote: override?.userVote ?? getBaseUserVote(currentItem),
    };
  };

  const applyVoteOverride = (currentItem, nextVote) => {
    const current = getEffectiveVoteState(currentItem);
    let nextScore = current.voteScore;

    if (current.userVote === "upvote") nextScore -= 1;
    if (current.userVote === "downvote") nextScore += 1;
    if (nextVote === "upvote") nextScore += 1;
    if (nextVote === "downvote") nextScore -= 1;

    setVoteOverrides((prev) => ({
      ...prev,
      [currentItem.id]: {
        voteScore: nextScore,
        userVote: nextVote,
      },
    }));
  };

  const handleVote = async (currentItem, nextVote) => {
    const previousState = getEffectiveVoteState(currentItem);

    try {
      setIsVotingItemId(currentItem.id);

      if (previousState.userVote === nextVote) {
        applyVoteOverride(currentItem, null);
        await clearVote(currentItem.id);
        await loadBucketList();
        return;
      }

      applyVoteOverride(currentItem, nextVote);
      await voteOnItem(currentItem.id, nextVote);
      await loadBucketList();
    } catch (error) {
      setVoteOverrides((prev) => ({
        ...prev,
        [currentItem.id]: {
          voteScore: previousState.voteScore,
          userVote: previousState.userVote,
        },
      }));
      console.error("Vote failed:", error);
    } finally {
      setIsVotingItemId(null);
    }
  };

  const handleSave = async (formData) => {
    if (!item) return;

    setIsSaving(true);
    setEditErrors({});

    try {
      const updated = await updateItem(item.id, formData, auth?.access);
      setItem(updated);
      setShowEditModal(false);
      await loadBucketList();
    } catch (error) {
      setEditErrors({ non_field_errors: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!item) return;

    setIsDeleting(true);

    try {
      await deleteItem(item.id, auth?.access);
      navigate(`/bucketlists/${listId}`);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleSaveDate = async (dateData) => {
    if (!item) return;
    setIsSavingDate(true);
    setDateErrors({});
    try {
      const updated = await updateItem(item.id, dateData, auth?.access);
      setItem(updated);
      setShowDateModal(false);
      await loadBucketList();
    } catch (error) {
      setDateErrors({ non_field_errors: error.message });
    } finally {
      setIsSavingDate(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!item) return;

    setIsSavingStatus(true);
    setStatusError("");

    try {
      const updated = await updateItem(item.id, { status: newStatus }, auth?.access);
      setItem(updated);
      setShowStatusModal(false);
      await loadBucketList();
    } catch (error) {
      setStatusError(error.message);
    } finally {
      setIsSavingStatus(false);
    }
  };

  const effectiveVoteState = useMemo(() => {
    if (!item) return { voteScore: 0, userVote: null };
    return getEffectiveVoteState(item);
  }, [item, voteOverrides]);

  if (isLoading) {
    return (
      <section className="page-shell">
        <div className="page-width">
          <div className="empty-state-card">Loading item...</div>
        </div>
      </section>
    );
  }

  if (bucketListError) {
    return (
      <section className="page-shell">
        <div className="page-width">
          <div className="error-state-card">{bucketListError}</div>
        </div>
      </section>
    );
  }

  if (!bucketList) {
    return (
      <section className="page-shell">
        <div className="page-width">
          <div className="error-state-card">Bucket list not found.</div>
        </div>
      </section>
    );
  }

  if (!item) {
    return (
      <section className="page-shell">
        <div className="page-width">
          <div className="error-state-card">Item not found.</div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-shell">
        <div className="page-width item-page-stack">
          <ItemDetailCard
            bucketList={bucketList}
            item={item}
            canEdit={canEdit}
            isOwner={isOwner}
            voteScore={effectiveVoteState.voteScore}
            userVote={effectiveVoteState.userVote}
            isVoting={isVotingItemId === item.id}
            onBack={() => navigate(`/bucketlists/${listId}`)}
            onUpvote={() => handleVote(item, "upvote")}
            onDownvote={() => handleVote(item, "downvote")}
            onAddToCalendar={() => setShowCalendarModal(true)}
            onAddDate={() => setShowDateModal(true)}
            onEditDate={() => setShowDateModal(true)}
            onEdit={() => setShowEditModal(true)}
            onDelete={() => setShowDeleteModal(true)}
            onUpdateStatus={() => setShowStatusModal(true)}
          />

          <ExtendedItemCard itemTitle={item.title} />
        </div>
      </section>

      <CalendarExportModal
        item={item}
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
      />

      <EditItemModal
        item={item}
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
        item={item}
        isOpen={showDeleteModal}
        isDeleting={isDeleting}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
      
      <ItemDateModal
        item={item}
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
        item={item}
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