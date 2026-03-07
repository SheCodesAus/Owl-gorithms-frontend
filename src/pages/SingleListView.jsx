import { useState, useEffect } from "react";

function formatDate(iso) {
    if (!iso) return null;
    const d = new Date(iso);
    return d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

function formatTime(iso) {
    if (!iso) return null;
    const d = new Date(iso);
    return d.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" });
}

function daysUntil(iso) {
    const now = new Date();
    const target = new Date(iso);
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diff;
}

const TagIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
);

const CheckIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
);

const GlobeIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
);

const LockIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
);

const TrashIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>
);

const UserIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
);

function DeleteConfirmModal({ item, onConfirm, onCancel }) {
    return (
        <div style={{
        position: "fixed", inset: 0, background: "rgba(15,12,20,0.7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 100, backdropFilter: "blur(4px)"
        }}>
        <div style={{
            background: "#1a1625", border: "1px solid #2e2840",
            borderRadius: "16px", padding: "32px", maxWidth: "400px", width: "90%",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5)"
        }}>
            <div style={{ fontSize: "28px", marginBottom: "12px" }}>🗑️</div>
            <h3 style={{ color: "#f0ebff", fontFamily: "'Space Grotesk', Bold 700", fontSize: "20px", margin: "0 0 10px" }}>
            Get rid of it?
            </h3>
            <p style={{ color: "#a78bfa", fontSize: "14px", lineHeight: "1.6", margin: "0 0 24px" }}>
            "<strong style={{ color: "#c9bdf0" }}>{item.title}</strong>" is gone.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={onCancel} style={{
                flex: 1, padding: "10px", borderRadius: "8px",
                border: "1px solid #2e2840", background: "transparent",
                color: "#a78bfa", cursor: "pointer", fontSize: "14px", fontWeight: "500"
            }}>Cancel</button>
            <button onClick={onConfirm} style={{
                flex: 1, padding: "10px", borderRadius: "8px",
                border: "none", background: "#FF5A5F",
                color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: "600"
            }}>Delete</button>
            </div>
        </div>
        </div>
    );
}

function ItemCard({ item, onDelete }) {
    const [hovering, setHovering] = useState(false);
    const tag = TAG_COLORS[item.tag] || { bg: "#f5f5f5", text: "#333", dot: "#666" };

    return (
    <div
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        style={{
            background: item.is_completed ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${item.is_completed ? "rgba(255,255,255,0.06)" : "rgba(167,139,250,0.15)"}`,
            borderRadius: "14px",
            padding: "20px 22px",
            position: "relative",
            transition: "all 0.2s ease",
            transform: hovering ? "translateY(-2px)" : "none",
            boxShadow: hovering ? "0 8px 32px rgba(0,0,0,0.3)" : "none",
            opacity: item.is_completed ? 0.75 : 1,
        }}
        >
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", flex: 1, minWidth: 0 }}>
            {/* Completion indicator */}
            <div style={{
                width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0, marginTop: "2px",
                background: item.is_completed ? "linear-gradient(135deg, #4caf50, #2e7d32)" : "transparent",
                border: `2px solid ${item.is_completed ? "#4caf50" : "rgba(167,139,250,0.4)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff"
            }}>
                {item.is_completed && <CheckIcon />}
            </div>

            <div style={{ minWidth: 0 }}>
                <h3 style={{
                margin: "0 0 6px", color: item.is_completed ? "#7a6f8a" : "#f0ebff",
                fontSize: "16px", fontFamily: "'Space Grotesk', Bold 700", fontWeight: "600",
                lineHeight: "1.4", textDecoration: item.is_completed ? "line-through" : "none"
                }}>
                {item.title}
                </h3>
                {item.description && (
                <p style={{ margin: 0, color: "#7a6f8a", fontSize: "13.5px", lineHeight: "1.6" }}>
                    {item.description}
                </p>
                )}
            </div>
        </div>

        {/* Delete button */}
        <button
            onClick={() => onDelete(item)}
            style={{
                background: hovering ? "rgba(198,40,40,0.15)" : "transparent",
                border: `1px solid ${hovering ? "rgba(198,40,40,0.4)" : "transparent"}`,
                color: hovering ? "#ef9a9a" : "#4a3f5c",
                borderRadius: "8px", padding: "6px 8px",
                cursor: "pointer", flexShrink: 0,
                transition: "all 0.2s ease", display: "flex", alignItems: "center"
            }}
            >
            <TrashIcon />
            </button>
        </div>

      {/* Bottom meta row */}
        <div style={{
            display: "flex", alignItems: "center", gap: "16px",
            marginTop: "14px", flexWrap: "wrap"
        }}>
            {/* Tag */}
            <span style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            background: tag.bg, color: tag.text,
            fontSize: "11.5px", fontWeight: "600",
            padding: "3px 9px", borderRadius: "20px", letterSpacing: "0.02em"
            }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: tag.dot, display: "inline-block" }} />
            <TagIcon />
            {item.tag}
            </span>

            {/* Created date */}
            <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#5c5070", fontSize: "12px" }}>
            <CalendarIcon />
            {formatDate(item.date_created)}
            </span>

            {/* Created time */}
            <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#5c5070", fontSize: "12px" }}>
            <ClockIcon />
            {formatTime(item.date_created)}
            </span>

            {/* Added by */}
            <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#5c5070", fontSize: "12px" }}>
            <UserIcon />
            {item.created_by?.username}
            </span>

            {/* Completed badge */}
            {item.is_completed && item.completed_at && (
            <span style={{
                marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px",
                color: "#4caf50", fontSize: "11.5px", fontWeight: "600",
                background: "rgba(76,175,80,0.1)", padding: "3px 9px", borderRadius: "20px"
            }}>
                <CheckIcon />
                Completed {formatDate(item.completed_at)}
            </span>
            )}
        </div>
        </div>
    );
}

export default function BucketListDetailPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [filter, setFilter] = useState("all");

    const BUCKETLIST_ID = 1;
    const API_BASE = "/api"; //CONNECT THIS!!//

    useEffect(() => {
        async function fetchData() {
        try {
            const [listRes, itemsRes] = await Promise.all([
            fetch(`${API_BASE}/bucketlists/${BUCKETLIST_ID}/`, { credentials: "include" }),
            fetch(`${API_BASE}/bucketlists/${BUCKETLIST_ID}/items/`, { credentials: "include" }),
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
    }, [BUCKETLIST_ID]);

    if (loading) return (
        <div style={{ minHeight: "100vh", background: "#0f0c14", display: "flex", alignItems: "center", justifyContent: "center", color: "#5c5070", fontFamily: "'DM Sans', sans-serif" }}>
        Loading...
        </div>
    );

    if (error || !data) return (
        <div style={{ minHeight: "100vh", background: "#0f0c14", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef9a9a", fontFamily: "'DM Sans', sans-serif" }}>
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
            method: "DELETE",
            credentials: "include",
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
        <div style={{
        minHeight: "100vh",
        background: "#0f0c14",
        fontFamily: "'DM Sans', sans-serif",
        color: "#f0ebff",
        }}>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap');
</style>;
            * { box-sizing: border-box; }
            ::-webkit-scrollbar { width: 6px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: #2e2840; border-radius: 3px; }
        `}</style>

        {/* Ambient background glow */}
        <div style={{
            position: "fixed", top: "-200px", left: "50%", transform: "translateX(-50%)",
            width: "600px", height: "400px",
            background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)",
            pointerEvents: "none", zIndex: 0
        }} />

        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px", position: "relative", zIndex: 1 }}>

            {/* Header */}
            <div style={{ marginBottom: "40px" }}>
            {/* Breadcrumb */}
            <div style={{ color: "#5c5070", fontSize: "13px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ cursor: "pointer", color: "#7c6fa0" }}>My Lists</span>
                <span>›</span>
                <span>Detail View</span>
            </div>

            {/* Title + visibility badge */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                <div>
                <h1 style={{
                    fontFamily: "'Space Grotesk', Bold 700",
                    fontSize: "clamp(28px, 5vw, 42px)",
                    fontWeight: "700",
                    margin: "0 0 12px",
                    color: "#f0ebff",
                    lineHeight: "1.2",
                    letterSpacing: "-0.02em"
                }}>
                    {data.title}
                </h1>
                <p style={{ color: "#7a6f8a", fontSize: "15px", lineHeight: "1.7", margin: 0, maxWidth: "540px" }}>
                    {data.description}
                </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", flexShrink: 0 }}>
                {/* Public / Private badge */}
                <span style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    padding: "6px 14px", borderRadius: "20px",
                    background: data.is_public ? "rgba(33,150,243,0.12)" : "rgba(120,80,200,0.12)",
                    color: data.is_public ? "#64b5f6" : "#b39ddb",
                    border: `1px solid ${data.is_public ? "rgba(33,150,243,0.25)" : "rgba(120,80,200,0.25)"}`,
                    fontSize: "12.5px", fontWeight: "600"
                }}>
                    {data.is_public ? <GlobeIcon /> : <LockIcon />}
                    {data.is_public ? "Public" : "Private"}
                </span>

                {/* Status badge */}
                <span style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    padding: "5px 12px", borderRadius: "20px",
                    background: data.is_open ? "rgba(76,175,80,0.1)" : "rgba(158,158,158,0.1)",
                    color: data.is_open ? "#81c784" : "#9e9e9e",
                    fontSize: "12px", fontWeight: "500"
                }}>
                    <span style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: data.is_open ? "#81c784" : "#9e9e9e",
                    boxShadow: data.is_open ? "0 0 6px #81c784" : "none"
                    }} />
                    {data.is_open ? "Open" : "Archived"}
                </span>
                </div>
            </div>

            {/* Meta row */}
            <div style={{ display: "flex", gap: "20px", marginTop: "20px", flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "5px", color: "#5c5070", fontSize: "13px" }}>
                <CalendarIcon />
                Created {formatDate(data.date_created)}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "5px", color: "#5c5070", fontSize: "13px" }}>
                <UserIcon />
                {data.owner?.username}
                </span>
                {daysLeft !== null && (
                <span style={{
                    display: "flex", alignItems: "center", gap: "5px",
                    color: daysLeft < 30 ? "#ffb74d" : "#5c5070", fontSize: "13px"
                }}>
                    <ClockIcon />
                    {daysLeft > 0 ? `${daysLeft} days until deadline` : "Deadline passed"}
                </span>
                )}
            </div>
            </div>

            {/* Progress bar */}
            <div style={{
            background: "rgba(255,255,255,0.04)", borderRadius: "16px",
            padding: "20px 24px", marginBottom: "32px",
            border: "1px solid rgba(255,255,255,0.07)"
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
                <span style={{ color: "#9b8fbc", fontSize: "13px", fontWeight: "500", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Progress
                </span>
                <span style={{ color: "#f0ebff", fontSize: "22px", fontFamily: "'Space Grotesk', Bold 700", fontWeight: "700" }}>
                {completed}<span style={{ color: "#5c5070", fontSize: "16px" }}>/{total}</span>
                </span>
            </div>
            <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{
                height: "100%", width: `${progress}%`,
                background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
                borderRadius: "3px", transition: "width 0.6s ease"
                }} />
            </div>
            <div style={{ color: "#5c5070", fontSize: "12px", marginTop: "8px" }}>{progress}% complete</div>
            </div>

            {/* Filter tabs */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
            {["all", "pending", "complete"].map(f => (
                <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                    padding: "7px 18px", borderRadius: "20px", border: "1px solid",
                    borderColor: filter === f ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.08)",
                    background: filter === f ? "rgba(124,58,237,0.15)" : "transparent",
                    color: filter === f ? "#c4b5fd" : "#5c5070",
                    cursor: "pointer", fontSize: "13px", fontWeight: "500",
                    transition: "all 0.15s ease", textTransform: "capitalize"
                }}
                >
                {f}
                </button>
            ))}
            </div>

            {/* Items list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredItems.length === 0 ? (
                <div style={{
                textAlign: "center", padding: "60px 20px",
                color: "#3d3352", fontSize: "15px"
                }}>
                Nothing new in the diary? Make a plan! Do something new
                </div>
            ) : filteredItems.map(item => (
                <ItemCard key={item.id} item={item} onDelete={setDeleteTarget} />
            ))}
            </div>

        </div>

        {/* Delete confirmation modal */}
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