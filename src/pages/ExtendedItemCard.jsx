import { useState, useEffect } from "react";

const COLORS = {
    primary: "#6B4EAA",
    accent: "#FF5A5F",
    border: "#A78BFA",
    bodyText: "#0F172A",
    mutedText: "#6B6880",
    surface: "#EEEAF7",
    background: "#F7F6FB",
    white: "#FFFFFF",
};

const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

const StarIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
);
const MapPinIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
);
const SearchIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
);
const ExternalLinkIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
);
const ChevronDownIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"/>
    </svg>
);

async function searchPlaces(query) {
    const response = await fetch(
        "https://places.googleapis.com/v1/places:searchText",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": API_KEY,
                "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.googleMapsUri,places.id",
            },
            body: JSON.stringify({ textQuery: query }),
        }
    );
    if (!response.ok) throw new Error("Failed to fetch places");
    const data = await response.json();
    return data.places ?? [];
}

function PlaceCard({ place, isSelected, onSelect }) {
    const name = place.displayName?.text ?? "Unknown place";
    const address = place.formattedAddress ?? "";
    const rating = place.rating;
    const ratingCount = place.userRatingCount;
    const mapsUrl = place.googleMapsUri;

    return (
        <div
            onClick={onSelect}
            style={{
                background: isSelected ? COLORS.surface : "rgba(255,255,255,0.7)",
                border: `1px solid ${isSelected ? COLORS.primary : "#E2DAF5"}`,
                borderRadius: "12px",
                padding: "14px 16px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: isSelected ? `0 0 0 2px ${COLORS.primary}22` : "0 1px 4px rgba(107,78,170,0.04)",
            }}
        >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                        margin: "0 0 4px",
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: "14px", fontWeight: "600",
                        color: isSelected ? COLORS.primary : COLORS.bodyText,
                        lineHeight: "1.3",
                    }}>
                        {name}
                    </p>
                    {address && (
                        <p style={{
                            margin: "0 0 8px", fontSize: "12px",
                            color: COLORS.mutedText, lineHeight: "1.5",
                            display: "flex", alignItems: "flex-start", gap: "4px",
                        }}>
                            <span style={{ marginTop: "2px", flexShrink: 0 }}><MapPinIcon /></span>
                            {address}
                        </p>
                    )}
                    {rating && (
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <span style={{ color: "#F59E0B" }}><StarIcon /></span>
                            <span style={{ fontSize: "12px", fontWeight: "600", color: COLORS.bodyText }}>
                                {rating.toFixed(1)}
                            </span>
                            {ratingCount && (
                                <span style={{ fontSize: "11px", color: COLORS.mutedText }}>
                                    ({ratingCount.toLocaleString()} reviews)
                                </span>
                            )}
                        </div>
                    )}
                </div>
                {mapsUrl && (
                    <a href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open in Google Maps"
                        onClick={e => e.stopPropagation()}
                        style={{
                            flexShrink: 0,
                            display: "inline-flex", alignItems: "center", gap: "4px",
                            background: COLORS.surface, color: COLORS.primary,
                            border: `1px solid ${COLORS.border}`,
                            fontSize: "11px", fontWeight: "600",
                            padding: "4px 10px", borderRadius: "20px",
                            textDecoration: "none", transition: "background 0.15s ease",
                            whiteSpace: "nowrap",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#DDD4F5"}
                        onMouseLeave={e => e.currentTarget.style.background = COLORS.surface}
                    >
                        <ExternalLinkIcon /> Maps
                    </a>
                )}
            </div>
        </div>
    );
}

function MapPreview({ placeName }) {
    const encodedQuery = encodeURIComponent(placeName);
    const src = `https://www.google.com/maps/embed/v1/search?key=${API_KEY}&q=${encodedQuery}`;
    return (
        <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #E2DAF5" }}>
            <iframe
                title={`Map of ${placeName}`}
                src={src}
                width="100%"
                height="400"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
        </div>
    );
}

export default function ExtendedItemCard({ itemTitle }) {
    const [query, setQuery] = useState("");
    const [places, setPlaces] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [isResultsOpen, setIsResultsOpen] = useState(false);

    useEffect(() => {
        if (!itemTitle) return;
        setQuery(itemTitle);
        runSearch(itemTitle);
    }, [itemTitle]);

    const runSearch = async (searchQuery) => {
        if (!searchQuery?.trim()) return;
        setIsLoading(true);
        setError("");
        setHasSearched(true);
        setSelectedPlace(null);
        try {
            const results = await searchPlaces(searchQuery);
            setPlaces(results);
            if (results.length > 0) setSelectedPlace(results[0]);
        } catch (err) {
            setError("Could not load suggestions. Check your API key or try again.");
            setPlaces([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => runSearch(query);
    const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };

    const resultCount = places.length;
    const accordionLabel = isLoading
        ? "Searching..."
        : hasSearched && resultCount > 0
            ? `${resultCount} result${resultCount === 1 ? "" : "s"} found`
            : hasSearched
                ? "No results found"
                : "Results will appear here";

    return (
        <div style={{
            background: COLORS.background,
            border: "1px solid #E2DAF5",
            borderRadius: "16px",
            padding: "24px",
            marginTop: "16px",
        }}>
            {/* Header */}
            <p style={{
                margin: "0 0 16px",
                fontSize: "11px", fontWeight: "700",
                textTransform: "uppercase", letterSpacing: "0.08em",
                color: COLORS.mutedText,
            }}>
                Location Suggestions
            </p>

            {/* Search input — always visible */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                <div style={{ flex: 1, position: "relative" }}>
                    <div style={{
                        position: "absolute", left: "12px", top: "50%",
                        transform: "translateY(-50%)", color: COLORS.mutedText,
                        pointerEvents: "none",
                    }}>
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search for a place..."
                        style={{
                            width: "100%",
                            padding: "10px 12px 10px 34px",
                            borderRadius: "12px",
                            border: "1px solid #E2DAF5",
                            background: COLORS.white,
                            fontSize: "13px",
                            color: COLORS.bodyText,
                            fontFamily: "'Inter', sans-serif",
                            outline: "none",
                            boxSizing: "border-box",
                            transition: "border-color 0.2s ease",
                        }}
                        onFocus={e => e.target.style.borderColor = COLORS.border}
                        onBlur={e => e.target.style.borderColor = "#E2DAF5"}
                    />
                </div>
                <button
                    type="button"
                    onClick={handleSearch}
                    disabled={isLoading}
                    style={{
                        flexShrink: 0,
                        display: "inline-flex", alignItems: "center", gap: "5px",
                        background: COLORS.primary, color: COLORS.white,
                        border: "none", borderRadius: "12px",
                        padding: "10px 16px", fontSize: "13px", fontWeight: "600",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        opacity: isLoading ? 0.6 : 1,
                        transition: "opacity 0.15s ease",
                        fontFamily: "'Inter', sans-serif",
                    }}
                >
                    <SearchIcon />
                    {isLoading ? "Searching..." : "Search"}
                </button>
            </div>

            {/* Accordion toggle — appears after first search */}
            {(hasSearched || isLoading) && (
                <div>
                    <button
                        type="button"
                        onClick={() => setIsResultsOpen(p => !p)}
                        style={{
                            width: "100%",
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "10px 14px",
                            background: COLORS.white,
                            border: "1px solid #E2DAF5",
                            borderRadius: isResultsOpen ? "12px 12px 0 0" : "12px",
                            cursor: "pointer",
                            fontFamily: "'Inter', sans-serif",
                            transition: "all 0.2s ease",
                        }}
                    >
                        <span style={{ fontSize: "13px", fontWeight: "600", color: COLORS.bodyText }}>
                            {accordionLabel}
                        </span>
                        <span style={{
                            color: COLORS.mutedText,
                            transform: isResultsOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s ease",
                            display: "flex",
                        }}>
                            <ChevronDownIcon />
                        </span>
                    </button>

                    {/* Accordion body */}
                    {isResultsOpen && (
                        <div style={{
                            border: "1px solid #E2DAF5",
                            borderTop: "none",
                            borderRadius: "0 0 12px 12px",
                            padding: "12px",
                            background: COLORS.white,
                        }}>
                            {/* Loading spinner */}
                            {isLoading && (
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: COLORS.mutedText, fontSize: "13px", padding: "8px 0" }}>
                                    <div style={{
                                        width: "16px", height: "16px", borderRadius: "50%",
                                        border: "2px solid #E2DAF5",
                                        borderTopColor: COLORS.primary,
                                        animation: "spin 0.7s linear infinite",
                                    }} />
                                    Finding places...
                                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                                </div>
                            )}

                            {/* Error */}
                            {!isLoading && error && (
                                <p style={{ margin: 0, fontSize: "13px", color: COLORS.accent, fontStyle: "italic", padding: "8px 0" }}>
                                    {error}
                                </p>
                            )}

                            {/* No results */}
                            {!isLoading && !error && hasSearched && places.length === 0 && (
                                <p style={{ margin: 0, fontSize: "13px", color: COLORS.mutedText, fontStyle: "italic", padding: "8px 0" }}>
                                    No places found. Try a different search.
                                </p>
                            )}

                            {/* Results left, map right */}
                            {!isLoading && places.length > 0 && (
                                <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: "12px",
                                    alignItems: "flex-start",
                                }}>
                                    {/* Results list */}
                                    <div style={{
                                        flex: "0 0 40%",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "8px",
                                        maxHeight: "400px",
                                        overflowY: "auto",
                                    }}>
                                        {places.map((place) => (
                                            <PlaceCard
                                                key={place.id}
                                                place={place}
                                                isSelected={selectedPlace?.id === place.id}
                                                onSelect={() => setSelectedPlace(place)}
                                            />
                                        ))}
                                    </div>

                                    {/* Map preview */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        {selectedPlace && (
                                            <MapPreview placeName={selectedPlace.displayName?.text ?? query} />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
