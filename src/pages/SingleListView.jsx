import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useBucketList } from "../hooks/useBucketList";
import { useAuth } from "../hooks/use-auth";
import { deleteItem } from "../api/items";

import BucketListHeader from "../components/bucketlist/BucketListHeader";
import BucketListProgress from "../components/bucketlist/BucketListProgress";
import BucketListFilterTabs from "../components/bucketlist/BucketListFilterTabs";
import BucketListItemCard from "../components/bucketlist/BucketListItemCard";
import DeleteItemModal from "../components/modals/DeleteItemModal";

export default function SingleListView() {
  const { id } = useParams();
  const { auth } = useAuth();
  const { bucketList, isLoading, bucketListError, loadBucketList } =
    useBucketList(Number(id));

  const [filter, setFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const items = bucketList?.items ?? [];

  const completedCount = useMemo(
    () => items.filter((item) => item.is_completed).length,
    [items]
  );

  const progress = items.length
    ? Math.round((completedCount / items.length) * 100)
    : 0;

  const filteredItems = useMemo(() => {
    if (filter === "complete") return items.filter((item) => item.is_completed);
    if (filter === "pending") return items.filter((item) => !item.is_completed);
    return items;
  }, [items, filter]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      await deleteItem(deleteTarget.id, auth?.access);
      await loadBucketList();
      setDeleteTarget(null);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <section className="page-shell">
        <div className="page-width">
          <div className="empty-state-card">Loading bucket list...</div>
        </div>
      </section>
    );
  }

  if (bucketListError || !bucketList) {
    return (
      <section className="page-shell">
        <div className="page-width">
          <div className="error-state-card">
            {bucketListError || "Something went wrong."}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <div className="page-width bucketlist-page-stack">
        <BucketListHeader bucketList={bucketList} />

        <BucketListProgress
          completed={completedCount}
          total={items.length}
          progress={progress}
        />

        <BucketListFilterTabs filter={filter} onChange={setFilter} />

        <div className="bucketlist-items-stack">
          {filteredItems.length === 0 ? (
            <div className="empty-state-card">
              Nothing here yet — make a plan, do something new!
            </div>
          ) : (
            filteredItems.map((item) => (
              <BucketListItemCard
                key={item.id}
                item={item}
                listId={bucketList.id}
                onDelete={setDeleteTarget}
              />
            ))
          )}
        </div>
      </div>

      <DeleteItemModal
        item={deleteTarget}
        isOpen={Boolean(deleteTarget)}
        isDeleting={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </section>
  );
}