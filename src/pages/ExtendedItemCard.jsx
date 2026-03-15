export default function ExtendedItemCard() {
    return (
        <div style={{
            background: "#F7F6FB",
            border: "1px solid #E2DAF5",
            borderRadius: "16px",
            padding: "24px",
            marginTop: "16px",
        }}>
            <p style={{
                margin: "0 0 4px",
                fontSize: "11px", fontWeight: "700",
                textTransform: "uppercase", letterSpacing: "0.08em",
                color: "#6B6880",
            }}>
                Location suggestions
            </p>
            <p style={{ margin: 0, fontSize: "14px", color: "#6B6880", fontStyle: "italic" }}>
                Google Places integration coming soon.
            </p>
        </div>
    );
}