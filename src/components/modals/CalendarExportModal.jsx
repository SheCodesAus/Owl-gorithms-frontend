import { useState } from "react";
import FormModal from "../UI/FormModal";

function generateICS(item, dateStr, timeStr = null) {
  const description = [item.description, `Status: ${item.status}`]
    .filter(Boolean)
    .join("\\n");

  let dtStart;
  let dtEnd;

  if (timeStr) {
    const start = new Date(`${dateStr}T${timeStr}`);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const formatDateTime = (date) =>
      `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
        date.getDate()
      ).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}${String(
        date.getMinutes()
      ).padStart(2, "0")}00`;

    dtStart = `DTSTART:${formatDateTime(start)}`;
    dtEnd = `DTEND:${formatDateTime(end)}`;
  } else {
    const dateFormatted = dateStr.replace(/-/g, "");
    const nextDay = new Date(dateStr);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayFormatted = nextDay.toISOString().slice(0, 10).replace(/-/g, "");

    dtStart = `DTSTART;VALUE=DATE:${dateFormatted}`;
    dtEnd = `DTEND;VALUE=DATE:${nextDayFormatted}`;
  }

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BucketList App//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    dtStart,
    dtEnd,
    `SUMMARY:${item.title}`,
    `DESCRIPTION:${description}`,
    "STATUS:CONFIRMED",
    "TRANSP:TRANSPARENT",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadICS(item, dateStr, timeStr = null) {
  const ics = generateICS(item, dateStr, timeStr);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${item.title.replace(/\s+/g, "-").toLowerCase()}.ics`;

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export default function CalendarExportModal({ item, isOpen, onClose }) {
  const today = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState("");

  const handleDownload = () => {
    if (!item) return;
    downloadICS(item, selectedDate, selectedTime || null);
    onClose();
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add to calendar"
      subtitle={`Add "${item?.title}" to your calendar.`}
      maxWidth="max-w-sm"
    >
      <div className="form-stack">
        <div className="form-field">
          <label className="form-label" htmlFor="calendar-date">
            Date
          </label>
          <input
            id="calendar-date"
            type="date"
            className="form-input"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="calendar-time">
            Time
          </label>
          <input
            id="calendar-time"
            type="time"
            className="form-input"
            value={selectedTime}
            onChange={(event) => setSelectedTime(event.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose} className="secondary-modal-button">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="primary-gradient-button rounded-2xl px-5 py-3 text-sm font-semibold"
          >
            Download .ics
          </button>
        </div>
      </div>
    </FormModal>
  );
}