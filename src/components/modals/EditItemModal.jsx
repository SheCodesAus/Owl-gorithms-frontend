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

  const [hasDate, setHasDate] = useState(false);
  const [hasTime, setHasTime] = useState(false);

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
  }, [item, isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleDate = () => {
    setHasDate((prev) => {
      const next = !prev;

      if (!next) {
        setFormData((current) => ({
          ...current,
          start_date: "",
          end_date: "",
        }));
      }

      return next;
    });
  };

  const handleToggleTime = () => {
    setHasTime((prev) => {
      const next = !prev;

      if (!next) {
        setFormData((current) => ({
          ...current,
          start_time: "",
          end_time: "",
        }));
      }

      return next;
    });
  };

  const renderFieldError = (field) => {
    if (!errors?.[field]) return null;

    if (Array.isArray(errors[field])) {
      return (
        <p className="mt-1 text-sm text-red-500">{errors[field].join(" ")}</p>
      );
    }

    return <p className="mt-1 text-sm text-red-500">{errors[field]}</p>;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSave({
      title: formData.title,
      description: formData.description,
      start_date: hasDate ? formData.start_date || null : null,
      end_date: hasDate ? formData.end_date || null : null,
      start_time: hasTime ? formData.start_time || null : null,
      end_time: hasTime ? formData.end_time || null : null,
    });
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

            {hasDate ? (
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
            ) : null}
          </div>

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
                  Include a start time and optional end time for this item.
                </p>
              </div>
            </label>

            {hasTime ? (
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
            ) : null}
          </div>
        </div>

        {errors?.non_field_errors ? (
          <p className="text-center text-sm text-red-500">
            {Array.isArray(errors.non_field_errors)
              ? errors.non_field_errors.join(" ")
              : errors.non_field_errors}
          </p>
        ) : null}

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