import { useState } from "react";
import { Link } from "react-router-dom";          
import "./ItemCard.css";

function ItemCard({ item, onSelect }) {
  return (
    <div
      className={`item-card status-${item.status}`}
      onClick={() => onSelect(item)}
    >
      <div className="item-card-header">

        <h3 className="item-title">
          {item.title}
        </h3>

        <span className="status-badge">
          {item.status}
        </span>

      </div>
    </div>
  );
}

export default ItemCard;


