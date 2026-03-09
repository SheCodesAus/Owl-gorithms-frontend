import ItemCard from "../components/ItemCard";
import mockItems from "../data/mockItems";
import { useNavigate } from "react-router-dom";

function SingleListView() {
  const navigate = useNavigate();

  const handleSelect = (item) => {
    navigate(`/item/${item.id}`);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>ItemCard Preview</h1>

      {mockItems.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onSelect={handleSelect}
        />
      ))}

    </div>
  );
}

export default SingleListView;