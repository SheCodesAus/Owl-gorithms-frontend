import { useParams, useNavigate } from "react-router-dom";
import { useBucketList } from "../hooks/useBucketList";
import { useVotes } from "../hooks/useVotes";
import { useAuth } from "../hooks/use-auth";
import { updateItem, deleteItem } from "../api/items";
import RelativeTime from "../components/UI/RelativeTime";
import VoteControls from "../components/UI/VoteControls";
import FormModal from "../components/UI/FormModal";
import ExtendedItemCard from "./ExtendedItemCard";
import { useState } from "react";

// ─── Colours ──────────────────────────────────────────────────────────────────
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

const STATUS_STYLES = {
    proposed:  { bg: "#EEF6FF", text: "#2563EB", dot: "#2563EB", label: "Proposed" },
    locked_in: { bg: "#EDE9F7", text: "#6B4EAA", dot: "#6B4EAA", label: "Locked In" },
    complete:  { bg: "#F0FDF4", text: "#16A34A", dot: "#16A34A", label: "Complete" },
    cancelled: { bg: "#FFF0F0", text: "#FF5A5F", dot: "#FF5A5F", label: "Cancelled" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso) {
    if (!iso) return null;
    return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

function generateICS(item, dateStr, timeStr = null) {
    const description = [item.description, `Status: ${item.status}`].filter(Boolean).join("\\n");
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
    return [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//BucketList App//EN",
        "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT",
        dtStart, dtEnd, `SUMMARY:${item.title}`, `DESCRIPTION:${description}`,
        "STATUS:CONFIRMED", "TRANSP:TRANSPARENT", "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
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

// ─── Icons ────────────────────────────────────────────────────────────────────
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
const EditIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
);
const TrashIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
        <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>
);
const ArrowLeftIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"/>
    </svg>
);
const StatusIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatusBadge({ status }) {
    const style = STATUS_STYLES[status] || STATUS_STYLES.proposed;
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            background: style.bg, color: style.text,
            fontSize: "11.5px", fontWeight: "600",
            padding: "3px 10px", borderRadius: "20px",
        }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: style.dot }} />
            {style.label}
        </span>
    );
}

function PillButton({ onClick, color = COLORS.primary, bg = COLORS.surface, border = COLORS.border, hoverBg = "#DDD4F5", children }) {
    const [hovering, setHovering] = useState(false);
    return (
        <button
            type="button"
            onClick={onClick}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            style={{
                display: "inline-flex", alignItems: "center", gap: "5px",
                background: hovering ? hoverBg : bg,
                color, border: `1px solid ${border}`,
                fontSize: "11.5px", fontWeight: "600",
                padding: "5px 12px", borderRadius: "20px",
                cursor: "pointer", transition: "background 0.15s ease",
            }}
        >
            {children}
        </button>
    );
}

// ─── Modals ───────────────────────────────────────────────────────────────────
function CalendarExportModal({ item, isOpen, onClose }) {
    const today = new Date().toISOString().slice(0, 10);
    const [selectedDate, setSelectedDate] = useState(today);
    const [selectedTime, setSelectedTime] = useState("");

    const handleDownload = () => {
        downloadICS(item, selectedDate, selectedTime || null);
        onClose();
    };

    return (
        <FormModal isOpen={isOpen} onClose={onClose} title="Add to calendar" subtitle={`Add "${item?.title}" to your calendar.`} maxWidth="max-w-sm">
            <div className="form-stack">
                <div className="form-field">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-input" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                </div>
                <div className="form-field">
                    <label className="form-label">Time</label>
                    <input type="time" className="form-input" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />
                </div>
                <div className="form-actions">
                    <button type="button" onClick={onClose} className="secondary-modal-button">Cancel</button>
                    <button type="button" onClick={handleDownload} className="primary-gradient-button rounded-2xl px-5 py-3 text-sm font-semibold">Download .ics</button>
                </div>
            </div>
        </FormModal>
    );
}

function DeleteWarningModal({ item, isOpen, onConfirm, onClose, isDeleting }) {
    return (
        <FormModal isOpen={isOpen} onClose={onClose} title="Delete item" subtitle="This action cannot be undone." maxWidth="max-w-sm">
            <div className="form-stack">
                <div style={{ background: "#FFF0F0", border: "1px solid #FFCDD2", borderRadius: "12px", padding: "16px", color: COLORS.accent, fontSize: "14px", lineHeight: "1.6" }}>
                    <strong style={{ color: COLORS.bodyText }}>"{item?.title}"</strong> will be permanently deleted.
                </div>
                <div className="form-actions">
                    <button type="button" onClick={onClose} className="secondary-modal-button">Cancel</button>
                    <button
                        type="button" onClick={onConfirm} disabled={isDeleting}
                        style={{ borderRadius: "1rem", padding: "0.85rem 1.15rem", fontWeight: "700", color: COLORS.ctaText, background: isDeleting ? "#e88" : COLORS.accent, border: "none", cursor: isDeleting ? "not-allowed" : "pointer", transition: "background 0.2s ease" }}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </FormModal>
    );
}

function EditItemModal({ item, isOpen, onSave, onClose, isSaving, errors }) {
    const [formData, setFormData] = useState({ title: item?.title ?? "", description: item?.description ?? "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <FormModal isOpen={isOpen} onClose={onClose} title="Edit item" subtitle="Update the details for this item." maxWidth="max-w-md">
            <form className="form-stack" onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
                <div className="form-field">
                    <label className="form-label">TITLE</label>
                    <input name="title" type="text" className="form-input" value={formData.title} onChange={handleChange} required />
                    {errors?.title && <p className="form-error-text">{errors.title}</p>}
                </div>
                <div className="form-field">
                    <label className="form-label">DESCRIPTION</label>
                    <textarea name="description" className="form-textarea" value={formData.description} onChange={handleChange} rows={4} />
                    {errors?.description && <p className="form-error-text">{errors.description}</p>}
                </div>
                {errors?.non_field_errors && <p className="form-error-text text-center">{errors.non_field_errors}</p>}
                <div className="form-actions">
                    <button type="button" onClick={onClose} className="secondary-modal-button">Cancel</button>
                    <button type="submit" disabled={isSaving} className="primary-gradient-button rounded-2xl px-5 py-3 text-sm font-semibold">
                        {isSaving ? "Saving..." : "Save changes"}
                    </button>
                </div>
            </form>
        </FormModal>
    );
}

function StatusUpdateModal({ item, isOpen, onSave, onClose, isSaving, error }) {
    const [selectedStatus, setSelectedStatus] = useState(item?.status ?? "proposed");

    return (
        <FormModal isOpen={isOpen} onClose={onClose} title="Update status" subtitle="Change the status of this item." maxWidth="max-w-sm">
            <form className="form-stack" onSubmit={(e) => { e.preventDefault(); onSave(selectedStatus); }}>
                <div className="form-field">
                    <label className="form-label">STATUS</label>
                    <select className="form-select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                        <option value="proposed">Proposed</option>
                        <option value="locked_in">Locked In</option>
                        <option value="complete">Complete</option>
                    </select>
                </div>
                {error && <p className="form-error-text text-center">{error}</p>}
                <div className="form-actions">
                    <button type="button" onClick={onClose} className="secondary-modal-button">Cancel</button>
                    <button type="submit" disabled={isSaving} className="primary-gradient-button rounded-2xl px-5 py-3 text-sm font-semibold">
                        {isSaving ? "Saving..." : "Update status"}
                    </button>
                </div>
            </form>
        </FormModal>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BucketListItemPage() {
    const { listId, itemId } = useParams();
    const navigate = useNavigate();
    const { auth } = useAuth();
    const { bucketList, isLoading, bucketListError, loadBucketList } = useBucketList(Number(listId));
    const { voteOnItem, clearVote } = useVotes();

    const [item, setItem] = useState(null);
    const [isVotingItemId, setIsVotingItemId] = useState(null);
    const [voteOverrides, setVoteOverrides] = useState({});
    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSavingStatus, setIsSavingStatus] = useState(false);
    const [editErrors, setEditErrors] = useState({});
    const [statusError, setStatusError] = useState("");

    if (bucketList && !item) {
        const found = bucketList.items.find((i) => i.id === Number(itemId));
        if (found) setItem(found);
    }

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
    if (!item) return (
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}>
            Item not found
        </div>
    );

    const currentUser = auth?.user;
    const isOwner = bucketList?.owner?.id === currentUser?.id;
    const isCreator = item?.created_by?.id === currentUser?.id;
    const canEdit = isOwner || isCreator;
    const tag = item.tag ? (TAG_COLORS[item.tag] || TAG_COLORS.other) : null;

    // ── Vote state ────────────────────────────────────────────────────────────
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
        setVoteOverrides((prev) => ({ ...prev, [i.id]: { voteScore: nextScore, userVote: nextVote } }));
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
            setVoteOverrides((prev) => ({ ...prev, [i.id]: { voteScore: previousState.voteScore, userVote: previousState.userVote } }));
            console.error("Vote failed:", error);
        } finally {
            setIsVotingItemId(null);
        }
    };

    // ── Edit / Delete / Status ────────────────────────────────────────────────
    const handleSave = async (formData) => {
        setIsSaving(true);
        setEditErrors({});
        try {
            const updated = await updateItem(item.id, formData, auth?.access);
            setItem(updated);
            setShowEditModal(false);
        } catch (error) {
            setEditErrors({ non_field_errors: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteItem(item.id, auth?.access);
            navigate(`/bucketlists/${listId}`);
        } catch (error) {
            console.error("Delete failed:", error);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        setIsSavingStatus(true);
        setStatusError("");
        try {
            const updated = await updateItem(item.id, { status: newStatus }, auth?.access);
            setItem(updated);
            setShowStatusModal(false);
        } catch (error) {
            setStatusError(error.message);
        } finally {
            setIsSavingStatus(false);
        }
    };

    const { voteScore, userVote } = getEffectiveVoteState(item);

    return (
        <>
            <div style={{ minHeight: "100vh", background: COLORS.background, fontFamily: "'Inter', sans-serif", color: COLORS.bodyText }}>
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
                    * { box-sizing: border-box; }
                `}</style>

                <div style={{ maxWidth: "780px", margin: "0 auto", padding: "48px 24px" }}>

                    {/* Breadcrumb */}
                    <div style={{ color: COLORS.mutedText, fontSize: "13px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                            onClick={() => navigate(`/bucketlists/${listId}`)}
                            style={{ cursor: "pointer", color: COLORS.primary, fontWeight: "500", display: "flex", alignItems: "center", gap: "4px" }}
                        >
                            <ArrowLeftIcon /> {bucketList.title}
                        </span>
                        <span style={{ color: COLORS.border }}>›</span>
                        <span>{item.title}</span>
                    </div>

                    {/* Main card */}
                    <div style={{
                        background: COLORS.white, border: "1px solid #E2DAF5",
                        borderRadius: "16px", padding: "32px",
                        boxShadow: "0 1px 4px rgba(107,78,170,0.05)",
                        display: "flex", flexDirection: "column", gap: "24px",
                    }}>
                        {/* Title row */}
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                            <h1 style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontSize: "clamp(22px, 4vw, 32px)",
                                fontWeight: "700", margin: 0, flex: 1,
                                color: COLORS.bodyText,
                                lineHeight: "1.2", letterSpacing: "-0.02em",
                            }}>
                                {item.title}
                            </h1>
                            <div style={{ flexShrink: 0 }}>
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
                        </div>

                        {/* Description */}
                        <div>
                            <p style={{ margin: "0 0 6px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: COLORS.mutedText }}>
                                Description
                            </p>
                            <p style={{
                                margin: 0, fontSize: "15px", lineHeight: "1.7",
                                color: item.description ? COLORS.bodyText : COLORS.border,
                                fontStyle: item.description ? "normal" : "italic",
                            }}>
                                {item.description || "No description."}
                            </p>
                        </div>

                        {/* Divider */}
                        <div style={{ height: "1px", background: "#E2DAF5" }} />

                        {/* Meta row */}
                        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                            {/* Status badge */}
                            <StatusBadge status={item.status} />

                            {/* Updated at */}
                            <span style={{ display: "flex", alignItems: "center", gap: "4px", color: COLORS.mutedText, fontSize: "12px" }}>
                                <CalendarIcon />
                                <RelativeTime timestamp={item.updated_at} />
                            </span>

                            {/* Tag */}
                            {tag && item.tag && (
                                <span style={{
                                    display: "inline-flex", alignItems: "center", gap: "5px",
                                    background: tag.bg, color: tag.text,
                                    fontSize: "11.5px", fontWeight: "600",
                                    padding: "3px 10px", borderRadius: "20px",
                                }}>
                                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: tag.dot }} />
                                    <TagIcon /> {item.tag}
                                </span>
                            )}

                            {/* Completed badge */}
                            {item.status === "complete" && item.completed_at && (
                                <span style={{
                                    display: "inline-flex", alignItems: "center", gap: "5px",
                                    color: "#16A34A", fontSize: "11.5px", fontWeight: "600",
                                    background: "#F0FDF4", padding: "3px 10px", borderRadius: "20px",
                                }}>
                                    <CheckIcon /> Completed {formatDate(item.completed_at)}
                                </span>
                            )}
                        </div>

                        {/* Divider */}
                        <div style={{ height: "1px", background: "#E2DAF5" }} />

                        {/* Action buttons */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            <PillButton onClick={() => setShowCalendarModal(true)}>
                                <CalendarIcon /> Add to calendar
                            </PillButton>

                            {isOwner && (
                                <PillButton onClick={() => setShowStatusModal(true)}>
                                    <StatusIcon /> Update status
                                </PillButton>
                            )}

                            {canEdit && (
                                <>
                                    <PillButton onClick={() => setShowEditModal(true)}>
                                        <EditIcon /> Edit
                                    </PillButton>
                                    <PillButton
                                        onClick={() => setShowDeleteModal(true)}
                                        color={COLORS.accent} bg="#FFF0F0"
                                        border="#FFCDD2" hoverBg="#FFE0E0"
                                    >
                                        <TrashIcon /> Delete
                                    </PillButton>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Google Places placeholder */}
                    <ExtendedItemCard />
                </div>
            </div>

            <CalendarExportModal item={item} isOpen={showCalendarModal} onClose={() => setShowCalendarModal(false)} />
            <EditItemModal
                item={item} isOpen={showEditModal}
                onSave={handleSave}
                onClose={() => { setShowEditModal(false); setEditErrors({}); }}
                isSaving={isSaving} errors={editErrors}
            />
            <DeleteWarningModal
                item={item} isOpen={showDeleteModal}
                onConfirm={handleDelete}
                onClose={() => setShowDeleteModal(false)}
                isDeleting={isDeleting}
            />
            <StatusUpdateModal
                item={item} isOpen={showStatusModal}
                onSave={handleStatusUpdate}
                onClose={() => { setShowStatusModal(false); setStatusError(""); }}
                isSaving={isSavingStatus} error={statusError}
            />
        </>
    );
}