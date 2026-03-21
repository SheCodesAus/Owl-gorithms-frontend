import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Search, Loader2, ExternalLink, MapPin, Tag,
  BookOpen, ChevronDown, X, Landmark, Utensils, Sparkles,
  Star,
} from "lucide-react";

// ── API helpers ───────────────────────────────────────────────────────────────

async function fetchWikiData(query, signal) {
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=1&format=json&origin=*`;
  const searchRes = await fetch(searchUrl, { signal });
  const searchData = await searchRes.json();
  const topResult = searchData.query?.search?.[0];
  if (!topResult) return null;

  const pageUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|links|coordinates&exintro&explaintext&exsentences=4&pllimit=12&pageids=${topResult.pageid}&format=json&origin=*`;
  const pageRes = await fetch(pageUrl, { signal });
  const pageData = await pageRes.json();
  const page = pageData.query?.pages?.[topResult.pageid];
  if (!page) return null;

  const related = (page.links ?? [])
    .map((l) => l.title)
    .filter((t) => !t.includes(":") && t !== topResult.title)
    .slice(0, 8);

  const coords = page.coordinates?.[0] ?? null;

  return {
    title: page.title,
    summary: page.extract ?? "",
    related,
    coords,
    wikiUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
  };
}

async function fetchPlaces(query, coords, tab, signal) {
  if (tab === "food") {
    // Overpass for restaurants/cafes near the coordinates
    const lat = coords?.lat ?? 0;
    const lon = coords?.lon ?? 0;
    const radius = 3000;
    const overpassQuery = `[out:json];node["amenity"~"restaurant|cafe"](around:${radius},${lat},${lon});out 8;`;
    const res = await fetch(
      `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`,
      { signal }
    );
    const data = await res.json();
    return (data.elements ?? [])
      .filter((el) => el.tags?.name)
      .map((el) => ({
        name: el.tags.name,
        type: el.tags.cuisine
          ? el.tags.cuisine.charAt(0).toUpperCase() + el.tags.cuisine.slice(1)
          : "Restaurant",
        lat: el.lat,
        lon: el.lon,
        externalUrl: `https://www.google.com/search?q=${encodeURIComponent(el.tags.name + " " + query)}`,
      }));
  } else {
    // Wikipedia geosearch for attractions near coords
    if (!coords) return [];
    const wikiGeoUrl = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${coords.lat}|${coords.lon}&gsradius=10000&gslimit=8&format=json&origin=*`;
    const res = await fetch(wikiGeoUrl, { signal });
    const data = await res.json();
    const places = data.query?.geosearch ?? [];

    if (!places.length) return [];

    const pageIds = places.map((p) => p.pageid).join("|");
    const detailUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=coordinates|extracts&exintro&explaintext&exsentences=1&pageids=${pageIds}&format=json&origin=*`;
    const detailRes = await fetch(detailUrl, { signal });
    const detailData = await detailRes.json();

    return places.map((place) => {
      const page = detailData.query?.pages?.[place.pageid];
      return {
        name: place.title,
        type: "Attraction",
        desc: page?.extract ?? "",
        lat: place.lat,
        lon: place.lon,
        externalUrl: `https://en.wikipedia.org/?curid=${place.pageid}`,
      };
    });
  }
}

// ── OSM Embed URL ─────────────────────────────────────────────────────────────

function buildOsmEmbedUrl(lat, lon, zoom = 14) {
  const delta = 0.01 * Math.pow(2, 14 - zoom);
  const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
}

// ── MapOverlay ────────────────────────────────────────────────────────────────

// ── MapOverlay ────────────────────────────────────────────────────────────────

function MapHeader({ place, onClose }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--dividers)] bg-white/95 px-4 py-3 backdrop-blur-sm">
      <div className="flex min-w-0 items-center gap-2">
        <MapPin size={15} className="shrink-0 text-[var(--primary-cta)]" />
        <p className="truncate text-sm font-semibold text-[var(--heading-text)]">
          {place.name}
        </p>
        {place.type && (
          <span className="shrink-0 rounded-full bg-[var(--surface)] px-2.5 py-0.5 text-xs font-medium text-[var(--muted-text)]">
            {place.type}
          </span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <a
          href={place.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[var(--dividers)] bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--primary-cta)] transition hover:bg-white"
        >
          <ExternalLink size={11} />
          More info
        </a>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[var(--dividers)] bg-white text-[var(--muted-text)] transition hover:bg-[var(--surface)]"
          aria-label="Close map"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

function MapOverlay({ place, onClose, isMobile }) {
  const embedUrl = buildOsmEmbedUrl(place.lat, place.lon);

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Blurred backdrop — tap to close */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Map card — always centred in viewport, never larger than screen */}
      <motion.div
        className="relative z-10 flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_rgba(39,16,76,0.28)]"
        style={{
          width: isMobile ? "100%" : "min(560px, calc(100vw - 2rem))",
          maxHeight: "calc(100vh - 4rem)",
        }}
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      >
        <MapHeader place={place} onClose={onClose} />
        <div className="overflow-hidden" style={{ height: isMobile ? "60vh" : "420px" }}>
          <iframe
            key={embedUrl}
            title={`Map of ${place.name}`}
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, display: "block" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

// ── PlaceCard ─────────────────────────────────────────────────────────────────

function PlaceCard({ place, onOpenMap }) {
  return (
    <motion.div
      layout
      className="extended-item-placeholder-card group cursor-pointer transition-all hover:border-[var(--primary-cta)]/30 hover:shadow-[0_4px_16px_rgba(107,78,170,0.1)]"
      onClick={() => onOpenMap(place)}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="extended-item-placeholder-card-title line-clamp-1 text-sm">
            {place.name}
          </p>
          {place.type && (
            <p className="mt-0.5 text-xs text-[var(--muted-text)]">{place.type}</p>
          )}
          {place.desc && (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--muted-text)]">
              {place.desc}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onOpenMap(place); }}
          className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-[var(--dividers)] bg-[var(--surface-soft)] px-2.5 py-1.5 text-xs font-semibold text-[var(--primary-cta)] opacity-0 transition group-hover:opacity-100 hover:bg-white"
        >
          <MapPin size={10} />
          Map
        </button>
      </div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ExtendedItemCard({ itemTitle, isMobileOverlay = false }) {
  const [searchQuery, setSearchQuery]   = useState(itemTitle ?? "");
  const [isLoading, setIsLoading]       = useState(false);
  const [hasSearched, setHasSearched]   = useState(false);
  const [wikiData, setWikiData]         = useState(null);
  const [places, setPlaces]             = useState([]);
  const [activeTab, setActiveTab]       = useState("attractions");
  const [aboutExpanded, setAboutExpanded] = useState(true);
  const [mapPlace, setMapPlace]         = useState(null);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);

  const abortRef = useRef(null);
  const placesAbortRef = useRef(null);

  const runSearch = async (query) => {
    if (!query?.trim()) return;
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    setIsLoading(true);
    setHasSearched(true);
    setWikiData(null);
    setPlaces([]);
    setMapPlace(null);

    try {
      const wiki = await fetchWikiData(query, signal);
      if (!signal.aborted) {
        setWikiData(wiki);
        // Auto-fetch attractions once we have coords
        if (wiki?.coords) {
          loadPlaces(query, wiki.coords, "attractions", signal);
        }
      }
    } catch (err) {
      if (err.name !== "AbortError") console.error(err);
    } finally {
      if (!signal.aborted) setIsLoading(false);
    }
  };

  const loadPlaces = async (query, coords, tab, parentSignal) => {
    placesAbortRef.current?.abort();
    placesAbortRef.current = new AbortController();
    const signal = placesAbortRef.current.signal;

    setIsLoadingPlaces(true);
    setPlaces([]);

    try {
      const results = await fetchPlaces(query, coords, tab, signal);
      if (!signal.aborted && !parentSignal?.aborted) setPlaces(results);
    } catch (err) {
      if (err.name !== "AbortError") console.error(err);
    } finally {
      if (!signal.aborted) setIsLoadingPlaces(false);
    }
  };

  // Auto-search on mount
  useEffect(() => {
    if (itemTitle) {
      setSearchQuery(itemTitle);
      runSearch(itemTitle);
    }
    return () => {
      abortRef.current?.abort();
      placesAbortRef.current?.abort();
    };
  }, [itemTitle]);

  // Reload places when tab changes
  useEffect(() => {
    if (wikiData?.coords && hasSearched) {
      loadPlaces(searchQuery, wikiData.coords, activeTab);
    }
  }, [activeTab]);

  const hasResults = wikiData || places.length > 0;

  return (
    <section className="extended-item-card relative">
      <AnimatePresence>
        {mapPlace && (
          <MapOverlay
            place={mapPlace}
            onClose={() => setMapPlace(null)}
            isMobile={isMobileOverlay}
          />
        )}
      </AnimatePresence>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="extended-item-card-header">
        <div className="extended-item-card-title-wrap">
          <p className="extended-item-card-eyebrow">Explore Idea</p>
          <h3 className="extended-item-card-title">
            {wikiData?.title ?? itemTitle}
          </h3>
          {wikiData && (
            <p className="extended-item-card-description">
              Wikipedia · OpenStreetMap
            </p>
          )}
        </div>
        <div className="extended-item-card-icon-shell">
          <Globe size={18} />
        </div>
      </div>

      <div className="item-detail-divider" />

      <div className="extended-item-card-body">

        {/* ── Search bar ───────────────────────────────────────────────────── */}
        <div className="extended-item-search-row">
          <div className="extended-item-search-input-shell">
            <Search size={15} className="extended-item-search-icon" />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: "2.5rem" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSearch(searchQuery)}
              placeholder="Search a place or activity…"
            />
          </div>
          <button
            type="button"
            className="primary-gradient-button inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold extended-item-search-button"
            onClick={() => runSearch(searchQuery)}
            disabled={isLoading}
          >
            {isLoading
              ? <Loader2 size={15} className="animate-spin" />
              : <Search size={15} />}
            {isLoading ? "Searching…" : "Search"}
          </button>
        </div>

        {/* ── Loading ──────────────────────────────────────────────────────── */}
        {isLoading && (
          <div className="flex items-center justify-center gap-3 py-10 text-sm text-[var(--muted-text)]">
            <Loader2 size={18} className="animate-spin text-[var(--primary-cta)]" />
            Exploring this idea…
          </div>
        )}

        {/* ── Empty state ──────────────────────────────────────────────────── */}
        {!isLoading && !hasResults && (
          <div className="extended-item-map-placeholder">
            <Globe size={28} className="mb-3 text-[var(--primary-cta)] opacity-40" />
            <p className="extended-item-map-placeholder-title text-sm">
              {hasSearched ? `No results for "${searchQuery}"` : "Explore this idea"}
            </p>
            <p className="extended-item-map-placeholder-copy">
              {hasSearched
                ? "Try a shorter or more specific search term."
                : "Search to discover context, related topics and locations."}
            </p>
          </div>
        )}

        {/* ── Results ──────────────────────────────────────────────────────── */}
        {!isLoading && hasResults && (
          <div className="flex flex-col gap-5">

            {/* About — collapsible */}
            {wikiData?.summary && (
              <div className="extended-item-placeholder-panel">
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center justify-between gap-3"
                  onClick={() => setAboutExpanded((p) => !p)}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen size={14} className="text-[var(--primary-cta)]" />
                    <p className="extended-item-placeholder-heading mb-0">About</p>
                  </div>
                  <motion.span
                    animate={{ rotate: aboutExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-[var(--muted-text)]"
                  >
                    <ChevronDown size={15} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {aboutExpanded && (
                    <motion.div
                      key="about"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 text-sm leading-relaxed text-[var(--body-text)]">
                        {wikiData.summary}
                      </p>
                      <a
                        href={wikiData.wikiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--primary-cta)] transition hover:underline"
                      >
                        <ExternalLink size={11} />
                        Full article on Wikipedia
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Tabs */}
            <div>
              <div className="mb-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("attractions")}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                    activeTab === "attractions"
                      ? "primary-gradient-button"
                      : "secondary-modal-button"
                  }`}
                >
                  <Landmark size={14} />
                  Attractions
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("food")}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                    activeTab === "food"
                      ? "primary-gradient-button"
                      : "secondary-modal-button"
                  }`}
                >
                  <Utensils size={14} />
                  Food
                </button>
              </div>

              {/* Place results */}
              {isLoadingPlaces && (
                <div className="flex items-center gap-2 py-6 text-sm text-[var(--muted-text)]">
                  <Loader2 size={15} className="animate-spin text-[var(--primary-cta)]" />
                  Finding places…
                </div>
              )}

              {!isLoadingPlaces && places.length === 0 && hasSearched && (
                <p className="py-4 text-sm italic text-[var(--muted-text)]">
                  No {activeTab === "food" ? "restaurants" : "attractions"} found nearby.
                </p>
              )}

              {!isLoadingPlaces && places.length > 0 && (
                <div className="extended-item-placeholder-list">
                  {places.map((place, i) => (
                    <PlaceCard
                      key={i}
                      place={place}
                      onOpenMap={setMapPlace}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Related topics */}
            {wikiData?.related?.length > 0 && (
              <div>
                <div className="extended-item-placeholder-heading">
                  <Sparkles size={13} />
                  <span>Related topics</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {wikiData.related.map((topic) => (
                    <a
                      key={topic}
                      href={`https://en.wikipedia.org/wiki/${encodeURIComponent(topic)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-[var(--dividers)] bg-white/70 px-3 py-1.5 text-xs font-medium text-[var(--heading-text)] transition hover:border-[var(--primary-cta)] hover:text-[var(--primary-cta)] hover:bg-white"
                    >
                      {topic}
                    </a>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </section>
  );
}