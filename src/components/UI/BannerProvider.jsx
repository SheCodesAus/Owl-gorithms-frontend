import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";

const BannerContext = createContext(null);

const BANNER_STYLES = {
  success: {
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50 text-emerald-900",
    iconClassName: "text-emerald-600",
    progressClassName: "bg-emerald-400",
  },
  error: {
    icon: AlertCircle,
    className: "border-red-200 bg-red-50 text-red-900",
    iconClassName: "text-red-600",
    progressClassName: "bg-red-400",
  },
  info: {
    icon: Info,
    className: "border-sky-200 bg-sky-50 text-sky-900",
    iconClassName: "text-sky-600",
    progressClassName: "bg-sky-400",
  },
  warning: {
    icon: TriangleAlert,
    className: "border-amber-200 bg-amber-50 text-amber-900",
    iconClassName: "text-amber-600",
    progressClassName: "bg-amber-400",
  },
};

let bannerId = 0;

function BannerItem({ banner, onClose }) {
  const { id, type = "info", title, message, duration = 4000 } = banner;

  const style = BANNER_STYLES[type] || BANNER_STYLES.info;
  const Icon = style.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-2xl border shadow-lg backdrop-blur-sm ${style.className}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <div className={`mt-0.5 shrink-0 ${style.iconClassName}`}>
          <Icon size={18} />
        </div>

        <div className="min-w-0 flex-1">
          {title ? <p className="text-sm font-semibold">{title}</p> : null}
          <p className={`text-sm ${title ? "mt-0.5" : ""}`}>{message}</p>
        </div>

        <button
          type="button"
          onClick={() => onClose(id)}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/10"
          aria-label="Dismiss notification"
        >
          <X size={16} />
        </button>
      </div>

      <motion.div
        className={`h-1 ${style.progressClassName}`}
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: duration / 1000, ease: "linear" }}
      />
    </motion.div>
  );
}

function BannerStack({ banners, removeBanner }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[1200] flex justify-center px-4">
      <div className="pointer-events-auto flex w-full max-w-xl flex-col gap-3">
        <AnimatePresence initial={false}>
          {banners.map((banner) => (
            <BannerItem
              key={banner.id}
              banner={banner}
              onClose={removeBanner}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function BannerProvider({ children }) {
  const [banners, setBanners] = useState([]);

  const removeBanner = useCallback((id) => {
    setBanners((current) => current.filter((banner) => banner.id !== id));
  }, []);

  const showBanner = useCallback(
    ({ type = "info", title = "", message, duration = 4000 }) => {
      if (!message) return;

      const id = ++bannerId;

      setBanners((current) => [
        ...current,
        { id, type, title, message, duration },
      ]);

      window.setTimeout(() => {
        removeBanner(id);
      }, duration);

      return id;
    },
    [removeBanner],
  );

  const value = useMemo(
    () => ({
      showBanner,
      removeBanner,
    }),
    [showBanner, removeBanner],
  );

  return (
    <BannerContext.Provider value={value}>
      {children}
      <BannerStack banners={banners} removeBanner={removeBanner} />
    </BannerContext.Provider>
  );
}

export function useBanner() {
  const context = useContext(BannerContext);

  if (!context) {
    throw new Error("useBanner must be used within a BannerProvider");
  }

  return context;
}
