import { useEffect, useState } from "react";
import FormModal from "../UI/FormModal";

export default function StatusUpdateModal({
  item,
  isOpen,
  onSave,
  onClose,
  isSaving,
  error,
}) {
  const [selectedStatus, setSelectedStatus] = useState(item?.status ?? "proposed");

  useEffect(() => {
    setSelectedStatus(item?.status ?? "proposed");
  }, [item, isOpen]);

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Update status"
      subtitle="Change the status of this item."
      maxWidth="max-w-sm"
    >
      <form
        className="form-stack"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(selectedStatus);
        }}
      >
        <div className="form-field">
          <label className="form-label" htmlFor="item-status-select">
            STATUS
          </label>
          <select
            id="item-status-select"
            className="form-select"
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
          >
            <option value="proposed">Proposed</option>
            <option value="locked_in">Locked In</option>
            <option value="complete">Complete</option>
          </select>
        </div>

        {error ? <p className="form-error-text text-center">{error}</p> : null}

        <div className="form-actions">
          <button type="button" onClick={onClose} className="secondary-modal-button">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="primary-gradient-button rounded-2xl px-5 py-3 text-sm font-semibold"
          >
            {isSaving ? "Saving..." : "Update status"}
          </button>
        </div>
      </form>
    </FormModal>
  );
}