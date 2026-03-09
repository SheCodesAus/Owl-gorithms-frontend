import { motion } from "framer-motion";
import { ChevronRight, ChevronsDown } from "lucide-react";

function DashboardBanner() {
  return (
    <motion.section
      className="dashboard-gradient-card flex items-center justify-between gap-4 px-4 py-3 sm:px-5"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, duration: 0.35 }}
    >
      <div className="flex min-w-0 items-center gap-3 text-white sm:gap-4">
        <span className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-[#ff9a6c] to-[#ff5ea8]" />

        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate font-semibold sm:text-lg lg:text-xl">
            3 New Notifications
          </h2>
          <ChevronRight className="shrink-0" size={20} />
        </div>
      </div>

      <motion.button
        type="button"
        className="shrink-0 rounded-2xl bg-white/65 px-4 py-2 text-sm font-semibold text-[#4c2f6e] backdrop-blur-sm transition hover:bg-white/80 sm:px-5 sm:text-base cursor-pointer"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        <ChevronsDown size={20} />
      </motion.button>
    </motion.section>
  );
}

export default DashboardBanner;