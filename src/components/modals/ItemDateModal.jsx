import { useState, useEffect } from "react";
import FormModal from "../UI/FormModal";

function ItemDateModal({ item, isOpen, onSave, onClose, isSaving, errors }) {
    const [formData, setFormData] = useState({
        start_date: "",
        end_date: "",
        start_time: "",
        end_time: "",
    });

    useEffect(() => {
        if (!item) return;
        setFormData({
            start_date: item.start_date ?? "",
            end_date: item.end_date ?? "",
            start_time: item.start_time ?? "",
            end_time: item.end_time ?? "",
        });
    }, [item, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            start_date: formData.start_date || null,
            end_date: formData.end_date || null,
            start_time: formData.start_time || null,
            end_time: formData.end_time || null,
        });
    };

    const hasDate = !!item?.start_date;

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={hasDate ? "Edit date" : "Add a date"}
            subtitle="Set a date and time!"
            maxWidth="max-w-md"
        >
            <form className="form-stack" onSubmit={handleSubmit}>

                {/* Date row */}
                <div style={{ display: "flex", gap: "12px" }}>
                    <div className="form-field" style={{ flex: 1 }}>
                        <label className="form-label" htmlFor="start_date">FROM</label>
                        <input
                            id="start_date"
                            name="start_date"
                            type="date"
                            className="form-input"
                            value={formData.start_date}
                            onChange={handleChange}
                            required
                        />
                        {errors?.start_date && (
                            <p className="form-error-text">{errors.start_date}</p>
                        )}
                    </div>

                    <div className="form-field" style={{ flex: 1 }}>
                        <label className="form-label" htmlFor="end_date">
                            TO <span style={{ fontWeight: 400, fontSize: "0.8rem", color: "var(--muted-text)" }}>(optional)</span>
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
                        {errors?.end_date && (
                            <p className="form-error-text">{errors.end_date}</p>
                        )}
                    </div>
                </div>

                {/* Time row */}
                <div style={{ display: "flex", gap: "12px" }}>
                    <div className="form-field" style={{ flex: 1 }}>
                        <label className="form-label" htmlFor="start_time">
                            START TIME <span style={{ fontWeight: 400, fontSize: "0.8rem", color: "var(--muted-text)" }}>(optional)</span>
                        </label>
                        <input
                            id="start_time"
                            name="start_time"
                            type="time"
                            className="form-input"
                            value={formData.start_time}
                            onChange={handleChange}
                        />
                        {errors?.start_time && (
                            <p className="form-error-text">{errors.start_time}</p>
                        )}
                    </div>

                    <div className="form-field" style={{ flex: 1 }}>
                        <label className="form-label" htmlFor="end_time">
                            END TIME <span style={{ fontWeight: 400, fontSize: "0.8rem", color: "var(--muted-text)" }}>(optional)</span>
                        </label>
                        <input
                            id="end_time"
                            name="end_time"
                            type="time"
                            className="form-input"
                            value={formData.end_time}
                            onChange={handleChange}
                        />
                        {errors?.end_time && (
                            <p className="form-error-text">{errors.end_time}</p>
                        )}
                    </div>
                </div>

                {errors?.non_field_errors && (
                    <p className="form-error-text text-center">{errors.non_field_errors}</p>
                )}

                <div className="form-actions">
                    <button type="button" onClick={onClose} className="secondary-modal-button">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="primary-gradient-button rounded-2xl px-5 py-3 text-sm font-semibold"
                    >
                        {isSaving ? "Saving..." : hasDate ? "Update date" : "Save date"}
                    </button>
                </div>
            </form>
        </FormModal>
    );
}

export default ItemDateModal;