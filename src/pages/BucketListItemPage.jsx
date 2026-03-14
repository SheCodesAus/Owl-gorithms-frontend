import { useParams, Link } from "react-router-dom";
import { useBucketList } from "../hooks/useBucketList";
import { useState } from "react";

function formatDate(dateString) {
  if (!dateString) return null;
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

function BucketListItemPage() {
  const { listId, itemId } = useParams();
  const { bucketList, isLoading, error, loadBucketList } = useBucketList(listId);
  const [updating, setUpdating] = useState(false);

  console.log('BucketListItemPage:', { listId, itemId, bucketList, isLoading, error });

  if (isLoading)
    return <p className="text-gray-300 text-center mt-12">Loading item...</p>;
  if (error)
    return <p className="text-red-400 text-center mt-12">Error loading item.</p>;

  const item = bucketList?.items?.find((i) => i.id == itemId);
  console.log('Found item:', item);

  if (!item)
    return <p className="text-gray-300 text-center mt-12">Item not found.</p>;

  const updateStatus = async (newStatus) => {
    const token = localStorage.getItem("access"); // JWT token
    if (!token) {
      alert("You must be logged in to update status.");
      return;
    }

    setUpdating(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/bucketlists/${listId}/items/${item.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || `Failed to update status (${res.status})`);
      }

      await loadBucketList(); // refresh item
    } catch (err) {
      console.error("Status update error:", err);
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link
        to={`/bucketlists`}
        className="text-indigo-400 mb-4 block hover:underline"
      >
        ← Back to Bucket Lists
      </Link>

      <div className="dashboard-gradient-card p-6 flex flex-col gap-4">
        <h1 className="text-white text-2xl font-bold leading-snug">{item.title}</h1>

        {item.description && (
          <p className="text-white text-sm leading-relaxed">{item.description}</p>
        )}

        {/* Status Buttons */}
        <div className="flex gap-3 mt-2">
          {["proposed", "locked_in", "complete"].map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded-full font-semibold text-sm
                ${item.status === status ? "bg-white text-purple-700" : "bg-purple-600 text-white"}
                transition hover:opacity-80`}
              disabled={updating}
              onClick={() => updateStatus(status)}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>

        {item.completed_at && (
          <div className="text-white text-sm">Completed: {formatDate(item.completed_at)}</div>
        )}

        {/* Votes */}
        <div className="flex gap-4 items-center text-white text-sm">
          <span>⬆️ {item.upvotes_count ?? 0}</span>
          <span>⬇️ {item.downvotes_count ?? 0}</span>
        </div>

        {/* Created/Updated */}
        <div className="flex gap-4 text-gray-300 text-xs mt-2">
          <span>Created: {formatDate(item.created_at)}</span>
          <span>Updated: {formatDate(item.updated_at)}</span>
        </div>
      </div>
    </div>
  );
}

export default BucketListItemPage;