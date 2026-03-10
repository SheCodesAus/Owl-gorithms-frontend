import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import ExtendedItemCard from "../components/ExtendedItemCard";

function ItemDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [itemStatus, setItemStatus] = useState(location.state?.itemStatus || "planned");

  // Get item from location state (passed from ItemCard click)
  const item = location.state?.item;
  const votes = location.state?.votes || {};

  if (!item) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Inter', sans-serif",
          color: "#6B6880",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2>Item not found</h2>
          <p>Please select an item from a bucket list.</p>
          <button
            onClick={() => navigate("/")}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "#6B4EAA",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  const handleSetStatus = (status) => {
    setItemStatus(status);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F6FB",
        fontFamily: "'Inter', sans-serif",
        padding: "48px 24px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
      `}</style>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <ExtendedItemCard
          item={item}
          onClose={handleClose}
          votes={votes}
          itemStatus={itemStatus}
          onSetStatus={handleSetStatus}
        />
      </div>
    </div>
  );
}

export default ItemDetailPage;