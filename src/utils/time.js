export function getRelativeTime(updatedAt) {
    if (!updatedAt) return null;

    const updated = new Date(updatedAt);
    const now = new Date();

    const diffSeconds = Math.floor((now - updated) / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (diffSeconds < 60) return "just now";
    if (diffMinutes < 60) return rtf.format(-diffMinutes, "minute");
    if (diffHours < 24) return rtf.format(-diffHours, "hour");

    return rtf.format(-diffDays, "day");
}