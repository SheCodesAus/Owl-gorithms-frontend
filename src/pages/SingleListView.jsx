import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Kickit Colours
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

// Tag Colours
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

// Helpers
function formatDate(iso) {
    if (!iso) return null;
    return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}
function formatTime(iso) {
    if (!iso) return null;
    return new Date(iso).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" });
}
function daysUntil(iso) {
    return Math.ceil((new Date(iso) - new Date()) / (1000 * 60 * 60 * 24));
}

// Icons 
const TagIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
);
const CheckIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
    </svg>
);
const ClockIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
);
const CalendarIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
);
const GlobeIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
);
const LockIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
);
const TrashIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
        <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>
);
const UserIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
);

// Delete Modal
function DeleteConfirmModal({ item, onConfirm, onCancel }) {
    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 100, backdropFilter: "blur(6px)"
        }}>
            <div style={{
                background: COLORS.white, borderRadius: "20px",
                padding: "36px", maxWidth: "400px", width: "90%",
                boxShadow: "0 24px 64px rgba(107,78,170,0.15)",
                border: `1px solid ${COLORS.surface}`
            }}>
                <div style={{ fontSize: "32px", marginBottom: "16px" }}>🗑️</div>
                <h3 style={{
                    color: COLORS.bodyText, fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "20px", fontWeight: "700", margin: "0 0 10px"
                }}>
                    Get rid of it?
                </h3>
                <p style={{ color: COLORS.mutedText, fontSize: "14px", lineHeight: "1.6", margin: "0 0 28px" }}>
                    "<strong style={{ color: COLORS.bodyText }}>{item.title}</strong>" is gone.
                </p>
                <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={onCancel} style={{
                        flex: 1, padding: "11px", borderRadius: "10px",
                        border: `1px solid ${COLORS.border}`, background: "transparent",
                        color: COLORS.primary, cursor: "pointer", fontSize: "14px",
                        fontWeight: "600", fontFamily: "'Inter', sans-serif"
                    }}>Cancel</button>
                    <button onClick={onConfirm} style={{
                        flex: 1, padding: "11px", borderRadius: "10px",
                        border: "none", background: COLORS.accent,
                        color: COLORS.ctaText, cursor: "pointer", fontSize: "14px",
                        fontWeight: "600", fontFamily: "'Inter', sans-serif"
                    }}>Delete</button>
                </div>
            </div>
        </div>
    );
}

// Item Card
function ItemCard({ item, onDelete }) {
    const [hovering, setHovering] = useState(false);
    const tag = TAG_COLORS[item.tag] || TAG_COLORS.other;

    return (
        <div
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            style={{
                background: item.is_completed ? COLORS.background : COLORS.white,
                border: `1px solid ${hovering ? COLORS.border : "#E2DAF5"}`,
                borderRadius: "16px",
                padding: "20px 24px",
                transition: "all 0.2s ease",
                transform: hovering ? "translateY(-2px)" : "none",
                boxShadow: hovering
                    ? "0 8px 32px rgba(107,78,170,0.12)"
                    : "0 1px 4px rgba(107,78,170,0.05)",
                opacity: item.is_completed ? 0.75 : 1,
            }}
        >
            {/* Top row */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", flex: 1, minWidth: 0 }}>
                    {/* Completion circle */}
                    <div style={{
                        width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0, marginTop: "2px",
                        background: item.is_completed ? COLORS.primary : "transparent",
                        border: `2px solid ${item.is_completed ? COLORS.primary : COLORS.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: COLORS.ctaText
                    }}>
                        {item.is_completed && <CheckIcon />}
                    </div>

                    <div style={{ minWidth: 0 }}>
                        <h3 style={{
                            margin: "0 0 5px",
                            color: item.is_completed ? COLORS.mutedText : COLORS.bodyText,
                            fontSize: "15px", fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: "600", lineHeight: "1.4",
                            textDecoration: item.is_completed ? "line-through" : "none"
                        }}>
                            {item.title}
                        </h3>
                        {item.description && (
                            <p style={{ margin: 0, color: COLORS.mutedText, fontSize: "13.5px", lineHeight: "1.6", fontFamily: "'Inter', sans-serif" }}>
                                {item.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Delete button */}
                <button
                    onClick={() => onDelete(item)}
                    style={{
                        background: hovering ? "#FFF0F0" : "transparent",
                        border: `1px solid ${hovering ? "#FFCDD2" : "transparent"}`,
                        color: hovering ? COLORS.accent : "#C4B5D4",
                        borderRadius: "8px", padding: "6px 8px",
                        cursor: "pointer", flexShrink: 0,
                        transition: "all 0.2s ease", display: "flex", alignItems: "center"
                    }}
                >
                    <TrashIcon />
                </button>
            </div>

            {/* Meta row */}
            <div style={{
                display: "flex", alignItems: "center", gap: "14px",
                marginTop: "14px", flexWrap: "wrap"
            }}>
                {/* Tag badge */}
                <span style={{
                    display: "inline-flex", alignItems: "center", gap: "5px",
                    background: tag.bg, color: tag.text,
                    fontSize: "11.5px", fontWeight: "600",
                    padding: "3px 10px", borderRadius: "20px",
                    fontFamily: "'Inter', sans-serif"
                }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: tag.dot }} />
                    <TagIcon />
                    {item.tag}
                </span>

                <span style={{ display: "flex", alignItems: "center", gap: "4px", color: COLORS.mutedText, fontSize: "12px", fontFamily: "'Inter', sans-serif" }}>
                    <CalendarIcon /> {formatDate(item.date_created)}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px", color: COLORS.mutedText, fontSize: "12px", fontFamily: "'Inter', sans-serif" }}>
                    <ClockIcon /> {formatTime(item.date_created)}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px", color: COLORS.mutedText, fontSize: "12px", fontFamily: "'Inter', sans-serif" }}>
                    <UserIcon /> {item.created_by?.username}
                </span>

                {item.is_completed && item.completed_at && (
                    <span style={{
                        marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px",
                        color: "#16A34A", fontSize: "11.5px", fontWeight: "600",
                        background: "#F0FDF4", padding: "3px 10px", borderRadius: "20px",
                        fontFamily: "'Inter', sans-serif"
                    }}>
                        <CheckIcon /> Completed {formatDate(item.completed_at)}
                    </span>
                )}
            </div>
        </div>
    );
}

// Main Page
export default function SingleListView() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [filter, setFilter] = useState("all");

    const { id } = useParams();
    const API_BASE = import.meta.env.VITE_API_URL;

    useEffect(() => {
        async function fetchData() {
            try {
                const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzcyOTczMTE3LCJpYXQiOjE3NzI5Njk1MzIsImp0aSI6ImI0MjYxOTdiOTcxYjQyMTJiNDM3MGYyZDU3OGY1MjQ4IiwidXNlcl9pZCI6IjEifQ.-mJDUM68HuuN1Huab5kWN-oW21r8eRHhGreE-26Xe2o";

                const [listRes, itemsRes] = await Promise.all([
                    fetch(`${API_BASE}/bucketlists/${id}/`, {
                        credentials: "include",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }),
                    fetch(`${API_BASE}/bucketlists/${id}/items/`, {
                        credentials: "include",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }),
                ]);
                if (!listRes.ok || !itemsRes.ok) throw new Error("Failed to fetch data");
                const list = await listRes.json();
                const items = await itemsRes.json();
                setData({ ...list, items });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    if (loading) return (
        <div style={{ minHeight: "100vh", background: COLORS.background, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.mutedText, fontFamily: "'Inter', sans-serif" }}>
            Loading...
        </div>
    );

    if (error || !data) return (
        <div style={{ minHeight: "100vh", background: COLORS.background, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}>
            {error || "Something went wrong."}
        </div>
    );

    const completed = data.items.filter(i => i.is_completed).length;
    const total = data.items.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    const daysLeft = data.has_deadline && data.deadline ? daysUntil(data.deadline) : null;

    const filteredItems = data.items.filter(item => {
        if (filter === "complete") return item.is_completed;
        if (filter === "pending") return !item.is_completed;
        return true;
    });

    const handleDeleteConfirm = async () => {
        try {
            const res = await fetch(`${API_BASE}/items/${deleteTarget.id}/`, {
                method: "DELETE", credentials: "include",
            });
            if (!res.ok) throw new Error("Delete failed");
            setData(prev => ({ ...prev, items: prev.items.filter(i => i.id !== deleteTarget.id) }));
        } catch (err) {
            alert(err.message);
        } finally {
            setDeleteTarget(null);
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: COLORS.background, fontFamily: "'Inter', sans-serif", color: COLORS.bodyText }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
                * { box-sizing: border-box; }
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #C4B5D4; border-radius: 3px; }
            `}</style>

            <div style={{ maxWidth: "780px", margin: "0 auto", padding: "48px 24px" }}>

                {/* Breadcrumb */}
                <div style={{ color: COLORS.mutedText, fontSize: "13px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Inter', sans-serif" }}>
                    <span style={{ cursor: "pointer", color: COLORS.primary, fontWeight: "500" }}>My Lists</span>
                    <span style={{ color: COLORS.border }}>›</span>
                    <span>Detail View</span>
                </div>

                {/* Header */}
                <div style={{ marginBottom: "36px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                        <div>
                            <h1 style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontSize: "clamp(28px, 5vw, 40px)",
                                fontWeight: "700", margin: "0 0 10px",
                                color: COLORS.bodyText, lineHeight: "1.2",
                                letterSpacing: "-0.02em"
                            }}>
                                {data.title}
                            </h1>
                            <p style={{ color: COLORS.mutedText, fontSize: "15px", lineHeight: "1.7", margin: 0, maxWidth: "520px" }}>
                                {data.description}
                            </p>
                        </div>

                        {/* Badges */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", flexShrink: 0 }}>
                            <span style={{
                                display: "inline-flex", alignItems: "center", gap: "6px",
                                padding: "6px 14px", borderRadius: "20px",
                                background: data.is_public ? "#EEF6FF" : COLORS.surface,
                                color: data.is_public ? "#2563EB" : COLORS.primary,
                                border: `1px solid ${data.is_public ? "#BFDBFE" : COLORS.border}`,
                                fontSize: "12px", fontWeight: "600"
                            }}>
                                {data.is_public ? <GlobeIcon /> : <LockIcon />}
                                {data.is_public ? "Public" : "Private"}
                            </span>

                            <span style={{
                                display: "inline-flex", alignItems: "center", gap: "6px",
                                padding: "5px 12px", borderRadius: "20px",
                                background: data.is_open ? "#F0FDF4" : "#F5F5F5",
                                color: data.is_open ? "#16A34A" : COLORS.mutedText,
                                fontSize: "12px", fontWeight: "500"
                            }}>
                                <span style={{
                                    width: "6px", height: "6px", borderRadius: "50%",
                                    background: data.is_open ? "#16A34A" : COLORS.mutedText,
                                    boxShadow: data.is_open ? "0 0 6px #16A34A" : "none"
                                }} />
                                {data.is_open ? "Open" : "Archived"}
                            </span>
                        </div>
                    </div>

                    {/* Meta row */}
                    <div style={{ display: "flex", gap: "20px", marginTop: "20px", flexWrap: "wrap" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "5px", color: COLORS.mutedText, fontSize: "13px" }}>
                            <CalendarIcon /> Created {formatDate(data.date_created)}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "5px", color: COLORS.mutedText, fontSize: "13px" }}>
                            <UserIcon /> {data.owner?.username}
                        </span>
                        {daysLeft !== null && (
                            <span style={{
                                display: "flex", alignItems: "center", gap: "5px",
                                color: daysLeft < 30 ? COLORS.accent : COLORS.mutedText, fontSize: "13px"
                            }}>
                                <ClockIcon />
                                {daysLeft > 0 ? `${daysLeft} days until deadline` : "Deadline passed"}
                            </span>
                        )}
                    </div>
                </div>

                {/* Progress card */}
                <div style={{
                    background: COLORS.white, borderRadius: "16px",
                    padding: "22px 26px", marginBottom: "28px",
                    border: `1px solid #E2DAF5`,
                    boxShadow: "0 1px 4px rgba(107,78,170,0.06)"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "14px" }}>
                        <span style={{ color: COLORS.mutedText, fontSize: "12px", fontWeight: "600", letterSpacing: "0.07em", textTransform: "uppercase" }}>
                            Progress
                        </span>
                        <span style={{ color: COLORS.bodyText, fontSize: "22px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700" }}>
                            {completed}<span style={{ color: COLORS.mutedText, fontSize: "16px" }}>/{total}</span>
                        </span>
                    </div>
                    <div style={{ height: "6px", background: COLORS.surface, borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{
                            height: "100%", width: `${progress}%`,
                            background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.border})`,
                            borderRadius: "3px", transition: "width 0.6s ease"
                        }} />
                    </div>
                    <div style={{ color: COLORS.mutedText, fontSize: "12px", marginTop: "8px" }}>{progress}% complete</div>
                </div>

                {/* Filter tabs */}
                <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
                    {["all", "pending", "complete"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: "7px 20px", borderRadius: "20px",
                                border: `1px solid ${filter === f ? COLORS.primary : "#E2DAF5"}`,
                                background: filter === f ? COLORS.primary : COLORS.white,
                                color: filter === f ? COLORS.ctaText : COLORS.mutedText,
                                cursor: "pointer", fontSize: "13px", fontWeight: "600",
                                transition: "all 0.15s ease", textTransform: "capitalize",
                                fontFamily: "'Inter', sans-serif"
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Items list */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {filteredItems.length === 0 ? (
                        <div style={{
                            textAlign: "center", padding: "60px 20px",
                            color: COLORS.mutedText, fontSize: "15px",
                            background: COLORS.white, borderRadius: "16px",
                            border: "1px solid #E2DAF5"
                        }}>
                            Nothing here yet — make a plan, do something new!
                        </div>
                    ) : filteredItems.map(item => (
                        <ItemCard key={item.id} item={item} onDelete={setDeleteTarget} />
                    ))}
                </div>
            </div>

            {/* Delete modal */}
            {deleteTarget && (
                <DeleteConfirmModal
                    item={deleteTarget}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
}