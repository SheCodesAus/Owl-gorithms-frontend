import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ItemCard.css";

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

const ThumbsUpIcon = () => (
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
    <path d="M14 9V5a3 3 0 00-3-3 3 3 0 00-3 3v4a7 7 0 007 7 7 7 0 007-7 7 7 0 00-7-7z" />
  </svg>
);

function ItemCard({ item, onDelete, onSelect, onUpvote, votes = {}, onSetStatus, itemStatus }) {
  const navigate = useNavigate();
  const [hovering, setHovering] = useState(false);
  const [voteHover, setVoteHover] = useState(null);
  const tag = TAG_COLORS[item.tag] || TAG_COLORS.other;

  const itemVotes = votes[item.id] || 0;
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

  const handleCardClick = () => {
    navigate(`/item/${item.id}`, { state: { item, votes, itemStatus: status } });
  };

  const handleUpvote = (e) => {
    e.stopPropagation();
    onUpvote && onUpvote(item.id);
  };

  const handleCycleStatus = (e) => {
    e.stopPropagation();
    const statuses = ["planned", "locked_in", "completed"];
    const currentIndex = statuses.indexOf(status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    onSetStatus && onSetStatus(item.id, nextStatus);
  };

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={handleCardClick}
      style={{
        background: status === "completed" ? COLORS.background : COLORS.white,
        border: `1px solid ${hovering ? COLORS.border : "#E2DAF5"}`,
        borderRadius: "16px",
        padding: "20px 24px",
        transition: "all 0.2s ease",
        transform: hovering ? "translateY(-2px)" : "none",
        boxShadow: hovering
          ? "0 8px 32px rgba(107,78,170,0.12)"
          : "0 1px 4px rgba(107,78,170,0.05)",
        opacity: status === "completed" ? 0.75 : 1,
        cursor: "pointer",
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* Status indicator */}
          <div
            onClick={handleCycleStatus}
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              flexShrink: 0,
              marginTop: "2px",
              background: getStatusColor(status).bg,
              border: `2px solid ${getStatusColor(status).border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: getStatusColor(status).text,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {status === "completed" && <CheckIcon />}
          </div>

          <div style={{ minWidth: 0 }}>
            <h3
              style={{
                margin: "0 0 5px",
                color: status === "completed" ? COLORS.mutedText : COLORS.bodyText,
                fontSize: "15px",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: "600",
                lineHeight: "1.4",
                textDecoration: status === "completed" ? "line-through" : "none",
              }}
            >
              {item.title}
            </h3>
            {item.description && (
              <p
                style={{
                  margin: 0,
                  color: COLORS.mutedText,
                  fontSize: "13.5px",
                  lineHeight: "1.6",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {item.description}
              </p>
            )}
          </div>
        </div>

        {/* Delete button */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
            style={{
              background: hovering ? "#FFF0F0" : "transparent",
              border: `1px solid ${hovering ? "#FFCDD2" : "transparent"}`,
              color: hovering ? COLORS.accent : "#C4B5D4",
              borderRadius: "8px",
              padding: "6px 8px",
              cursor: "pointer",
              flexShrink: 0,
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
            }}
          >
            <TrashIcon />
          </button>
        )}
      </div>

      {/* Meta row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginTop: "14px",
          flexWrap: "wrap",
        }}
      >
        {/* Tag badge */}
        {item.tag && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              background: tag.bg,
              color: tag.text,
              fontSize: "11.5px",
              fontWeight: "600",
              padding: "3px 10px",
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
        )}

        {item.date_created && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: COLORS.mutedText,
              fontSize: "12px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <CalendarIcon /> {formatDate(item.date_created)}
          </span>
        )}

        {item.date_created && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: COLORS.mutedText,
              fontSize: "12px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <ClockIcon /> {formatTime(item.date_created)}
          </span>
        )}

        {item.created_by && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: COLORS.mutedText,
              fontSize: "12px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <UserIcon /> {item.created_by.username}
          </span>
        )}

        {status !== "planned" && (
          <span
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: getStatusColor(status).text,
              fontSize: "11.5px",
              fontWeight: "600",
              background: getStatusColor(status).bg,
              padding: "3px 10px",
              borderRadius: "20px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {status === "completed" && <CheckIcon />}
            {statusLabels[status]}
          </span>
        )}
      </div>

      {/* Voting Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginTop: "12px",
          paddingTop: "12px",
          borderTop: `1px solid ${COLORS.surface}`,
        }}
      >
        <button
          onClick={handleUpvote}
          onMouseEnter={() => setVoteHover("up")}
          onMouseLeave={() => setVoteHover(null)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "6px 10px",
            borderRadius: "8px",
            border: `1px solid ${
              voteHover === "up" ? "#16A34A" : "#E2DAF5"
            }`,
            background: voteHover === "up" ? "#F0FDF4" : "transparent",
            color: voteHover === "up" ? "#16A34A" : COLORS.mutedText,
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "600",
            fontFamily: "'Inter', sans-serif",
            transition: "all 0.2s ease",
          }}
        >
          <ThumbsUpIcon /> {itemVotes}
        </button>
      </div>
    </div>
  );
}

export default ItemCard;