import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Ellipsis,
  Pencil,
  Trash2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import RelativeTime from "../UI/RelativeTime";
import VoteControls from "../UI/VoteControls";
import Avatar from "../UI/Avatar";

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatItemDate(item) {
  if (!item?.start_date) return null;

  const fmt = (d) =>
    new Date(d).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const fmtTime = (t) => {
    const [h, m] = t.split(":");
    const d = new Date();
    d.setHours(Number(h), Number(m));
    return d.toLocaleTimeString("en-AU", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const start = fmt(item.start_date);
  const end =
    item.end_date && item.end_date !== item.start_date
      ? fmt(item.end_date)
      : null;

  const timeStr =
    item.start_time && item.end_time
      ? `${fmtTime(item.start_time)} – ${fmtTime(item.end_time)}`
      : null;

  if (end && timeStr) return `${start} – ${end}, ${timeStr}`;
  if (end) return `${start} – ${end}`;
  if (timeStr) return `${start}, ${timeStr}`;
  return start;
}

function getStatusLabel(status) {
  if (status === "locked_in") return "Locked In";
  if (status === "complete") return "Complete";
  if (status === "cancelled") return "Cancelled";
  return "Proposed";
}

function getStatusClass(status) {
  if (status === "locked_in") return "item-status-badge-locked";
  if (status === "complete") return "item-status-badge-complete";
  if (status === "cancelled") return "item-status-badge-cancelled";
  return "item-status-badge-proposed";
}

function ItemDetailCard({
  bucketList,
  item,
  canEdit,
  isOwner,
  canVote,
  voteScore,
  userVote,
  isVoting,
  onBack,
  onUpvote,
  onDownvote,
  onAddToCalendar,
  onAddDate,
  onEdit,
  onDelete,
  onUpdateStatus,
  showBreadcrumb = true,
  isMobileOverlay = false,
}) {
  const navigate = useNavigate();
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const optionsMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target)
      ) {
        setShowOptionsMenu(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") setShowOptionsMenu(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleOpen = () => {
    navigate(`/bucketlists/${bucketList.id}`);
    setShowOptionsMenu(false);
  };

  const handleEdit = () => {
    onEdit?.();
    setShowOptionsMenu(false);
  };

  const handleDelete = () => {
    onDelete?.();
    setShowOptionsMenu(false);
  };

  return (
    <article className="item-detail-card">
      <div className={`item-detail-hero ${isMobileOverlay ? "pt-12" : ""}`}>
        {showBreadcrumb && (
          <div className="item-breadcrumb item-breadcrumb-light">
            <button
              type="button"
              className="item-breadcrumb-button item-breadcrumb-button-light"
              onClick={onBack}
            >
              {bucketList?.title}
            </button>
            <span className="item-breadcrumb-separator">›</span>
            <span>{item.title}</span>
          </div>
        )}

        <div
          className={`item-detail-topbar ${
            isMobileOverlay ? "flex-col items-start gap-2.5" : ""
          }`}
        >
          <div className="item-detail-title-block min-w-0">
            <h1
              className={`item-detail-title ${
                isMobileOverlay ? "pr-10 text-[1.32rem] leading-[1.12]" : ""
              }`}
            >
              {item.title}
            </h1>
          </div>

          {!isMobileOverlay && (
            <div className="relative shrink-0" ref={optionsMenuRef}>
              <button
                type="button"
                className="item-options-button"
                onClick={() => setShowOptionsMenu((prev) => !prev)}
                aria-label="Item options"
                aria-haspopup="menu"
                aria-expanded={showOptionsMenu}
              >
                <Ellipsis size={18} aria-hidden="true" />
              </button>

              {showOptionsMenu ? (
                <div className="absolute right-0 top-12 z-30 w-56 overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-xl">
                  <button
                    type="button"
                    onClick={handleOpen}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--body-text)] transition hover:bg-black/5"
                  >
                    <ExternalLink size={16} aria-hidden="true" />
                    Open
                  </button>

                  {canEdit ? (
                    <>
                      <button
                        type="button"
                        onClick={handleEdit}
                        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--body-text)] transition hover:bg-black/5"
                      >
                        <Pencil size={16} aria-hidden="true" />
                        Edit
                      </button>
                      <div className="mx-3 h-px bg-black/8" />
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                      >
                        <Trash2 size={16} aria-hidden="true" />
                        Delete
                      </button>
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          )}
        </div>

        <section
          className={`${isMobileOverlay ? "mt-1" : ""} item-detail-section`}
        >
          <p className="item-detail-label">Description</p>
          <p
            className={`item-detail-description ${
              !item.description ? "item-detail-description-empty" : ""
            } ${isMobileOverlay ? "text-[0.93rem] leading-relaxed" : ""}`}
          >
            {item.description || "No description."}
          </p>
        </section>

        {canVote && (
          <div
            className={`item-detail-votes item-detail-votes-prominent ${
              isMobileOverlay ? "mb-2 mt-0.5" : ""
            }`}
          >
            <VoteControls
              itemTitle={item.title}
              score={voteScore}
              activeVote={userVote}
              isVoting={isVoting}
              onUpvote={onUpvote}
              onDownvote={onDownvote}
              variant="focus"
            />
          </div>
        )}

        {isMobileOverlay && (
          <div className="relative mt-1" ref={optionsMenuRef}>
            <button
              type="button"
              className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white/65 px-4 text-sm font-semibold text-[var(--heading-text)] shadow-sm backdrop-blur-sm transition hover:bg-white"
              onClick={() => setShowOptionsMenu((prev) => !prev)}
              aria-label="Item options"
              aria-haspopup="menu"
              aria-expanded={showOptionsMenu}
            >
              Options
            </button>

            {showOptionsMenu ? (
              <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-xl">
                <button
                  type="button"
                  onClick={handleOpen}
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--body-text)] transition hover:bg-black/5"
                >
                  <ExternalLink size={16} aria-hidden="true" />
                  Open
                </button>

                {canEdit ? (
                  <>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--body-text)] transition hover:bg-black/5"
                    >
                      <Pencil size={16} aria-hidden="true" />
                      Edit
                    </button>
                    <div className="mx-3 h-px bg-black/8" />
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      Delete
                    </button>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="item-detail-divider" />

      <div className={isMobileOverlay ? "space-y-2" : "item-meta-row"}>
        <div className="flex items-center justify-around gap-2.5 overflow-x-auto whitespace-nowrap pt-2 pb-1">
          {item.creator && (
            <span className="item-meta-pill flex min-w-fit items-center px-2.5 py-1 text-xs">
              <Avatar
                user={item.creator}
                size="xs"
                className="mr-1.5 shrink-0"
              />
              <span className="truncate">
                {item.creator.display_name ?? item.creator.username}
              </span>
            </span>
          )}

          <span
            className={`item-status-badge shrink-0 ${getStatusClass(item.status)} ${
              isMobileOverlay ? "px-2.5 py-1 text-xs" : ""
            }`}
          >
            {getStatusLabel(item.status)}
          </span>
        </div>

        <span className="block text-[11px] flex justify-center items-center text-[var(--muted-text)]">
          <RelativeTime timestamp={item.updated_at} />
        </span>
      </div>

      <div className="item-detail-divider" />

      <section className="item-detail-section">
        <p className="item-detail-label">Date</p>

        {item.start_date ? (
          <p
            className={`item-date-empty ${
              isMobileOverlay
                ? "text-[0.92rem] leading-relaxed"
                : "leading-relaxed"
            }`}
          >
            <CalendarDays
              size={15}
              style={{
                display: "inline",
                verticalAlign: "middle",
                marginRight: "6px",
              }}
            />
            Scheduled for {formatItemDate(item)}
          </p>
        ) : (
          <p
            className={`item-date-empty ${isMobileOverlay ? "text-[0.92rem]" : ""}`}
          >
            Make it happen. Book it in.
          </p>
        )}

        {item.start_date ? (
          <button
            type="button"
            className={`item-action-pill ${
              isMobileOverlay ? "w-full justify-center py-2.5 text-sm" : ""
            }`}
            onClick={onAddToCalendar}
          >
            <CalendarDays size={14} />
            <span style={{ marginLeft: "4px" }}>Add to calendar</span>
          </button>
        ) : (
          <button
            type="button"
            className={`item-action-pill ${
              isMobileOverlay ? "w-full justify-center py-2.5 text-sm" : ""
            }`}
            onClick={onAddDate}
          >
            <CalendarDays size={14} />
            <span style={{ marginLeft: "4px" }}>Add date</span>
          </button>
        )}
      </section>

      <div className="item-detail-divider" />

      <div className={`item-action-row ${isMobileOverlay ? "mt-0" : ""}`}>
        {isOwner ? (
          <button
            type="button"
            className={`item-action-pill ${
              isMobileOverlay ? "w-full justify-center py-2.5 text-sm" : ""
            }`}
            onClick={onUpdateStatus}
          >
            <RefreshCw size={13} />
            <span style={{ marginLeft: "4px" }}>Update status</span>
          </button>
        ) : null}
      </div>
    </article>
  );
}

export default ItemDetailCard;
