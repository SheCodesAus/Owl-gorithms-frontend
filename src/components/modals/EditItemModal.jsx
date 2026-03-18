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
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    setFormData({
      title: item?.title ?? "",
      description: item?.description ?? "",
      start_date: item?.start_date ?? "",
      end_date: item?.end_date ?? "",
      start_time: item?.start_time ?? "",
      end_time: item?.end_time ?? "",
    });
  }, [item, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            title: formData.title,
            description: formData.description,
            start_date: formData.start_date || null,
            end_date: formData.end_date || null,
            start_time: formData.start_time || null,
            end_time: formData.end_time || null,
          });
        }}
      >
        <div className="form-field">
          <label className="form-label" htmlFor="edit-item-title">TITLE</label>
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
          <label className="form-label" htmlFor="edit-item-description">DESCRIPTION</label>
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

        {/* Date row */}
        <div style={{ display: "flex", gap: "12px" }}>
          <div className="form-field" style={{ flex: 1 }}>
            <label className="form-label" htmlFor="edit-start-date">FROM</label>
            <input
              id="edit-start-date"
              name="start_date"
              type="date"
              className="form-input"
              value={formData.start_date}
              onChange={handleChange}
            />
            {errors?.start_date ? (
              <p className="form-error-text">{errors.start_date}</p>
            ) : null}
          </div>

          <div className="form-field" style={{ flex: 1 }}>
            <label className="form-label" htmlFor="edit-end-date">
              TO{" "}
              <span style={{ fontWeight: 400, fontSize: "0.8rem", color: "var(--muted-text)" }}>
                (optional)
              </span>
            </label>
            <input
              id="edit-end-date"
              name="end_date"
              type="date"
              className="form-input"
              value={formData.end_date}
              onChange={handleChange}
              min={formData.start_date || undefined}
            />
            {errors?.end_date ? (
              <p className="form-error-text">{errors.end_date}</p>
            ) : null}
          </div>
        </div>

        {/* Time row */}
        <div style={{ display: "flex", gap: "12px" }}>
          <div className="form-field" style={{ flex: 1 }}>
            <label className="form-label" htmlFor="edit-start-time">
              START TIME{" "}
              <span style={{ fontWeight: 400, fontSize: "0.8rem", color: "var(--muted-text)" }}>
                (optional)
              </span>
            </label>
            <input
              id="edit-start-time"
              name="start_time"
              type="time"
              className="form-input"
              value={formData.start_time}
              onChange={handleChange}
            />
            {errors?.start_time ? (
              <p className="form-error-text">{errors.start_time}</p>
            ) : null}
          </div>

          <div className="form-field" style={{ flex: 1 }}>
            <label className="form-label" htmlFor="edit-end-time">
              END TIME{" "}
              <span style={{ fontWeight: 400, fontSize: "0.8rem", color: "var(--muted-text)" }}>
                (optional)
              </span>
            </label>
            <input
              id="edit-end-time"
              name="end_time"
              type="time"
              className="form-input"
              value={formData.end_time}
              onChange={handleChange}
            />
            {errors?.end_time ? (
              <p className="form-error-text">{errors.end_time}</p>
            ) : null}
          </div>
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