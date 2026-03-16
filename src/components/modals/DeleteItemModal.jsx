import FormModal from "../UI/FormModal";

export default function DeleteItemModal({
  item,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}) {
  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Are you sure?"
      subtitle="This action cannot be undone."
      maxWidth="max-w-sm"
    >
      <div className="form-stack">
        <div className="delete-warning-box">
          <strong>{item?.title}</strong> will be permanently deleted.
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onClose}
            className="secondary-modal-button"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="danger-modal-button"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </FormModal>
  );
}