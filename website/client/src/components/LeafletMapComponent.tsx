import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Set up default icon and fix Leaflet's default icon path issues
// We're using simple divIcons for colored dots

// Helper to determine color based on speed
const getMarkerColor = (speed: number) => {
  if (speed >= 50) return '#10B981'; // Green (Fast)
  if (speed >= 25) return '#FBBF24'; // Yellow (Medium)
  return '#EF4444'; // Red (Slow)
};

const createCustomIcon = (speed: number) => {
  const color = getMarkerColor(speed);
  return L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="
      background-color: ${color};
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
  });
};

interface MapLocation {
  name: string;
  lat: number;
  lng: number;
  description: string;
  wifiSpeed: number;
  imageUrl: string;
  id?: string;
  address?: string;
  phone?: string;
  openingHours?: string;
  websiteUri?: string;
  onViewDetails?: () => void;
  overallScore?: number;
  parkingScore?: number;
  priceLevel?: number; // 1-4 scale usually
  speedMetrics?: {
    min: number;
    max: number;
    mean: number;
  };
}

interface LeafletMapComponentProps {
  locations: MapLocation[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

const LeafletMapComponent = ({
  locations,
  center = { lat: -34.0789, lng: 18.8429 }, // Default center for Somerset West
  zoom = 13
}: LeafletMapComponentProps) => {
  const [isClient, setIsClient] = useState(false);

  // This is needed for Leaflet to work with SSR/SSG
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-tech-blue mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-700">Loading map...</p>
        </div>
      </div>
    );
  }

  // Helper to render star rating
  const renderStars = (score: number) => {
    return (
      <span className="text-yellow-500 text-xs">
        {Array(5).fill(0).map((_, i) => (
          <i key={i} className={`fas fa-star ${i < Math.floor(score) ? '' : 'text-gray-300'}`}></i>
        ))}
      </span>
    );
  };

  // Helper for price level
  const renderPrice = (level: number = 2) => {
    let val = Number(level);
    if (isNaN(val)) val = 2;
    const safeLevel = Math.max(0, Math.min(Math.floor(val), 4));
    return (
      <span className="text-green-600 font-medium text-xs">
        {Array(safeLevel).fill('$').join('')}
        <span className="text-gray-300">{Array(4 - safeLevel).fill('$').join('')}</span>
      </span>
    );
  };

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location) => (
        <Marker
          key={`${location.name}-${location.lat}-${location.lng}`}
          position={[location.lat, location.lng]}
          icon={createCustomIcon(location.wifiSpeed)}
        >
          <Popup maxWidth={320}>
            <div className="p-1 min-w-[250px]">
              {/* Header */}
              <div className="flex mb-3 items-start border-b pb-2">
                <img
                  src={location.imageUrl}
                  alt={location.name}
                  className="w-16 h-16 object-cover rounded mr-3 shadow-sm"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-coffee-brown text-base leading-tight mb-1">{location.name}</h3>
                  <div className="flex items-center text-sm gap-2">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">
                      {location.wifiSpeed} Mbps
                    </span>
                    {location.overallScore && renderStars(location.overallScore)}
                  </div>
                  {location.address && (
                    <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">
                      <i className="fas fa-map-marker-alt mr-1"></i>
                      {location.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 mb-3 bg-gray-50 p-2 rounded">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Parking</span>
                  <div className="flex items-center">
                    <i className="fas fa-parking text-gray-400 mr-1 text-xs"></i>
                    {renderStars(location.parkingScore || 0)}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Price</span>
                  <div className="flex items-center">
                    <i className="fas fa-tag text-gray-400 mr-1 text-xs"></i>
                    {renderPrice(location.priceLevel)}
                  </div>
                </div>
              </div>

              {/* Speed Metrics */}
              {location.speedMetrics && (
                <div className="mb-3">
                  <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Speed Stats (Mbps)</span>
                  <div className="flex justify-between text-xs bg-blue-50 p-2 rounded text-blue-800">
                    <div className="text-center">
                      <span className="block font-bold">{location.speedMetrics.min}</span>
                      <span className="text-[10px] opacity-75">Min</span>
                    </div>
                    <div className="text-center border-l border-blue-200 pl-2 ml-2">
                      <span className="block font-bold">{location.speedMetrics.mean}</span>
                      <span className="text-[10px] opacity-75">Avg</span>
                    </div>
                    <div className="text-center border-l border-blue-200 pl-2 ml-2">
                      <span className="block font-bold">{location.speedMetrics.max}</span>
                      <span className="text-[10px] opacity-75">Max</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Description & Action */}
              <p className="text-xs text-gray-600 mb-3 italic">"{location.description}"</p>

              {location.onViewDetails && (
                <button
                  onClick={location.onViewDetails}
                  className="w-full text-sm bg-coffee-brown text-white py-2 rounded hover:bg-opacity-90 font-medium transition-colors flex items-center justify-center"
                >
                  View Details
                  <i className="fas fa-arrow-right ml-2 text-xs"></i>
                </button>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LeafletMapComponent;