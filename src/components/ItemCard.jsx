import "./ItemCard.css";

function ItemCard({ item, onSelect }) {
  return (
    <div
      className={`item-card status-${item.status}`}
      onClick={() => onSelect(item)}
    >
      <div className="item-card-content">

        <h3 className="item-title">
          {item.title}
        </h3>

        <span className="status-pill">
          {item.status.replace("_", " ")}
        </span>

      </div>
    </div>
  );
}

export default ItemCard;