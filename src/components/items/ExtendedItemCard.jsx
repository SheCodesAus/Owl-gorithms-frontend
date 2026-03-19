import { MapPin, Search, Sparkles, Globe, Loader2, ExternalLink, Utensils, Landmark } from "lucide-react";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- Leaflet Icon Fix (Required for React) ---
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to move the map
function RecenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView(coords, 14);
  }, [coords, map]);
  return null;
}

export default function ExtendedItemCard({ itemTitle }) {
  const [activeTab, setActiveTab] = useState("attractions");
  const [searchQuery, setSearchQuery] = useState(itemTitle || "");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mapCoords, setMapCoords] = useState([51.505, -0.09]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);

    try {
      // 1. Geocode the current searchQuery to get coordinates
      const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`;
      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();

      if (geoData.length > 0) {
        const lat = parseFloat(geoData[0].lat);
        const lon = parseFloat(geoData[0].lon);
        setMapCoords([lat, lon]);

        if (activeTab === "food") {
          // 2a. FOOD: Use Overpass API for real local businesses
          const overpassQuery = `[out:json];node["amenity"~"restaurant|cafe|fast_food|pub"](around:2000,${lat},${lon});out 15;`;
          const overpassRes = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
          const overpassData = await overpassRes.json();

          const formattedFood = overpassData.elements
            .filter(el => el.tags && el.tags.name)
            .map(el => ({
              title: el.tags.name,
              desc: `${el.tags.cuisine ? el.tags.cuisine.charAt(0).toUpperCase() + el.tags.cuisine.slice(1) : "Local"} ${el.tags.amenity.replace('_', ' ')}`,
              link: `https://www.google.com/search?q=${encodeURIComponent(el.tags.name + " " + searchQuery)}`
            }));
          setResults(formattedFood);

        } else {
          // 2b. ATTRACTIONS: Use Wikipedia Geosearch for landmarks
          const wikiGeoUrl = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lon}&gsradius=10000&gslimit=12&format=json&origin=*`;
          const wikiGeoRes = await fetch(wikiGeoUrl);
          const wikiGeoData = await wikiGeoRes.json();

          if (wikiGeoData.query?.geosearch) {
            const places = wikiGeoData.query.geosearch;
            const pageIds = places.map(p => p.pageid).join('|');
            const detailsUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&exsentences=2&pageids=${pageIds}&format=json&origin=*`;
            const detailsRes = await fetch(detailsUrl);
            const detailsData = await detailsRes.json();

            const formattedWiki = places.map(place => ({
              title: place.title,
              desc: detailsData.query.pages[place.pageid]?.extract || "Landmark or historic site.",
              link: `https://en.wikipedia.org/?curid=${place.pageid}`,
            }));
            setResults(formattedWiki);
          }
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync searchQuery with itemTitle ONLY when itemTitle changes (initial load or new item selected)
  useEffect(() => {
    if (itemTitle) {
      setSearchQuery(itemTitle);
    }
  }, [itemTitle]);

  // Trigger search when Tab changes, but use the current state of searchQuery
  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    }
  }, [activeTab]);

  return (
    <section className="extended-item-card">
      <div className="extended-item-card-header">
        <div className="extended-item-card-title-wrap">
          <p className="extended-item-card-eyebrow">Explore Idea</p>
          <h2 className="extended-item-card-title">{itemTitle}</h2>
        </div>
        <div className="extended-item-card-icon-shell"><Globe size={18} /></div>
      </div>

      <div className="item-detail-divider" />

      <div className="extended-item-card-body">
        <div className="form-field">
          {/* Search Row */}
          <div className="extended-item-search-row" style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search 
                size={16} 
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', zIndex: 5 }} 
              />
              <input
                type="text"
                className="form-input" 
                style={{ paddingLeft: '42px', width: '100%' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button 
              onClick={handleSearch}
              className="primary-gradient-button rounded-2xl px-6 py-2 text-sm font-semibold"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Search"}
            </button>
          </div>

          {/* Tab Selection Row */}
          <div className="flex gap-3 mb-2">
            <button
              onClick={() => setActiveTab("attractions")}
              className={activeTab === "attractions" 
                ? "primary-gradient-button rounded-2xl px-5 py-2 text-sm font-semibold flex items-center gap-2" 
                : "secondary-modal-button rounded-2xl px-5 py-2 text-sm font-semibold flex items-center gap-2"
              }
            >
              <Landmark size={16} /> Attractions
            </button>
            <button
              onClick={() => setActiveTab("food")}
              className={activeTab === "food" 
                ? "primary-gradient-button rounded-2xl px-5 py-2 text-sm font-semibold flex items-center gap-2" 
                : "secondary-modal-button rounded-2xl px-5 py-2 text-sm font-semibold flex items-center gap-2"
              }
            >
              <Utensils size={16} /> Food
            </button>
          </div>
        </div>

        <div className="extended-item-placeholder-grid">
          {/* Results Column */}
          <div className="extended-item-placeholder-panel">
            <div className="extended-item-placeholder-heading">
              <Sparkles size={14} /> <span>{activeTab === "food" ? "Local Restaurants" : "Nearby Landmarks"}</span>
            </div>

            <div className="extended-item-placeholder-list" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              {results.length > 0 ? (
                results.map((item, i) => (
                  <div 
                    key={i} 
                    className="extended-item-placeholder-card hover:bg-slate-50 transition-colors"
                    onClick={() => window.open(item.link, '_blank')}
                    style={{ cursor: 'pointer', marginBottom: '12px', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  >
                    <div className="flex justify-between items-start">
                        <p className="font-semibold text-sm">{item.title}</p>
                        <ExternalLink size={12} className="text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.desc}</p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-gray-400">
                    {isLoading ? "Fetching data..." : `No ${activeTab} found for this location.`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Map Column */}
          <div className="extended-item-placeholder-panel">
            <div className="extended-item-placeholder-heading">
              <MapPin size={14} /> <span>Location Preview</span>
            </div>
            <div style={{ height: '420px', width: '100%', borderRadius: '1.5rem', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
              <MapContainer center={mapCoords} zoom={14} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={mapCoords} />
                <RecenterMap coords={mapCoords} />
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}