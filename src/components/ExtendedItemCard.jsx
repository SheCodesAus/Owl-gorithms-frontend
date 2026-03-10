import { useState } from "react";
import "./ExtendedItemCard.css";

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
  travel: { bg: "#EDE9F7", text: "#6B4EAA", dot: "#6B4EAA" },
  food: { bg: "#FFF0F0", text: "#FF5A5F", dot: "#FF5A5F" },
  adventure: { bg: "#EDE9F7", text: "#7C3AED", dot: "#7C3AED" },
  wellness: { bg: "#F0FDF4", text: "#16A34A", dot: "#16A34A" },
  social: { bg: "#FFF0F0", text: "#FF5A5F", dot: "#FF5A5F" },
  learning: { bg: "#EDE9F7", text: "#6B4EAA", dot: "#6B4EAA" },
  creative: { bg: "#EDE9F7", text: "#A78BFA", dot: "#A78BFA" },
  other: { bg: "#EEEAF7", text: "#6B6880", dot: "#6B6880" },
};

// Helpers
function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Icons
const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const TagIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);

function ExtendedItemCard({ item, onClose, onDelete, votes = {}, itemStatus, onSetStatus }) {
  const [hovering, setHovering] = useState(false);
  const tag = TAG_COLORS[item.tag] || TAG_COLORS.other;
  const itemUpvotes = votes[item.id] || 0;
  const status = itemStatus || "planned";

  const getStatusColor = (s) => {
    switch (s) {
      case "locked_in":
        return { bg: "#FEF3C7", border: "#F59E0B", text: "#D97706" };
      case "completed":
        return { bg: "#F0FDF4", border: "#16A34A", text: "#16A34A" };
      default:
        return { bg: "#F3F4F6", border: "#D1D5DB", text: "#6B6880" };
    }
  };

  const statusLabels = {
    planned: "Planned",
    locked_in: "Locked in",
    completed: "Completed",
  };

  return (
    <div
      style={{
        background: status === "completed" ? COLORS.background : COLORS.white,
        border: `1px solid ${COLORS.border}`,
        borderRadius: "16px",
        padding: "28px",
        maxWidth: "600px",
        boxShadow: "0 4px 16px rgba(107,78,170,0.08)",
        fontFamily: "'Inter', sans-serif",
        color: COLORS.bodyText,
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "20px",
          gap: "16px",
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "24px",
              fontWeight: "700",
              color: status === "completed" ? COLORS.mutedText : COLORS.bodyText,
              margin: "0 0 8px",
              letterSpacing: "-0.5px",
              textDecoration: status === "completed" ? "line-through" : "none",
              lineHeight: "1.3",
            }}
          >
            {item.title}
          </h2>

          {/* Status badge */}
          {status !== "planned" && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                color: getStatusColor(status).text,
                fontSize: "13px",
                fontWeight: "600",
                background: getStatusColor(status).bg,
                padding: "4px 12px",
                borderRadius: "20px",
                marginTop: "8px",
              }}
            >
              {status === "completed" && <CheckIcon />}
              {statusLabels[status]}
            </span>
          )}
        </div>

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              color: COLORS.primary,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              fontWeight: "600",
              fontSize: "14px",
              padding: "8px 16px",
              borderRadius: "8px",
              transition: "background 0.2s ease",
              flexShrink: 0,
            }}
            onMouseEnter={(e) =>
              (e.target.style.background = "rgba(107, 78, 170, 0.1)")
            }
            onMouseLeave={(e) => (e.target.style.background = "none")}
          >
            Back
          </button>
        )}
      </div>

      {/* Tag badge */}
      {item.tag && (
        <div style={{ marginBottom: "20px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              background: tag.bg,
              color: tag.text,
              fontSize: "11.5px",
              fontWeight: "600",
              padding: "4px 12px",
              borderRadius: "20px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: tag.dot,
              }}
            />
            <TagIcon />
            {item.tag}
          </span>
        </div>
      )}

      {/* Description */}
      {item.description && (
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "15px",
            lineHeight: "1.7",
            color: COLORS.bodyText,
            marginBottom: "24px",
            margin: "0 0 24px",
          }}
        >
          {item.description}
        </p>
      )}

      {/* Meta section */}
      <div
        style={{
          borderTop: `1px solid ${COLORS.surface}`,
          paddingTop: "20px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {item.date_created && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: COLORS.mutedText,
                fontSize: "13px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <CalendarIcon /> Created {formatDate(item.date_created)}
            </span>
          )}

          {item.created_by && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: COLORS.mutedText,
                fontSize: "13px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <UserIcon /> by {item.created_by.username}
            </span>
          )}
        </div>
      </div>

      {/* Upvotes Section */}
      <div
        style={{
          borderTop: `1px solid ${COLORS.surface}`,
          paddingTop: "20px",
          marginBottom: "20px",
        }}
      >
        <h3
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: COLORS.bodyText,
            margin: "0 0 12px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
        </h3>
        <p
          style={{
            margin: "0",
            fontSize: "16px",
            fontWeight: "700",
            color: COLORS.primary,
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {itemUpvotes} {itemUpvotes === 1 ? "person" : "people"} upvoted this item
        </p>
      </div>

      {/* Status selector */}
      {onSetStatus && (
        <div style={{ marginBottom: onDelete ? "12px" : "0" }}>
          <p
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: COLORS.bodyText,
              margin: "0 0 12px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Status
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["planned", "locked_in", "completed"].map((s) => (
              <button
                key={s}
                onClick={() => onSetStatus(s)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: `1px solid ${getStatusColor(s).border}`,
                  background: status === s ? getStatusColor(s).bg : "transparent",
                  color: getStatusColor(s).text,
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  fontFamily: "'Inter', sans-serif",
                  transition: "all 0.2s ease",
                  flex: 1,
                }}
              >
                {statusLabels[s]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Delete button */}
      {onDelete && (
        <button
          onClick={() => onDelete(item)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: `1px solid ${COLORS.accent}`,
            background: hovering ? "#FFF0F0" : "transparent",
            color: COLORS.accent,
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            fontFamily: "'Inter', sans-serif",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <TrashIcon /> Delete Item
        </button>
      )}
    </div>
  );
}

export default ExtendedItemCard;