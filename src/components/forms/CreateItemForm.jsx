import { useState } from "react";
import { useItems } from "../../hooks/useItems";

function CreateItemForm({ bucketListId, onSuccess, onClose }) {
  const { addItem } = useItems(bucketListId);

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
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const newItem = await addItem({
        title: formData.title,
        description: formData.description,
        start_date: hasDate ? formData.start_date || null : null,
        end_date: hasDate ? formData.end_date || null : null,
        start_time: hasTime ? formData.start_time || null : null,
        end_time: hasTime ? formData.end_time || null : null,
      });

      onSuccess(newItem);
    } catch (error) {
      setErrors(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFieldError = (field) => {
    if (!errors[field]) return null;

    if (Array.isArray(errors[field])) {
      return (
        <p className="mt-1 text-sm text-red-500">{errors[field].join(" ")}</p>
      );
    }

    return <p className="mt-1 text-sm text-red-500">{errors[field]}</p>;
  };

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="title" className="form-label">
          TITLE
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          className="form-input"
          placeholder="Go skydiving"
          required
        />
        {renderFieldError("title")}
      </div>

      <div className="form-field">
        <label htmlFor="description" className="form-label">
          DESCRIPTION
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-textarea"
          placeholder="Convince your friends... You got this."
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
                <label htmlFor="start_date" className="form-label">
                  FROM
                </label>
                <input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="form-input"
                />
                {renderFieldError("start_date")}
              </div>

              <div className="form-field">
                <label htmlFor="end_date" className="form-label">
                  TO
                </label>
                <input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="form-input"
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
                <label htmlFor="start_time" className="form-label">
                  START TIME
                </label>
                <input
                  id="start_time"
                  name="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={handleChange}
                  className="form-input"
                />
                {renderFieldError("start_time")}
              </div>

              <div className="form-field">
                <label htmlFor="end_time" className="form-label">
                  END TIME
                </label>
                <input
                  id="end_time"
                  name="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={handleChange}
                  className="form-input"
                />
                {renderFieldError("end_time")}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {errors.non_field_errors && (
        <p className="text-center text-sm text-red-500">
          {Array.isArray(errors.non_field_errors)
            ? errors.non_field_errors.join(" ")
            : errors.non_field_errors}
        </p>
      )}

      <div className="form-actions">
        <button
          type="button"
          className="secondary-modal-button"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="primary-gradient-button rounded-2xl px-5 py-3 font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Item"}
        </button>
      </div>
    </form>
  );
}

export default CreateItemForm;