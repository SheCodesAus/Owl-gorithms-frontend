import { Search, X } from "lucide-react";

export default function BucketListSearchBar({ value, onChange }) {
  return (
    <div style={{ position: "relative" }}>
      <Search
        size={15}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "1rem",
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--muted-text)",
          pointerEvents: "none",
        }}
      />
      <input
        type="text"
        className="form-input-with-icon"
        placeholder="Search items..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ paddingRight: value ? "2.5rem" : "1rem" }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          style={{
            position: "absolute",
            right: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--muted-text)",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}