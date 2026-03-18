import { useState, useEffect } from "react";
import FormModal from "../UI/FormModal";

function buildGoogleCalendarUrl(item, startDate, endDate, startTime, endTime) {
    const pad = (n) => String(n).padStart(2, "0");

    let dates;

    if (startTime && endTime) {
        // Timed event — format: YYYYMMDDTHHmmssZ
        const startDT = new Date(`${startDate}T${startTime}`);
        const effectiveEndDate = endDate || startDate;
        const endDT = new Date(`${effectiveEndDate}T${endTime}`);

        const fmtDT = (d) =>
            `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

        dates = `${fmtDT(startDT)}/${fmtDT(endDT)}`;
    } else {
        // All-day event — format: YYYYMMDD/YYYYMMDD
        const startFormatted = startDate.replace(/-/g, "");
        const effectiveEndDate = endDate || startDate;
        const nextDay = new Date(effectiveEndDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const endFormatted = nextDay.toISOString().slice(0, 10).replace(/-/g, "");

        dates = `${startFormatted}/${endFormatted}`;
    }

    const params = new URLSearchParams({
        action: "TEMPLATE",
        text: item.title,
        dates,
        details: [item.description, `Status: ${item.status}`].filter(Boolean).join("\n"),
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function CalendarExportModal({ item, isOpen, onClose }) {
    const today = new Date().toISOString().slice(0, 10);

    const [startDate, setStartDate] = useState(item?.start_date ?? today);
    const [endDate, setEndDate] = useState(item?.end_date ?? "");
    const [startTime, setStartTime] = useState(item?.start_time ?? "");
    const [endTime, setEndTime] = useState(item?.end_time ?? "");

    useEffect(() => {
        setStartDate(item?.start_date ?? today);
        setEndDate(item?.end_date ?? "");
        setStartTime(item?.start_time ?? "");
        setEndTime(item?.end_time ?? "");
    }, [item]);

    const handleAddToCalendar = () => {
        if (!item || !startDate) return;
        const url = buildGoogleCalendarUrl(
            item,
            startDate,
            endDate || null,
            startTime || null,
            endTime || null,
        );
        window.open(url, "_blank", "noopener,noreferrer");
        onClose();
    };

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title="Add to calendar"
            subtitle={`Add "${item?.title}" to Google Calendar.`}
            maxWidth="max-w-md"
        >
            <div className="form-stack">

                {/* Date row */}
                <div style={{ display: "flex", gap: "12px" }}>
                    <div className="form-field" style={{ flex: 1 }}>
                        <label className="form-label" htmlFor="cal-start-date">FROM</label>
                        <input
                            id="cal-start-date"
                            type="date"
                            className="form-input"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-field" style={{ flex: 1 }}>
                        <label className="form-label" htmlFor="cal-end-date">
                            TO <span style={{ fontWeight: 400, fontSize: "0.8rem", color: "var(--muted-text)" }}>(optional)</span>
                        </label>
                        <input
                            id="cal-end-date"
                            type="date"
                            className="form-input"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate || undefined}
                        />
                    </div>
                </div>

                {/* Time row */}
                <div style={{ display: "flex", gap: "12px" }}>
                    <div className="form-field" style={{ flex: 1 }}>
                        <label className="form-label" htmlFor="cal-start-time">
                            START TIME <span style={{ fontWeight: 400, fontSize: "0.8rem", color: "var(--muted-text)" }}>(optional)</span>
                        </label>
                        <input
                            id="cal-start-time"
                            type="time"
                            className="form-input"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </div>

                    <div className="form-field" style={{ flex: 1 }}>
                        <label className="form-label" htmlFor="cal-end-time">
                            END TIME <span style={{ fontWeight: 400, fontSize: "0.8rem", color: "var(--muted-text)" }}>(optional)</span>
                        </label>
                        <input
                            id="cal-end-time"
                            type="time"
                            className="form-input"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onClose} className="secondary-modal-button">
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleAddToCalendar}
                        className="primary-gradient-button rounded-2xl px-5 py-3 text-sm font-semibold"
                    >
                        Add to calendar
                    </button>
                </div>
            </div>
        </FormModal>
    );
}