import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import DashboardBucketCard from "./DashboardBucketCard";

function DashboardCardGrid({
  bucketLists,
  selectedListId,
  onSelectList,
  isLoading,
  error,
  onRetry,
  onCreateClick,
}) {
  const { auth } = useAuth();
  const user = auth?.user;
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
    <section className="space-y-5">
      <motion.div
        className="space-y-4 px-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.3 }}
      >
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--muted-text)]">
            Your bucket lists
          </p>

          <h1 className="brand-font mt-2 text-3xl font-bold tracking-tight text-[var(--heading-text)] sm:text-4xl">
            {user?.first_name ? `Let's go, ${user.first_name}!` : "Let's go!"}
          </h1>
        </div>

        <div className="flex justify-start">
          <div className="inline-flex items-center gap-3 mt-4 rounded-[1.5rem] border border-white/60 bg-white/55 px-3 py-3 shadow-[0_10px_30px_rgba(49,42,70,0.08)] backdrop-blur-md">
            <button
              type="button"
              onClick={onCreateClick}
              aria-label="Create a new bucket list"
              title="Create bucket list"
              className="group inline-flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[linear-gradient(135deg,#15803d_0%,#4ade80_100%)] text-white shadow-[0_14px_36px_rgba(8,38,20,0.35)] transition hover:scale-105 hover:shadow-[0_18px_46px_rgba(8,38,20,0.45)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-300/70"
            >
              <Plus
                size={26}
                strokeWidth={2.8}
                className="transition group-hover:rotate-90"
              />
            </button>

            <div className="pr-2">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted-text)]">
                Quick action
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--heading-text)]">
                Create
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="section-card flex min-h-[320px] items-center justify-center p-8 text-center">
          <div className="space-y-3">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#d8d1ee] border-t-[#6b4eaa]" />
            <p className="text-lg font-medium text-[var(--heading-text)]">
              Loading your bucket lists...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="section-card flex min-h-[320px] flex-col items-center justify-center gap-4 p-8 text-center">
          <h2 className="brand-font text-2xl font-semibold text-[var(--heading-text)]">
            Something went wrong
          </h2>

          <p className="max-w-md text-[var(--muted-text)]">{error}</p>

          <button
            type="button"
            onClick={onRetry}
            className="primary-gradient-button rounded-full px-6 py-3 font-semibold"
          >
            Try Again
          </button>
        </div>
      ) : !bucketLists.length ? (
        <div className="section-card flex min-h-[320px] flex-col items-center justify-center gap-4 p-8 text-center">
          <h2 className="brand-font text-2xl font-semibold text-[var(--heading-text)]">
            Looks pretty empty here. Let's fix that.
          </h2>

          <p className="max-w-md text-[var(--muted-text)]">
            Is that.. Tumbleweed?
          </p>

          <div className="group flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={onCreateClick}
              aria-label="Create your first bucket list"
              title="Create your first bucket list"
              className="inline-flex cursor-pointer h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#15803d_0%,#4ade80_100%)] text-white shadow-[0_14px_36px_rgba(8,38,20,0.35)] transition hover:scale-105 hover:shadow-[0_18px_46px_rgba(8,38,20,0.45)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-300/70"
            >
              <Plus
                size={28}
                strokeWidth={2.8}
                className="transition group-hover:rotate-90"
              />
            </button>

            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted-text)] transition group-hover:text-[var(--heading-text)]">
              Create list
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          {bucketLists.map((bucketList, index) => (
            <motion.div
              key={bucketList.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.28 }}
              className="h-full"
            >
              <DashboardBucketCard
                bucketList={bucketList}
                index={index}
                isSelected={bucketList.id === selectedListId}
                onSelect={onSelectList}
              />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

export default DashboardCardGrid;
