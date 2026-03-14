import { useParams, Link } from "react-router-dom";
import { useBucketList } from "../hooks/useBucketList";
import { motion } from "framer-motion";

export default function BucketListItemPage() {
  const { bucketListId, itemId } = useParams();
  const { bucketList, isLoading, bucketListError } = useBucketList(Number(bucketListId));

  // Loading and error handling
  if (isLoading) return <p>Loading item...</p>;
  if (bucketListError) return <p>{bucketListError}</p>;
  if (!bucketList) return <p>Bucket list not found</p>;

  // Find item by actual database ID
  const item = bucketList.items.find((i) => i.id === Number(itemId));
  if (!item) return <p>Item not found</p>;

  return (
    <motion.div
      className="p-8 rounded-2xl dashboard-gradient-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <h1 className="text-2xl font-bold mb-4">{item.title}</h1>
      <p className="mb-6">{item.description || "No description"}</p>

      <div className="flex gap-4 items-center mb-6">
        <span>Status: <strong>{item.status}</strong></span>
        {item.completed_at && (
          <span>Completed at: {new Date(item.completed_at).toLocaleDateString()}</span>
        )}
      </div>

      <Link
        to={`/bucketlists/${bucketListId}`}
        className="primary-gradient-button px-4 py-2 rounded-lg"
      >
        Back to {bucketList.title}
      </Link>
    </motion.div>
  );
}