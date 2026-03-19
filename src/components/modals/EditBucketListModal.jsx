import { useEffect, useState } from "react";
import FormModal from "../UI/FormModal";

export default function EditBucketListModal({
  bucketList,
  isOpen,
  onSave,
  onClose,
  isSaving,
  errors,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    decision_deadline: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    is_public: false,
  });

  const [hasDeadline, setHasDeadline] = useState(false);
  const [hasDate, setHasDate] = useState(false);
  const [hasTime, setHasTime] = useState(false);

  useEffect(() => {
    const nextDeadline = bucketList?.decision_deadline
      ? bucketList.decision_deadline.slice(0, 16)
      : "";

    const nextStartDate = bucketList?.start_date ?? "";
    const nextEndDate = bucketList?.end_date ?? "";
    const nextStartTime = bucketList?.start_time ?? "";
    const nextEndTime = bucketList?.end_time ?? "";

    setFormData({
      title: bucketList?.title ?? "",
      description: bucketList?.description ?? "",
      decision_deadline: nextDeadline,
      start_date: nextStartDate,
      end_date: nextEndDate,
      start_time: nextStartTime,
      end_time: nextEndTime,
      is_public: Boolean(bucketList?.is_public),
    });

    setHasDeadline(Boolean(nextDeadline));
    setHasDate(Boolean(nextStartDate || nextEndDate));
    setHasTime(Boolean(nextStartTime || nextEndTime));
  }, [bucketList, isOpen]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleToggleDeadline = () => {
    setHasDeadline((prev) => {
      const next = !prev;

      if (!next) {
        setFormData((current) => ({
          ...current,
          decision_deadline: "",
        }));
      }

      return next;
    });
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
      is_public: formData.is_public,
      decision_deadline_input: hasDeadline
        ? formData.decision_deadline || null
        : null,
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
      title="Edit bucket list"
      subtitle="Update the details for this list."
      maxWidth="max-w-xl"
    >
      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="form-label" htmlFor="edit-bucketlist-title">
            TITLE
          </label>
          <input
            id="edit-bucketlist-title"
            name="title"
            type="text"
            className="form-input"
            value={formData.title}
            onChange={handleChange}
            placeholder="Summer adventures"
            required
          />
          {renderFieldError("title")}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="edit-bucketlist-description">
            DESCRIPTION
          </label>
          <textarea
            id="edit-bucketlist-description"
            name="description"
            className="form-textarea"
            value={formData.description}
            onChange={handleChange}
            placeholder="Refine the plan, add context, sharpen the vision..."
            rows={4}
          />
          {renderFieldError("description")}
        </div>

        <div className="rounded-[1.4rem] border border-black/10 bg-[var(--surface-soft)]/70 p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="is_public"
              checked={formData.is_public}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-black/20 text-[var(--primary-cta)] focus:ring-[var(--primary-cta)]"
            />
            <div>
              <p className="text-sm font-semibold text-[var(--heading-text)]">
                Make list public
              </p>
              <p className="text-sm text-[var(--muted-text)]">
                Public lists can be viewed and shared. Private ones stay in the
                inner circle.
              </p>
            </div>
          </label>
          {renderFieldError("is_public")}
        </div>

        <div className="space-y-3">
          <div className="rounded-[1.4rem] border border-black/10 bg-[var(--surface-soft)]/70 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={hasDeadline}
                onChange={handleToggleDeadline}
                className="mt-1 h-4 w-4 rounded border-black/20 text-[var(--primary-cta)] focus:ring-[var(--primary-cta)]"
              />
              <div>
                <p className="text-sm font-semibold text-[var(--heading-text)]">
                  Add deadline
                </p>
                <p className="text-sm text-[var(--muted-text)]">
                  Set a decision deadline for the list.
                </p>
              </div>
            </label>

            {hasDeadline ? (
              <div className="mt-4">
                <div className="form-field">
                  <label
                    className="form-label"
                    htmlFor="edit-bucketlist-decision-deadline"
                  >
                    DEADLINE
                  </label>
                  <input
                    id="edit-bucketlist-decision-deadline"
                    name="decision_deadline"
                    type="date"
                    className="form-input"
                    value={formData.decision_deadline}
                    onChange={handleChange}
                  />
                  {renderFieldError("decision_deadline")}
                </div>
              </div>
            ) : null}
          </div>

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
                  Include a start date and optional end date for this list.
                </p>
              </div>
            </label>

            {hasDate ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="form-field">
                  <label className="form-label" htmlFor="edit-bucketlist-start-date">
                    FROM
                  </label>
                  <input
                    id="edit-bucketlist-start-date"
                    name="start_date"
                    type="date"
                    className="form-input"
                    value={formData.start_date}
                    onChange={handleChange}
                  />
                  {renderFieldError("start_date")}
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="edit-bucketlist-end-date">
                    TO
                  </label>
                  <input
                    id="edit-bucketlist-end-date"
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
                  Include a start time and optional end time for this list.
                </p>
              </div>
            </label>

            {hasTime ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="form-field">
                  <label className="form-label" htmlFor="edit-bucketlist-start-time">
                    START TIME
                  </label>
                  <input
                    id="edit-bucketlist-start-time"
                    name="start_time"
                    type="time"
                    className="form-input"
                    value={formData.start_time}
                    onChange={handleChange}
                  />
                  {renderFieldError("start_time")}
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="edit-bucketlist-end-time">
                    END TIME
                  </label>
                  <input
                    id="edit-bucketlist-end-time"
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