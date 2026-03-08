/* Individual item card 
Include tick
*/

import { useState } from "react";
import { Link } from "react-router-dom";          
import "./ItemCard.css";

function ItemCard({ BucketItemData, onToggleComplete }) {
  const [completed, setCompleted] = useState(
    BucketItemData.completed ?? false
  );

  const handleChange = () => {
    const next = !completed;
    setCompleted(next);
    if (onToggleComplete) {
      onToggleComplete(BucketItemData.id, next);
    }
  };

  const BucketItemLink = `/bucketitem/${BucketItemData.id}`;

  return (
    <div className={`item-card ${completed ? "completed" : ""}`}>
      <label className="checkbox-wrapper">
        <input
          type="checkbox"
          checked={completed}
          onChange={handleChange}
        />
        <span className="checkmark" />
      </label>

      <Link to={BucketItemLink}>
        <h3>{BucketItemData.title}</h3>
        <img
          src={BucketItemData.image}
          alt={BucketItemData.title}
        />
        <p>{BucketItemData.description}</p>
      </Link>
    </div>
  );
}

export default ItemCard;


