import "./ExtendedItemCard.css";

function ExtendedItemCard({ item, onClose, onComplete }) {
  return (
    <div className="expanded-card">

      <div className="expanded-header">

        <h2 className="expanded-title">
          {item.title}
        </h2>

        <button
          className="close-button"
          onClick={onClose}
        >
          Close
        </button>

      </div>

      <span className={`status-badge status-${item.status}`}>
        {item.status}
      </span>

      {item.description && (
        <p className="expanded-description">
          {item.description}
        </p>
      )}

      <div className="vote-section">

        <span>
          👍 {item.upvotes || 0}
        </span>

        <span>
          👎 {item.downvotes || 0}
        </span>

      </div>

      <div className="meta">

        <p>
          Created:
          {new Date(item.created_at).toLocaleDateString()}
        </p>

        {item.completed_at && (
          <p>
            Completed:
            {new Date(item.completed_at).toLocaleDateString()}
          </p>
        )}

      </div>

      {item.status === "locked_in" && (
        <button
          className="complete-button"
          onClick={() => onComplete(item.id)}
        >
          ✓ Mark as Complete
        </button>
      )}

    </div>
  );
}

export default ExtendedItemCard;