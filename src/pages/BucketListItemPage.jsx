import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBucketList } from "../hooks/useBucketList";
import { useVotes } from "../hooks/useVotes";
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

  const handleStatusUpdate = async (val) => {
    if (!item) return;
    const newStatus = typeof val === 'string' ? val : val?.status;
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

  if (!item) return null;
  const canEdit = auth?.user && bucketList?.owner?.id === auth.user.id;

  return (
    <>
      <section className="page-shell">
        <div className="page-width item-page-stack">
          <ItemDetailCard
            bucketList={bucketList}
            item={item}
            canEdit={canEdit}
            onBack={() => navigate(`/bucketlists/${listId}`)}
            onAddDate={() => setShowDateModal(true)}
            onUpdateStatus={(val) => {
              if (typeof val === 'string') handleStatusUpdate(val);
              else setShowStatusModal(true);
            }}
            onEdit={() => setShowEditModal(true)}
            onDelete={() => setShowDeleteModal(true)}
          />
          <ExtendedItemCard itemTitle={item.title} />
        </div>
      </section>

      <StatusUpdateModal item={item} isOpen={showStatusModal} onSave={handleStatusUpdate} onClose={() => setShowStatusModal(false)} isSaving={isSavingStatus} error={statusError} />
      <ItemDateModal item={item} isOpen={showDateModal} onSave={handleSaveDate} onClose={() => setShowDateModal(false)} />
      <EditItemModal item={item} isOpen={showEditModal} onSave={(data) => updateItem(item.id, data, auth?.access).then(() => loadBucketList())} onClose={() => setShowEditModal(false)} isSaving={isSaving} />
      <DeleteItemModal item={item} isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={() => deleteItem(item.id, auth?.access).then(() => navigate(`/bucketlists/${listId}`))} />
    </>
  );
}