import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function DashboardCardGrid({
  bucketLists,
  selectedListId,
  onSelectList,
  isLoading,
  error,
  onRetry,
  onCreateClick,
}) {
  if (isLoading) {
    return <div className="p-6 text-center text-gray-300">Loading bucket lists...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-400 mb-4">Unable to load bucket lists.</p>
        <button
          onClick={onRetry}
          className="primary-gradient-button px-4 py-2 rounded-lg text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!bucketLists.length) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-300 mb-4">No bucket lists yet.</p>
        <button
          onClick={onCreateClick}
          className="primary-gradient-button px-4 py-2 rounded-lg text-white"
        >
          Create your first list
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {bucketLists.map((list) => {
        const isSelected = list.id === selectedListId;

        return (
          <Link
            key={list.id}
            to={`/bucketlists/${list.id}`}
            onClick={() => onSelectList(list.id)}
          >
            <motion.div
              whileHover={{ translateY: -4 }}
              transition={{ duration: 0.25 }}
              className={`dashboard-gradient-card ${isSelected ? "border-indigo-500" : ""}`}
            >
              <h3 className="text-white text-lg font-semibold mb-2">{list.title}</h3>
              <p className="text-white text-sm mb-2">{list.items?.length || 0} items</p>
              {list.items?.length > 0 && (
                <p className="text-white text-xs">
                  {list.items.filter((i) => i.status === "completed").length} completed / {list.items.length} total
                </p>
              )}
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}

export default DashboardCardGrid;