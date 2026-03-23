import { Calendar, ExternalLink, Download, X } from "lucide-react";
import FormModal from "../UI/FormModal";

function buildGoogleCalendarUrl(item) {
  const pad = (n) => String(n).padStart(2, "0");

  let dates;
  if (item.start_date) {
    if (item.start_time && item.end_time) {
      const fmtDT = (dateStr, timeStr) => {
        const d = new Date(`${dateStr}T${timeStr}`);
        return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
      };
      const endDate = item.end_date || item.start_date;
      dates = `${fmtDT(item.start_date, item.start_time)}/${fmtDT(endDate, item.end_time)}`;
    } else {
      const startFormatted = item.start_date.replace(/-/g, "");
      const endDate = item.end_date || item.start_date;
      const nextDay = new Date(endDate);
      nextDay.setDate(nextDay.getDate() + 1);
      const endFormatted = nextDay.toISOString().slice(0, 10).replace(/-/g, "");
      dates = `${startFormatted}/${endFormatted}`;
    }
  } else {
    // No date set — use today as placeholder
    const today = new Date();
    const fmt = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    dates = `${fmt(today)}/${fmt(tomorrow)}`;
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: item.title,
    dates,
    details: [item.description, `Status: ${item.status}`].filter(Boolean).join("\n"),
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildIcsContent(item) {
  const pad = (n) => String(n).padStart(2, "0");
  const now = new Date();
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}T${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}Z`;

  let dtStart, dtEnd;

  if (item.start_date) {
    if (item.start_time) {
      const fmtDT = (dateStr, timeStr) => {
        const d = new Date(`${dateStr}T${timeStr}`);
        return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
      };
      dtStart = `DTSTART:${fmtDT(item.start_date, item.start_time)}`;
      const endDate = item.end_date || item.start_date;
      const endTime = item.end_time || item.start_time;
      dtEnd = `DTEND:${fmtDT(endDate, endTime)}`;
    } else {
      dtStart = `DTSTART;VALUE=DATE:${item.start_date.replace(/-/g, "")}`;
      const endDate = item.end_date || item.start_date;
      const nextDay = new Date(endDate);
      nextDay.setDate(nextDay.getDate() + 1);
      dtEnd = `DTEND;VALUE=DATE:${nextDay.toISOString().slice(0, 10).replace(/-/g, "")}`;
    }
  } else {
    const today = new Date();
    const fmt = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    dtStart = `DTSTART;VALUE=DATE:${fmt(today)}`;
    dtEnd = `DTEND;VALUE=DATE:${fmt(tomorrow)}`;
  }

  const description = [item.description, `Status: ${item.status}`]
    .filter(Boolean)
    .join("\\n")
    .replace(/,/g, "\\,");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//KickIt//EN",
    "BEGIN:VEVENT",
    `UID:${item.id}-${stamp}@kickit`,
    `DTSTAMP:${stamp}`,
    dtStart,
    dtEnd,
    `SUMMARY:${item.title}`,
    description ? `DESCRIPTION:${description}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");
}

export default function CalendarExportModal({ item, isOpen, onClose }) {
  if (!item) return null;

  const handleGoogleCalendar = () => {
    const url = buildGoogleCalendarUrl(item);
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  };

  const handleDownloadIcs = () => {
    const content = buildIcsContent(item);
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add to calendar"
      subtitle={`Where do you want to add "${item.title}"?`}
    >
      <div className="flex flex-col gap-3">

        {/* Google Calendar */}
        <button
          type="button"
          onClick={handleGoogleCalendar}
          className="flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-black/8 bg-white p-4 text-left transition hover:border-[var(--primary-cta)] hover:bg-[var(--surface-soft)] focus:outline-none"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#4285F4,#34A853)]">
            <ExternalLink size={18} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-[var(--heading-text)]">Google Calendar</p>
            <p className="text-sm text-[var(--muted-text)]">Opens in a new tab</p>
          </div>
        </button>

        {/* Apple / Outlook / other */}
        <button
          type="button"
          onClick={handleDownloadIcs}
          className="flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-black/8 bg-white p-4 text-left transition hover:border-[var(--primary-cta)] hover:bg-[var(--surface-soft)] focus:outline-none"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#6B4EAA,#C76BBA)]">
            <Download size={18} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-[var(--heading-text)]">Apple / Outlook</p>
            <p className="text-sm text-[var(--muted-text)]">Downloads a .ics file</p>
          </div>
        </button>

        {/* Cancel */}
        <button
          type="button"
          onClick={onClose}
          className="secondary-modal-button w-full"
        >
          Cancel
        </button>

      </div>
    </FormModal>
  );
}