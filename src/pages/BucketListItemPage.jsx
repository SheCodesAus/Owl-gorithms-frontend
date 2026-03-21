import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBucketList } from "../hooks/useBucketList";
import { useAuth } from "../hooks/use-auth";
import { updateItem, deleteItem } from "../api/items";

import ItemDetailCard from "../components/items/ItemDetailCard";
import ExtendedItemCard from "../components/items/ExtendedItemCard";
import StatusUpdateModal from "../components/modals/StatusUpdateModal";
import ItemDateModal from "../components/modals/ItemDateModal";
import EditItemModal from "../components/modals/EditItemModal";
import DeleteItemModal from "../components/modals/DeleteItemModal";

export default function BucketListItemPage() {
  const { listId, itemId } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { bucketList, loadBucketList } = useBucketList(Number(listId));
  const currentUser = auth?.user;

  const [item, setItem] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    if (bucketList?.items) {
      const found = bucketList.items.find((it) => it.id === Number(itemId));
      setItem(found || null);
    }
  }, [bucketList, itemId]);

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

  const isCreator = item?.created_by?.id && currentUser?.id
    ? Number(item.created_by.id) === Number(currentUser.id)
    : false;

  // Owner always. Editor can edit their own items on unfrozen lists.
  const canEdit = isOwner || (
    !bucketList?.is_frozen && memberRole === "editor" && isCreator
  );

  // Frozen = no votes. Owner/editor = yes. Viewer = only if allow_viewer_voting.
  const canVote = useMemo(() => {
    if (!currentUser) return false;
    if (bucketList?.is_frozen) return false;
    if (isOwner || memberRole === "editor") return true;
    if (memberRole === "viewer") return bucketList?.allow_viewer_voting ?? false;
    return false;
  }, [currentUser, bucketList, isOwner, memberRole]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleStatusUpdate = async (val) => {
    if (!item) return;
    const newStatus = typeof val === "string" ? val : val?.status;
    if (!newStatus) return;
    setIsSavingStatus(true);
    try {
      await updateItem(item.id, { status: newStatus }, auth?.access);
      await loadBucketList();
      setShowStatusModal(false);
    } catch (error) {
      setStatusError(error.message);
    } finally {
      setIsSavingStatus(false);
    }
  };

  const handleSaveDate = async (dateData) => {
    if (!item) return;
    try {
      await updateItem(item.id, dateData, auth?.access);
      await loadBucketList();
      setShowDateModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (formData) => {
    if (!item) return;
    setIsSaving(true);
    try {
      await updateItem(item.id, formData, auth?.access);
      await loadBucketList();
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!item) return;
    try {
      await deleteItem(item.id, auth?.access);
      navigate(`/bucketlists/${listId}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (!item) return null;

  return (
    <>
      <section className="page-shell">
        <div className="page-width item-page-stack">
          <ItemDetailCard
            bucketList={bucketList}
            item={item}
            canEdit={canEdit}
            isOwner={isOwner}
            canVote={canVote}
            voteScore={item.score ?? 0}
            userVote={item.user_vote ?? null}
            isVoting={false}
            onBack={() => navigate(`/bucketlists/${listId}`)}
            onAddDate={() => setShowDateModal(true)}
            onUpdateStatus={(val) => {
              if (typeof val === "string") handleStatusUpdate(val);
              else setShowStatusModal(true);
            }}
            onEdit={() => setShowEditModal(true)}
            onDelete={() => setShowDeleteModal(true)}
          />
          <ExtendedItemCard itemTitle={item.title} />
        </div>
      </section>

      <StatusUpdateModal
        item={item}
        isOpen={showStatusModal}
        onSave={handleStatusUpdate}
        onClose={() => setShowStatusModal(false)}
        isSaving={isSavingStatus}
        error={statusError}
      />
      <ItemDateModal
        item={item}
        isOpen={showDateModal}
        onSave={handleSaveDate}
        onClose={() => setShowDateModal(false)}
      />
      <EditItemModal
        item={item}
        isOpen={showEditModal}
        onSave={handleSave}
        onClose={() => setShowEditModal(false)}
        isSaving={isSaving}
      />
      <DeleteItemModal
        item={item}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}