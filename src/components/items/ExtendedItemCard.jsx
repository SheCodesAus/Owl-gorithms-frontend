import { MapPin, Search, Sparkles } from "lucide-react";

export default function ExtendedItemCard({ itemTitle }) {
  return (
    <section className="extended-item-card">
      <div className="extended-item-card-header">
        <div className="extended-item-card-title-wrap">
          <p className="extended-item-card-eyebrow">Suggestions</p>
          <h2 className="extended-item-card-title">Find a place for this idea</h2>
          <p className="extended-item-card-description">
            We’ll hook up live place suggestions later. For now, this section is
            ready for search, results, and map preview styling.
          </p>
        </div>

        <div className="extended-item-card-icon-shell" aria-hidden="true">
          <MapPin size={18} />
        </div>
      </div>

      <div className="item-detail-divider" />

      <div className="extended-item-card-body">
        <div className="form-field">
          <label htmlFor="location-search" className="form-label">
            SEARCH PLACES
          </label>

          <div className="extended-item-search-row">
            <div className="extended-item-search-input-shell">
              <Search
                size={16}
                aria-hidden="true"
                className="extended-item-search-icon"
              />
              <input
                id="location-search"
                type="text"
                className="form-input-with-icon"
                value={itemTitle || ""}
                readOnly
                placeholder="Search for a place..."
              />
            </div>

            <button
              type="button"
              className="bucketlist-primary-action extended-item-search-button"
              disabled
            >
              Search
            </button>
          </div>

          <p className="form-helper-text">
            This will use the item title as a starting point when place search is
            connected.
          </p>
        </div>

        <div className="extended-item-placeholder-grid">
          <div className="extended-item-placeholder-panel">
            <div className="extended-item-placeholder-heading">
              <Sparkles size={14} aria-hidden="true" />
              <span>Suggested places</span>
            </div>

            <div className="extended-item-placeholder-list">
              <div className="extended-item-placeholder-card extended-item-placeholder-card-active">
                <p className="extended-item-placeholder-card-title">
                  Example venue result
                </p>
                <p className="extended-item-placeholder-card-copy">
                  Search results will appear here once the places integration is
                  connected.
                </p>
              </div>

              <div className="extended-item-placeholder-card">
                <p className="extended-item-placeholder-card-title">
                  Another suggested place
                </p>
                <p className="extended-item-placeholder-card-copy">
                  Address, ratings, and maps links can live in this area later.
                </p>
              </div>
            </div>
          </div>

          <div className="extended-item-placeholder-panel">
            <div className="extended-item-placeholder-heading">
              <MapPin size={14} aria-hidden="true" />
              <span>Map preview</span>
            </div>

            <div className="extended-item-map-placeholder">
              <p className="extended-item-map-placeholder-title">
                Map preview coming soon
              </p>
              <p className="extended-item-map-placeholder-copy">
                Selected place details and embedded map preview will appear here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}