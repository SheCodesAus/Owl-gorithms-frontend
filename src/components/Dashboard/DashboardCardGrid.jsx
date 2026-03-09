import { motion } from "framer-motion";
import DashboardBucketCard from "./DashboardBucketCard";

function DashboardCardGrid({
  user,
  bucketLists,
  selectedListId,
  onSelectList,
  isLoading,
  error,
  onRetry,
}) {
  return (
    <div className="space-y-5">
      <motion.div
        className="px-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.3 }}
      >
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--muted-text)]">
            
        </p>

        <h1 className="brand-font mt-2 text-3xl font-bold tracking-tight text-[var(--heading-text)] sm:text-4xl">
          {user?.first_name ? `Let's go, ${user.first_name}!` : "Let's go!"}
        </h1>
      </motion.div>

      {isLoading ? (
        <div className="section-card flex min-h-[420px] items-center justify-center p-8 text-center">
          <div className="space-y-3">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#d8d1ee] border-t-[#6b4eaa]" />
            <p className="text-lg font-medium text-[var(--heading-text)]">
              Loading your bucket lists...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="section-card flex min-h-[420px] flex-col items-center justify-center gap-4 p-8 text-center">
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
        <div className="section-card flex min-h-[420px] flex-col items-center justify-center gap-4 p-8 text-center">
          <h2 className="brand-font text-2xl font-semibold text-[var(--heading-text)]">
            Looks pretty empty here. Let's fix that.
          </h2>

          <p className="max-w-md text-[var(--muted-text)]">
            Is that.. Tumbleweed?
          </p>

          <button
            type="button"
            className="primary-gradient-button-light rounded-full px-6 py-3 font-semibold"
          >
            <img src="./text_logo_dark.png" width={70}/>
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {bucketLists.map((bucketList, index) => (
            <DashboardBucketCard
              key={bucketList.id}
              bucketList={bucketList}
              index={index}
              isSelected={bucketList.id === selectedListId}
              onSelect={onSelectList}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardCardGrid;