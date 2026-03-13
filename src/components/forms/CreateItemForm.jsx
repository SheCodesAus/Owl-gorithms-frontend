import { useState } from "react";
import { useItems } from "../../hooks/useItems";

function CreateItemForm({ bucketListId, onSuccess, onClose }) {
  const { addItem } = useItems(bucketListId);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const newItem = await addItem(formData);
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
          placeholder="Hot air balloon ride"
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
          placeholder="Why this belongs on the list..."
          rows={4}
        />
        {renderFieldError("description")}
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
