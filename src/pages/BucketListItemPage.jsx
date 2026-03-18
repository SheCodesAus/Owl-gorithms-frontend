import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBucketList } from "../hooks/useBucketList";
import { useVotes } from "../hooks/useVotes";
import { useAuth } from "../hooks/use-auth";
import { updateItem, deleteItem } from "../api/items";

import ItemDetailCard from "../components/items/ItemDetailCard";
import StatusUpdateModal from "../components/modals/StatusUpdateModal";
import ItemDateModal from "../components/modals/ItemDateModal";

export default function BucketListItemPage() {
  const { listId, itemId } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { bucketList, loadBucketList } = useBucketList(Number(listId));

  const [item, setItem] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    if (bucketList?.items) {
      const found = bucketList.items.find(it => it.id === Number(itemId));
      setItem(found);
    }
  }, [bucketList, itemId]);

  const handleStatusUpdate = async (newStatus) => {
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

  const canEdit = auth?.user && bucketList?.owner?.id === auth.user.id;

  if (!item) return null;

  return (
    <section className="item-page">
      <div className="container">
        <ItemDetailCard
          bucketList={bucketList}
          item={item}
          canEdit={canEdit}
          onBack={() => navigate(`/bucketlists/${listId}`)}
          onAddDate={() => setShowDateModal(true)}
          onUpdateStatus={(val) => {
            // FIX: Direct update if string, otherwise open modal
            if (typeof val === 'string') {
              handleStatusUpdate(val);
            } else {
              setShowStatusModal(true);
            }
          }}
        />
      </div>

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
        onSave={async (data) => {
            await updateItem(item.id, data, auth?.access);
            await loadBucketList();
            setShowDateModal(false);
        }}
        onClose={() => setShowDateModal(false)}
      />
    </section>
  );
}