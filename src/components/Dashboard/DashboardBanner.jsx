import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

function DashboardBanner({ onVote, isVotingItemId, message }) {
  return (
    <>
      <motion.section
        className="dashboard-gradient-banner max-w-86"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.35 }}
      >
        <div className="dashboard-gradient-card-inner flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3 text-black sm:gap-4">
            <span className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-[#ff9a6c] to-[#ff5ea8]" />

            <div className="flex min-w-0 items-center gap-2">
              <h2 className="truncate font-semibold sm:text-lg lg:text-xl">
                3 New Notifications
              </h2>
              <ChevronRight className="shrink-0" size={20} />
            </div>
          </div>
        </div>
      </motion.section>

      {message ? (
        <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          {message}
        </div>
      ) : null}
    </>
  );
}

export default DashboardBanner;