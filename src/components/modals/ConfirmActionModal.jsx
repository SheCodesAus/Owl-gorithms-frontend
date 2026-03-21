import FormModal from "../UI/FormModal";

function ConfirmActionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading = false,
  tone = "danger",
}) {
  const confirmButtonClass =
    tone === "danger" ? "danger-modal-button" : "primary-gradient-button";

  return (
    <FormModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-5">
        {description ? (
          <p className="text-sm leading-relaxed text-[var(--muted-text)] sm:text-base">
            {description}
          </p>
        ) : null}

        <div className="form-actions">
          <button
            type="button"
            onClick={onClose}
            className="secondary-modal-button"
            disabled={isLoading}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={confirmButtonClass}
          >
            {isLoading ? "Working..." : confirmLabel}
          </button>
        </div>
      </div>
    </FormModal>
  );
}

export default ConfirmActionModal;