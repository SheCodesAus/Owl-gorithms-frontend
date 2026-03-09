import "./ExtendedItemCard.css";

function ExtendedItemCard({ item, onClose }) {

  return (
    <div className="extended-item-card">

      <div className="extended-header">

        <h2 className="extended-title">
          {item.title}
        </h2>

        <button
          className="close-button"
          onClick={onClose}
        >
          Back
        </button>

      </div>

      <span className={`status-pill status-${item.status}`}>
        {item.status.replace("_", " ")}
      </span>

      {item.description && (
        <p className="item-description">
          {item.description}
        </p>
      )}

      <div className="vote-section">

        <div className="vote">
          👍 {item.upvotes}
        </div>

        <div className="vote">
          👎 {item.downvotes}
        </div>

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

    </div>
  );
}

export default ExtendedItemCard;