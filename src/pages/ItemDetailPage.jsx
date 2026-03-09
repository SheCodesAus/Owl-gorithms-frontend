import { useParams, useNavigate } from "react-router-dom";
import ExtendedItemCard from "../components/ExtendedItemCard";
import mockItems from "../data/mockItems";

function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const item = mockItems.find(item => item.id === parseInt(id));

  if (!item) {
    return <div>Item not found</div>;
  }

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div style={{ padding: "40px" }}>
      <ExtendedItemCard item={item} onClose={handleClose} />
    </div>
  );
}

export default ItemDetailPage;