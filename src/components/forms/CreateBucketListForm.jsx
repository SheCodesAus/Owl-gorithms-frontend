import { useState } from "react";
import { useBucketLists } from "../../hooks/useBucketLists";

function CreateBucketListForm({ user, onSuccess, onClose }) {
  const { addBucketList } = useBucketLists();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    decision_deadline: "",
    has_deadline: false,
    is_public: false,
    allow_viewer_voting: false,
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const formatDeadlineForBackend = (value) => {
    if (!value) return null;
    return value.replace("T", " ") + ":00";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    const payload = {
      ...formData,
      decision_deadline: formData.has_deadline
        ? formatDeadlineForBackend(formData.decision_deadline)
        : null,
    };

    try {
      const newBucketList = await addBucketList(payload);
      onSuccess(newBucketList);
    } catch (error) {
      setErrors(error);
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
          placeholder="Trip to Europe"
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
          placeholder="It's a big place. What will we do?"
        />
        {renderFieldError("description")}
      </div>

      <div className="form-field">
        <span className="form-label">MAKE PUBLIC</span>

        <label className="glass-chip-light flex items-center justify-between rounded-2xl px-4 py-3">
          <div>
            <p className="font-semibold text-[var(--heading-text)]">
              Make this list public
            </p>
            <p className="mt-1 text-sm text-[var(--muted-text)]">
              Solo or squad - your call 🚀
            </p>
          </div>

          <input
            id="is_public"
            name="is_public"
            type="checkbox"
            checked={formData.is_public}
            onChange={handleChange}
            className="h-5 w-5 cursor-pointer accent-[var(--primary-cta)]"
          />
        </label>
        {renderFieldError("is_public")}
      </div>

      <div className="form-field">
        <span className="form-label">VOTING</span>

        <label className="glass-chip-light flex items-center justify-between rounded-2xl px-4 py-3">
          <div>
            <p className="font-semibold text-[var(--heading-text)]">
              Allow viewers to vote
            </p>
            <p className="mt-1 text-sm text-[var(--muted-text)]">
              Want viewers to do more than stare? Let them cast votes 👍
            </p>
          </div>

          <input
            id="allow_viewer_voting"
            name="allow_viewer_voting"
            type="checkbox"
            checked={formData.allow_viewer_voting}
            onChange={handleChange}
            className="h-5 w-5 cursor-pointer accent-[var(--primary-cta)]"
          />
        </label>
        {renderFieldError("allow_viewer_voting")}
      </div>

      <div className="form-field">
        <span className="form-label">DEADLINE</span>

        <label className="glass-chip-light flex items-center justify-between rounded-2xl px-4 py-3">
          <div>
            <p className="font-semibold text-[var(--heading-text)]">
              Add deadline
            </p>
            <p className="mt-1 text-sm text-[var(--muted-text)]">
              Collect ideas and votes from friends.<br>
              </br>
              When the deadline ends, the
              top activities are frozen 🥶
            </p>
          </div>

          <input
            id="has_deadline"
            name="has_deadline"
            type="checkbox"
            checked={formData.has_deadline}
            onChange={handleChange}
            className="h-5 w-5 cursor-pointer accent-[var(--primary-cta)]"
          />
        </label>
        {renderFieldError("decision_deadline")}
      </div>

      {formData.has_deadline && (
        <div className="form-field">
          <label htmlFor="decision_deadline" className="form-label">
            DEADLINE DATE
          </label>
          <input
            id="decision_deadline"
            type="datetime-local"
            name="decision_deadline"
            value={formData.decision_deadline}
            onChange={handleChange}
            className="form-input cursor-pointer"
          />
          {renderFieldError("decision_deadline")}
        </div>
      )}

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
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-2xl cursor-pointer px-5 py-3 font-semibold bg-[linear-gradient(135deg,#15803d_0%,#4ade80_100%)] text-white shadow-[0_14px_36px_rgba(8,38,20,0.35)] transition hover:scale-105 hover:shadow-[0_18px_46px_rgba(8,38,20,0.45)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-300/70"
        >
          SEND IT
        </button>
      </div>
    </form>
  );
}

export default CreateBucketListForm;