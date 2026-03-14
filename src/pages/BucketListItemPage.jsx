import { useParams, useNavigate } from "react-router-dom";
import { useBucketList } from "../hooks/useBucketList";
import { useVotes } from "../hooks/useVotes";
import RelativeTime from "../components/UI/RelativeTime";
import VoteControls from "../components/UI/VoteControls";
import FormModal from "../components/UI/FormModal";
import { useState } from "react";

const COLORS = {
    primary: "#6B4EAA",
    accent: "#FF5A5F",
    border: "#A78BFA",
    bodyText: "#0F172A",
    mutedText: "#6B6880",
    surface: "#EEEAF7",
    ctaText: "#FFFFFF",
    background: "#F7F6FB",
    white: "#FFFFFF",
};

const TAG_COLORS = {
    travel:    { bg: "#EDE9F7", text: "#6B4EAA", dot: "#6B4EAA" },
    food:      { bg: "#FFF0F0", text: "#FF5A5F", dot: "#FF5A5F" },
    adventure: { bg: "#EDE9F7", text: "#7C3AED", dot: "#7C3AED" },
    wellness:  { bg: "#F0FDF4", text: "#16A34A", dot: "#16A34A" },
    social:    { bg: "#FFF0F0", text: "#FF5A5F", dot: "#FF5A5F" },
    learning:  { bg: "#EDE9F7", text: "#6B4EAA", dot: "#6B4EAA" },
    creative:  { bg: "#EDE9F7", text: "#A78BFA", dot: "#A78BFA" },
    other:     { bg: "#EEEAF7", text: "#6B6880", dot: "#6B6880" },
};

function formatDate(iso) {
    if (!iso) return null;
    return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

function generateICS(item, dateStr, timeStr = null) {
    const description = [
        item.description,
        `Status: ${item.status}`,
    ].filter(Boolean).join("\\n");

    let dtStart, dtEnd;

    if (timeStr) {
        const start = new Date(`${dateStr}T${timeStr}`);
        const end = new Date(start.getTime() + 60 * 60 * 1000);

        const fmt = (d) =>
            `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}00`;

        dtStart = `DTSTART:${fmt(start)}`;
        dtEnd = `DTEND:${fmt(end)}`;
    } else {
        const dateFormatted = dateStr.replace(/-/g, "");
        const nextDay = new Date(dateStr);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayFormatted = nextDay.toISOString().slice(0, 10).replace(/-/g, "");
        dtStart = `DTSTART;VALUE=DATE:${dateFormatted}`;
        dtEnd = `DTEND;VALUE=DATE:${nextDayFormatted}`;
    }

    const ics = [
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

    return ics;
}

function downloadICS(item, dateStr, timeStr = null) {
    const ics = generateICS(item, dateStr, timeStr);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.title.replace(/\s+/g, "-").toLowerCase()}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

const CheckIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
    </svg>
);
const CalendarIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
);
const TagIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
);
const UserIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
);
const ArrowLeftIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"/>
    </svg>
);

function CalendarExportModal({ item, isOpen, onClose }) {
    const today = new Date().toISOString().slice(0, 10);
    const [selectedDate, setSelectedDate] = useState(today);
    const [selectedTime, setSelectedTime] = useState("");

    const handleDownload = () => {
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
                    <label className="form-label">Date</label>
                    <input
                        type="date"
                        className="form-input"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>

                <div className="form-field">
                    <label className="form-label">Time</label>
                    <input
                        type="time"
                        className="form-input"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={onClose}
                        className="secondary-modal-button"
                    >
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

export default function BucketListItemPage() {
    const { listId, itemId } = useParams();
    const navigate = useNavigate();
    const { bucketList, isLoading, bucketListError, loadBucketList } = useBucketList(Number(listId));
    const { voteOnItem, clearVote } = useVotes();

    const [isVotingItemId, setIsVotingItemId] = useState(null);
    const [voteOverrides, setVoteOverrides] = useState({});
    const [showCalendarModal, setShowCalendarModal] = useState(false);

    if (isLoading) return (
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.mutedText, fontFamily: "'Inter', sans-serif" }}>
            Loading item...
        </div>
    );

    if (bucketListError) return (
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}>
            {bucketListError}
        </div>
    );

    if (!bucketList) return (
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}>
            Bucket list not found
        </div>
    );

    const item = bucketList.items.find((i) => i.id === Number(itemId));

    if (!item) return (
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}>
            Item not found
        </div>
    );

    const getBaseVoteScore = (i) => i.vote_score ?? i.votes_count ?? i.score ?? 0;
    const getBaseUserVote = (i) => i.user_vote ?? i.current_user_vote ?? null;

    const getEffectiveVoteState = (i) => {
        const override = voteOverrides[i.id];
        return {
            voteScore: override?.voteScore ?? getBaseVoteScore(i),
            userVote: override?.userVote ?? getBaseUserVote(i),
        };
    };

    const applyVoteOverride = (i, nextVote) => {
        const current = getEffectiveVoteState(i);
        let nextScore = current.voteScore;
        if (current.userVote === "upvote") nextScore -= 1;
        if (current.userVote === "downvote") nextScore += 1;
        if (nextVote === "upvote") nextScore += 1;
        if (nextVote === "downvote") nextScore -= 1;
        setVoteOverrides((prev) => ({
            ...prev,
            [i.id]: { voteScore: nextScore, userVote: nextVote },
        }));
    };

    const handleVote = async (i, nextVote) => {
        const previousState = getEffectiveVoteState(i);
        try {
            setIsVotingItemId(i.id);
            if (previousState.userVote === nextVote) {
                applyVoteOverride(i, null);
                await clearVote(i.id);
                await loadBucketList();
                return;
            }
            applyVoteOverride(i, nextVote);
            await voteOnItem(i.id, nextVote);
            await loadBucketList();
        } catch (error) {
            setVoteOverrides((prev) => ({
                ...prev,
                [i.id]: { voteScore: previousState.voteScore, userVote: previousState.userVote },
            }));
            console.error("Vote failed:", error);
        } finally {
            setIsVotingItemId(null);
        }
    };

    const { voteScore, userVote } = getEffectiveVoteState(item);
    const tag = TAG_COLORS[item.tag] || TAG_COLORS.other;

    return (
        <>
            <div style={{ minHeight: "100vh", background: COLORS.background, fontFamily: "'Inter', sans-serif", color: COLORS.bodyText }}>
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
                    * { box-sizing: border-box; }
                `}</style>

                <div style={{ maxWidth: "780px", margin: "0 auto", padding: "48px 24px" }}>

                    {/* Breadcrumb */}
                    <div style={{ color: COLORS.mutedText, fontSize: "13px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Inter', sans-serif" }}>
                        <span
                            onClick={() => navigate(`/bucketlists/${listId}`)}
                            style={{ cursor: "pointer", color: COLORS.primary, fontWeight: "500", display: "flex", alignItems: "center", gap: "4px" }}
                        >
                            <ArrowLeftIcon /> {bucketList.title}
                        </span>
                        <span style={{ color: COLORS.border }}>›</span>
                        <span>{item.title}</span>
                    </div>

                    {/* Item card */}
                    <div style={{
                        background: COLORS.white,
                        border: `1px solid #E2DAF5`,
                        borderRadius: "16px",
                        padding: "32px",
                        boxShadow: "0 1px 4px rgba(107,78,170,0.05)",
                    }}>
                        {/* Title row with vote controls */}
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "20px" }}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", flex: 1, minWidth: 0 }}>
                                <div style={{
                                    width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0, marginTop: "3px",
                                    background: item.is_completed ? COLORS.primary : "transparent",
                                    border: `2px solid ${item.is_completed ? COLORS.primary : COLORS.border}`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: COLORS.ctaText
                                }}>
                                    {item.is_completed && <CheckIcon />}
                                </div>

                                <h1 style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontSize: "clamp(22px, 4vw, 32px)",
                                    fontWeight: "700", margin: 0,
                                    color: item.is_completed ? COLORS.mutedText : COLORS.bodyText,
                                    lineHeight: "1.2", letterSpacing: "-0.02em",
                                    textDecoration: item.is_completed ? "line-through" : "none"
                                }}>
                                    {item.title}
                                </h1>
                            </div>

                            <VoteControls
                                itemTitle={item.title}
                                score={voteScore}
                                activeVote={userVote}
                                isVoting={isVotingItemId === item.id}
                                onUpvote={() => handleVote(item, "upvote")}
                                onDownvote={() => handleVote(item, "downvote")}
                                variant="panel"
                            />
                        </div>

                        {/* Description */}
                        {item.description && (
                            <p style={{
                                color: COLORS.mutedText, fontSize: "15px",
                                lineHeight: "1.7", margin: "0 0 24px",
                                paddingLeft: "36px"
                            }}>
                                {item.description}
                            </p>
                        )}

                        {/* Divider */}
                        <div style={{ height: "1px", background: "#E2DAF5", margin: "24px 0" }} />

                        {/* Meta row */}
                        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                            {item.tag && (
                                <span style={{
                                    display: "inline-flex", alignItems: "center", gap: "5px",
                                    background: tag.bg, color: tag.text,
                                    fontSize: "11.5px", fontWeight: "600",
                                    padding: "3px 10px", borderRadius: "20px",
                                }}>
                                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: tag.dot }} />
                                    <TagIcon />
                                    {item.tag}
                                </span>
                            )}

                            <span style={{ display: "flex", alignItems: "center", gap: "4px", color: COLORS.mutedText, fontSize: "12px" }}>
                                <CalendarIcon />
                                <RelativeTime timestamp={item.updated_at} />
                            </span>

                            {item.created_by?.username && (
                                <span style={{ display: "flex", alignItems: "center", gap: "4px", color: COLORS.mutedText, fontSize: "12px" }}>
                                    <UserIcon /> {item.created_by.username}
                                </span>
                            )}

                            {item.is_completed && item.completed_at && (
                                <span style={{
                                    display: "flex", alignItems: "center", gap: "5px",
                                    color: "#16A34A", fontSize: "11.5px", fontWeight: "600",
                                    background: "#F0FDF4", padding: "3px 10px", borderRadius: "20px",
                                }}>
                                    <CheckIcon /> Completed {formatDate(item.completed_at)}
                                </span>
                            )}

                            {/* Calendar export button */}
                            <button
                                type="button"
                                onClick={() => setShowCalendarModal(true)}
                                title="Add to calendar"
                                style={{
                                    marginLeft: "auto",
                                    display: "inline-flex", alignItems: "center", gap: "5px",
                                    background: COLORS.surface, color: COLORS.primary,
                                    border: `1px solid ${COLORS.border}`,
                                    fontSize: "11.5px", fontWeight: "600",
                                    padding: "3px 10px", borderRadius: "20px",
                                    cursor: "pointer", transition: "all 0.15s ease",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "#DDD4F5"}
                                onMouseLeave={e => e.currentTarget.style.background = COLORS.surface}
                            >
                                <CalendarIcon /> Add to calendar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <CalendarExportModal
                item={item}
                isOpen={showCalendarModal}
                onClose={() => setShowCalendarModal(false)}
            />
        </>
    );
}