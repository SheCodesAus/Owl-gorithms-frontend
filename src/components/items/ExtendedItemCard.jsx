import { MapPin, Search, Sparkles, Globe, Loader2, ExternalLink, Utensils, Landmark } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function RecenterMap({ coords, activeTab, isCountry }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords[0] !== 0) {
      const zoomLevel = isCountry ? 6 : (activeTab === "food" ? 15 : 12);
      map.setView(coords, zoomLevel);
    }
  }, [coords, map, activeTab, isCountry]);
  return null;
}

export default function ExtendedItemCard({ itemTitle }) {
  const [activeTab, setActiveTab] = useState("attractions");
  const [searchQuery, setSearchQuery] = useState(itemTitle || "");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mapCoords, setMapCoords] = useState([0, 0]); 
  const [isCountry, setIsCountry] = useState(false);
  
  const clickTimer = useRef(null);
  const abortControllerRef = useRef(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setResults([]); 

    try {
      const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`;
      const geoRes = await fetch(geoUrl, { signal: abortControllerRef.current.signal });
      const geoData = await geoRes.json();

      if (geoData.length > 0) {
        const lat = parseFloat(geoData[0].lat);
        const lon = parseFloat(geoData[0].lon);
        const isCountryResult = geoData[0].type === "administrative" || geoData[0].addresstype === "country";
        
        setIsCountry(isCountryResult);
        setMapCoords([lat, lon]);

        if (activeTab === "food") {
          const radius = isCountryResult ? 50000 : 3000;
          const overpassQuery = `[out:json];node["amenity"~"restaurant|cafe"](around:${radius},${lat},${lon});out 25;`;
          const overpassRes = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`, { signal: abortControllerRef.current.signal });
          const overpassData = await overpassRes.json();

          const formattedFood = (overpassData.elements || [])
            .filter(el => el.tags && el.tags.name)
            .map(el => ({
              title: el.tags.name,
              desc: `${el.tags.cuisine ? el.tags.cuisine.charAt(0).toUpperCase() + el.tags.cuisine.slice(1) : "Local"} ${el.tags.amenity}`,
              link: `https://www.google.com/search?q=${encodeURIComponent(el.tags.name + " " + searchQuery)}`,
              lat: el.lat,
              lon: el.lon
            }));
          setResults(formattedFood);

        } else {
          const wikiGeoUrl = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lon}&gsradius=10000&gslimit=20&format=json&origin=*`;
          const wikiGeoRes = await fetch(wikiGeoUrl, { signal: abortControllerRef.current.signal });
          const wikiGeoData = await wikiGeoRes.json();
          let places = wikiGeoData.query?.geosearch || [];

          if (places.length < 5) {
            const wikiSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery + " world heritage")}&srlimit=15&format=json&origin=*`;
            const wikiSearchRes = await fetch(wikiSearchUrl, { signal: abortControllerRef.current.signal });
            const wikiSearchData = await wikiSearchRes.json();
            places = (wikiSearchData.query?.search || []).map(p => ({ pageid: p.pageid, title: p.title }));
          }

          if (places.length > 0) {
            const pageIds = places.map(p => p.pageid).join('|');
            const detailsUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=coordinates|extracts&exintro&explaintext&exsentences=2&pageids=${pageIds}&format=json&origin=*`;
            const detailsRes = await fetch(detailsUrl, { signal: abortControllerRef.current.signal });
            const detailsData = await detailsRes.json();

            const formattedWiki = places.map(place => {
              const page = detailsData.query.pages[place.pageid];
              return {
                title: place.title,
                desc: page?.extract || "Tourist attraction.",
                link: `https://en.wikipedia.org/?curid=${place.pageid}`,
                lat: page?.coordinates?.[0]?.lat || null,
                lon: page?.coordinates?.[0]?.lon || null
              };
            });
            setResults(formattedWiki);
          } else {
            setResults([]);
          }
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Search error:", error);
        setResults([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (item) => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      window.open(item.link, '_blank');
    } else {
      clickTimer.current = setTimeout(() => {
        if (item.lat && item.lon) {
          setIsCountry(false);
          setMapCoords([item.lat, item.lon]);
        }
        clickTimer.current = null;
      }, 300);
    }
  };

  useEffect(() => {
    if (itemTitle) {
      setSearchQuery(itemTitle);
      handleSearch();
    }
  }, [itemTitle]);

  useEffect(() => {
    if (searchQuery) handleSearch();
  }, [activeTab]);

  return (
    <section className="extended-item-card">
      <div className="extended-item-card-header">
        <div className="extended-item-card-title-wrap">
          <p className="extended-item-card-eyebrow">Explore Idea</p>
        </div>
        <div className="extended-item-card-icon-shell"><Globe size={18} /></div>
      </div>

      <div className="item-detail-divider" />

      <div className="extended-item-card-body">
        <div className="form-field">
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

          <div className="flex gap-3 mb-2">
            <button
              onClick={() => setActiveTab("attractions")}
              className={activeTab === "attractions" ? "primary-gradient-button rounded-2xl px-5 py-2 text-sm font-semibold flex items-center gap-2" : "secondary-modal-button rounded-2xl px-5 py-2 text-sm font-semibold flex items-center gap-2"}
            >
              <Landmark size={16} /> Attractions
            </button>
            <button
              onClick={() => setActiveTab("food")}
              className={activeTab === "food" ? "primary-gradient-button rounded-2xl px-5 py-2 text-sm font-semibold flex items-center gap-2" : "secondary-modal-button rounded-2xl px-5 py-2 text-sm font-semibold flex items-center gap-2"}
            >
              <Utensils size={16} /> Food
            </button>
          </div>
        </div>

        <div className="extended-item-placeholder-grid">
          <div className="extended-item-placeholder-panel">
            <div className="extended-item-placeholder-heading">
              <Sparkles size={14} /> <span>{activeTab === "food" ? "Restaurants" : "Landmarks"}</span>
            </div>

            <div className="extended-item-placeholder-list" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              {results.length > 0 ? (
                results.map((item, i) => (
                  <div 
                    key={i} 
                    className="extended-item-placeholder-card hover:bg-slate-50 transition-all active:scale-[0.98] select-none"
                    onClick={() => handleResultClick(item)}
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
                <div className="p-8 text-center text-gray-400">
                  {isLoading ? <Loader2 size={24} className="animate-spin mx-auto mb-2" /> : "No results found."}
                </div>
              )}
            </div>
          </div>

          <div className="extended-item-placeholder-panel">
            <div className="extended-item-placeholder-heading">
              <MapPin size={14} /> <span>{isCountry ? "Map" : "Map"}</span>
            </div>
            <div style={{ height: '420px', width: '100%', borderRadius: '1.5rem', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
              <MapContainer center={mapCoords} zoom={isCountry ? 6 : 12} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={mapCoords} />
                <RecenterMap coords={mapCoords} activeTab={activeTab} isCountry={isCountry} />
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}