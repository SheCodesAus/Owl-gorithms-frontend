import { useParams, Link } from "react-router-dom";
import { useBucketList } from "../hooks/useBucketList";

function formatDate(dateString) {
  if (!dateString) return null;
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

function BucketListItemPage() {
  const { listId, itemId } = useParams();
  const { bucketList, isLoading, error } = useBucketList(listId);

  if (isLoading)
    return <p className="text-gray-300 text-center mt-12">Loading item...</p>;
  if (error)
    return <p className="text-red-400 text-center mt-12">Error loading item.</p>;

  const item = bucketList?.items?.find((i) => i.id === Number(itemId));
  if (!item)
    return <p className="text-gray-300 text-center mt-12">Item not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link
        to={`/bucketlists/${listId}`}
        className="text-indigo-400 mb-4 block hover:underline"
      >
        ← Back to List
      </Link>

      <div className="dashboard-gradient-card p-6 flex flex-col gap-4">
        {/* Title */}
        <h1 className="text-white text-2xl font-bold leading-snug">{item.title}</h1>

        {/* Description */}
        {item.description && (
          <p className="text-white text-sm leading-relaxed">{item.description}</p>
        )}

        {/* Status */}
        <div className="flex gap-4 items-center text-white text-sm">
          <span>Status: <strong>{item.status.replace("_", " ")}</strong></span>
          {item.completed_at && (
            <span>Completed: {formatDate(item.completed_at)}</span>
          )}
        </div>

        {/* Votes */}
        <div className="flex gap-4 items-center text-white text-sm">
          <span>👍 {item.upvotes_count ?? 0}</span>
          <span>👎 {item.downvotes_count ?? 0}</span>
          <span>Score: {item.score ?? 0}</span>
        </div>

        {/* Timestamps */}
        <div className="flex gap-4 text-gray-300 text-xs mt-2">
          <span>Created: {formatDate(item.created_at)}</span>
          <span>Updated: {formatDate(item.updated_at)}</span>
        </div>
      </div>
    </div>
  );
}

export default BucketListItemPage;