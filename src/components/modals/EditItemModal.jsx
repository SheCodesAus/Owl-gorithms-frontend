import { useEffect, useState } from "react";
import FormModal from "../UI/FormModal";

export default function EditItemModal({
  item,
  isOpen,
  onSave,
  onClose,
  isSaving,
  errors = {},
}) {
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
  });

  // Toggles for date/time fields
  const [hasDate, setHasDate] = useState(false);
  const [hasTime, setHasTime] = useState(false);

  // Local client-side validation errors
  const [localErrors, setLocalErrors] = useState({});

  // Populate form when item or modal opens
  useEffect(() => {
    const nextStartDate = item?.start_date ?? "";
    const nextEndDate = item?.end_date ?? "";
    const nextStartTime = item?.start_time ?? "";
    const nextEndTime = item?.end_time ?? "";

    setFormData({
      title: item?.title ?? "",
      description: item?.description ?? "",
      start_date: nextStartDate,
      end_date: nextEndDate,
      start_time: nextStartTime,
      end_time: nextEndTime,
    });

    setHasDate(Boolean(nextStartDate || nextEndDate));
    setHasTime(Boolean(nextStartTime || nextEndTime));
    setLocalErrors({});
  }, [item, isOpen]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle date/time fields
  const handleToggleDate = () => {
    setHasDate((prev) => {
      const next = !prev;
      if (!next) {
        setFormData((curr) => ({ ...curr, start_date: "", end_date: "" }));
      }
      return next;
    });
  };

  const handleToggleTime = () => {
    setHasTime((prev) => {
      const next = !prev;
      if (!next) {
        setFormData((curr) => ({ ...curr, start_time: "", end_time: "" }));
      }
      return next;
    });
  };

  // Merge server and local errors for rendering
  const renderFieldError = (field) => {
    const fieldErrors = [
      ...(errors?.[field] || []),
      ...(localErrors?.[field] ? [localErrors[field]] : []),
    ];
    if (!fieldErrors.length) return null;
    return <p className="mt-1 text-sm text-red-500">{fieldErrors.join(" ")}</p>;
  };

 const handleSubmit = (event) => {
  event.preventDefault();

  const validationErrors = {};

  // Auto-fill end date if missing (dates can be same)
  if (hasDate && formData.start_date && !formData.end_date) {
    formData.end_date = formData.start_date;
  }

  // Auto-fill end time if missing
  if (hasTime && formData.start_time && !formData.end_time) {
    formData.end_time = formData.start_time;
  }

  // Validate that end_time is AFTER start_time (cannot be equal)
  if (
    hasTime &&
    formData.start_time &&
    formData.end_time &&
    formData.start_time >= formData.end_time
  ) {
    validationErrors.end_time =
      "End time cannot be the same as start time.";
  }

  // Stop submission if there are validation errors
  if (Object.keys(validationErrors).length > 0) {
    setLocalErrors(validationErrors);
    return;
  }

  setLocalErrors({}); // clear previous errors

  const payload = {
    title: formData.title,
    description: formData.description,
    start_date: hasDate ? formData.start_date : null,
    end_date: hasDate ? formData.end_date : null,
    start_time: hasTime ? formData.start_time : null,
    end_time: hasTime ? formData.end_time : null,
  };

  onSave(payload);
};

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit item"
      subtitle="Update the details for this item."
      maxWidth="max-w-xl"
    >
      <form className="form-stack" onSubmit={handleSubmit}>
        {/* TITLE */}
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
            placeholder="Go skydiving"
            required
          />
          {renderFieldError("title")}
        </div>

        {/* DESCRIPTION */}
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
            placeholder="Update the plan, details, or notes..."
            rows={4}
          />
          {renderFieldError("description")}
        </div>

        {/* DATE SECTION */}
        <div className="space-y-3">
          <div className="rounded-[1.4rem] border border-black/10 bg-[var(--surface-soft)]/70 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={hasDate}
                onChange={handleToggleDate}
                className="mt-1 h-4 w-4 rounded border-black/20 text-[var(--primary-cta)] focus:ring-[var(--primary-cta)]"
              />
              <div>
                <p className="text-sm font-semibold text-[var(--heading-text)]">
                  Add date
                </p>
                <p className="text-sm text-[var(--muted-text)]">
                  Include a start date and optional end date for this item.
                </p>
              </div>
            </label>

            {hasDate && (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="form-field">
                  <label className="form-label" htmlFor="edit-start-date">
                    FROM
                  </label>
                  <input
                    id="edit-start-date"
                    name="start_date"
                    type="date"
                    className="form-input"
                    value={formData.start_date}
                    onChange={handleChange}
                  />
                  {renderFieldError("start_date")}
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="edit-end-date">
                    TO
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
                  {renderFieldError("end_date")}
                </div>
              </div>
            )}
          </div>

          {/* TIME SECTION */}
          <div className="rounded-[1.4rem] border border-black/10 bg-[var(--surface-soft)]/70 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={hasTime}
                onChange={handleToggleTime}
                className="mt-1 h-4 w-4 rounded border-black/20 text-[var(--primary-cta)] focus:ring-[var(--primary-cta)]"
              />
              <div>
                <p className="text-sm font-semibold text-[var(--heading-text)]">
                  Add time
                </p>
                <p className="text-sm text-[var(--muted-text)]">
                  Include a start time and end time for this item.
                </p>
              </div>
            </label>

            {hasTime && (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="form-field">
                  <label className="form-label" htmlFor="edit-start-time">
                    START TIME
                  </label>
                  <input
                    id="edit-start-time"
                    name="start_time"
                    type="time"
                    className="form-input"
                    value={formData.start_time}
                    onChange={handleChange}
                  />
                  {renderFieldError("start_time")}
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="edit-end-time">
                    END TIME
                  </label>
                  <input
                    id="edit-end-time"
                    name="end_time"
                    type="time"
                    className="form-input"
                    value={formData.end_time}
                    onChange={handleChange}
                  />
                  {renderFieldError("end_time")}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Non-field errors */}
        {errors?.non_field_errors && (
          <p className="text-center text-sm text-red-500">
            {Array.isArray(errors.non_field_errors)
              ? errors.non_field_errors.join(" ")
              : errors.non_field_errors}
          </p>
        )}

        {/* Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={onClose}
            className="secondary-modal-button"
            disabled={isSaving}
          >
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