import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

function FormModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-xl",
}) {
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="modal-backdrop fixed inset-0 z-50 overflow-y-auto px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <div className="flex min-h-full items-start justify-center md:items-center">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="form-modal-title"
              className={`modal-shell relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto p-6 pb-10 md:p-8`}
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.985 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={onClose}
                className="modal-close-button absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--heading-text)]"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="relative z-[1] pr-12">
                <h2
                  id="form-modal-title"
                  className="brand-font text-3xl font-bold text-[var(--heading-text)]"
                >
                  {title}
                </h2>

                {subtitle ? (
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-text)]">
                    {subtitle}
                  </p>
                ) : null}
              </div>

              <div className="relative z-[1] mt-6">{children}</div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default FormModal;