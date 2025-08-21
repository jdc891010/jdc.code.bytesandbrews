import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Set up default icon and fix Leaflet's default icon path issues
// We're using inline SVG to avoid external file loading issues
const coffeeIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6b4925" width="32" height="32">
  <path d="M2,21V19H20V21H2M20,8V5H18V8H20M20,3A2,2 0 0,1 22,5V8A2,2 0 0,1 20,10H18V13A4,4 0 0,1 14,17H8A4,4 0 0,1 4,13V3H20M16,5H6V13A2,2 0 0,0 8,15H14A2,2 0 0,0 16,13V5Z" />
</svg>`;

// Create base64 URL from SVG
const svgUrl = 'data:image/svg+xml;base64,' + btoa(coffeeIconSvg);

// Coffee cup icon
const coffeeIcon = new L.Icon({
  iconUrl: svgUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface MapLocation {
  name: string;
  lat: number;
  lng: number;
  description: string;
  wifiSpeed: number;
  imageUrl: string;
  onViewDetails?: () => void;
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
          icon={coffeeIcon}
        >
          <Popup>
            <div className="p-1 max-w-xs">
              <div className="flex mb-2">
                <img
                  src={location.imageUrl}
                  alt={location.name}
                  className="w-16 h-16 object-cover rounded mr-2"
                />
                <div>
                  <h3 className="font-bold text-coffee-brown">{location.name}</h3>
                  <div className="flex items-center text-sm">
                    <span className="text-tech-blue font-semibold">
                      {location.wifiSpeed} Mbps
                    </span>
                    <span className="mx-1">·</span>
                    <span className="text-gray-500">WiFi</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{location.description}</p>
              {location.onViewDetails && (
                <button
                  onClick={location.onViewDetails}
                  className="text-sm bg-tech-blue text-white px-3 py-1 rounded hover:bg-opacity-90"
                >
                  View Details
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