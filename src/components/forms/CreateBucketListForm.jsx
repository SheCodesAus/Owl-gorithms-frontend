import { useState } from "react";
import { useBucketLists } from "../../hooks/useBucketLists";

function CreateBucketListForm({ user, onSuccess, onClose }) {
  const { addBucketList } = useBucketLists();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    decision_deadline: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    is_public: false,
    allow_viewer_voting: false,
  });

  const [hasDeadline, setHasDeadline] = useState(false);
  const [hasDate, setHasDate] = useState(false);
  const [hasTime, setHasTime] = useState(false);

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

  const formatDateTimeForBackend = (value) => {
    if (!value) return null;
    return value.replace("T", " ") + ":00";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    const payload = {
      title: formData.title,
      description: formData.description,
      is_public: formData.is_public,
      allow_viewer_voting: formData.allow_viewer_voting,
      decision_deadline_input: hasDeadline
        ? formData.decision_deadline || null
        : null,
      start_date: hasDate ? formData.start_date || null : null,
      end_date: hasDate ? formData.end_date || null : null,
      start_time: hasTime ? formData.start_time || null : null,
      end_time: hasTime ? formData.end_time || null : null,
    };

    try {
      const newBucketList = await addBucketList(payload);
      onSuccess(newBucketList);
    } catch (error) {
      setErrors(error);
    }
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
          placeholder="Euro summer chaos"
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
          placeholder="What’s the vision? Dream big, add context, set the vibe..."
          rows={4}
        />
        {renderFieldError("description")}
      </div>

      <div className="rounded-[1.4rem] border border-black/10 bg-[var(--surface-soft)]/70 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            id="is_public"
            name="is_public"
            type="checkbox"
            checked={formData.is_public}
            onChange={handleChange}
            className="mt-1 h-4 w-4 rounded border-black/20 text-[var(--primary-cta)] focus:ring-[var(--primary-cta)]"
          />
          <div>
            <p className="text-sm font-semibold text-[var(--heading-text)]">
              Make list public
            </p>
            <p className="text-sm text-[var(--muted-text)]">
              Let the world in, or keep it for your inner circle only.
            </p>
          </div>
        </label>
        {renderFieldError("is_public")}
      </div>

      <div className="rounded-[1.4rem] border border-black/10 bg-[var(--surface-soft)]/70 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            id="allow_viewer_voting"
            name="allow_viewer_voting"
            type="checkbox"
            checked={formData.allow_viewer_voting}
            onChange={handleChange}
            className="mt-1 h-4 w-4 rounded border-black/20 text-[var(--primary-cta)] focus:ring-[var(--primary-cta)]"
          />
          <div>
            <p className="text-sm font-semibold text-[var(--heading-text)]">
              Let viewers vote
            </p>
            <p className="text-sm text-[var(--muted-text)]">
              Don’t just let them watch the chaos. Let them influence it.
            </p>
          </div>
        </label>
        {renderFieldError("allow_viewer_voting")}
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
                Add decision deadline
              </p>
              <p className="text-sm text-[var(--muted-text)]">
                This is the cutoff for adding new ideas and casting votes. After
                the deadline hits, both freeze. No last-minute plot twists.
              </p>
            </div>
          </label>

          {hasDeadline ? (
            <div className="mt-4">
              <div className="form-field">
                <label htmlFor="decision_deadline" className="form-label">
                  DEADLINE
                </label>
                <input
                  id="decision_deadline"
                  type="date"
                  name="decision_deadline"
                  value={formData.decision_deadline}
                  onChange={handleChange}
                  className="form-input cursor-pointer"
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
                Add event date
              </p>
              <p className="text-sm text-[var(--muted-text)]">
                Use this when the whole list revolves around a real planned
                event, trip, weekend, or occasion.
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
                  className="form-input"
                  value={formData.start_date}
                  onChange={handleChange}
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
                Add event time
              </p>
              <p className="text-sm text-[var(--muted-text)]">
                Perfect for lists built around a booking, meetup, dinner,
                concert, or anything with a clock attached.
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
                  className="form-input"
                  value={formData.start_time}
                  onChange={handleChange}
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
          className="secondary-modal-button"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-2xl primary-gradient-button px-5 py-3 font-semibold"
        >
          Let’s build it
        </button>
      </div>
    </form>
  );
}

export default CreateBucketListForm;