import { useEffect, useState } from "react";
import FormModal from "../UI/FormModal";

export default function EditItemModal({
  item,
  isOpen,
  onSave,
  onClose,
  isSaving,
  errors,
}) {
  const [formData, setFormData] = useState({
    title: item?.title ?? "",
    description: item?.description ?? "",
  });

  useEffect(() => {
    setFormData({
      title: item?.title ?? "",
      description: item?.description ?? "",
    });
  }, [item, isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit item"
      subtitle="Update the details for this item."
      maxWidth="max-w-md"
    >
      <form
        className="form-stack"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(formData);
        }}
      >
        <div className="form-field">
          <label className="form-label" htmlFor="edit-item-title">
            TITLE
          </label>
          <input
            id="edit-item-title"
            name="title"
            type="text"
            className="form-input"
            value={formData.title}
            onChange={handleChange}
            required
          />
          {errors?.title ? <p className="form-error-text">{errors.title}</p> : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="edit-item-description">
            DESCRIPTION
          </label>
          <textarea
            id="edit-item-description"
            name="description"
            className="form-textarea"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
          {errors?.description ? (
            <p className="form-error-text">{errors.description}</p>
          ) : null}
        </div>

        {errors?.non_field_errors ? (
          <p className="form-error-text text-center">{errors.non_field_errors}</p>
        ) : null}

        <div className="form-actions">
          <button type="button" onClick={onClose} className="secondary-modal-button">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="primary-gradient-button rounded-2xl px-5 py-3 text-sm font-semibold"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </FormModal>
  );
}