import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ENV } from '../lib/env';
import CoffeeShopDetails from './CoffeeShopDetails';

interface HourlyData {
  hour: number;
  internetSpeed: number;
  vibes: number;
  noise: number;
  parking: number;
}

interface InternetStats {
  mean: number;
  median: number;
  max: number;
}

interface MapLocation {
  name: string;
  lat: number;
  lng: number;
  description?: string;
  wifiSpeed?: number;
  imageUrl?: string;
  rating?: number;
  vicinity?: string;
  placeId?: string;
  onViewDetails?: () => void;
  photos?: google.maps.places.PlacePhoto[];
  hourlyData?: HourlyData[];
  internetStats?: InternetStats;
  address?: string;
}

interface GoogleMapComponentProps {
  locations?: MapLocation[];
  center?: { lat: number; lng: number };
  usePlacesAPI?: boolean;
  radius?: number; // Search radius in meters
}

// Generate mock hourly data for the next 4 hours
const generateHourlyData = (baseSpeed: number): HourlyData[] => {
  const currentHour = new Date().getHours();
  const data: HourlyData[] = [];
  
  for (let i = 0; i < 4; i++) {
    const hour = (currentHour + i) % 24;
    data.push({
      hour,
      internetSpeed: Math.max(5, baseSpeed + Math.random() * 20 - 10),
      vibes: Math.random() * 100,
      noise: Math.random() * 100,
      parking: Math.random() * 100
    });
  }
  
  return data;
};

// Generate mock internet stats
const generateInternetStats = (baseSpeed: number): InternetStats => ({
  mean: baseSpeed + Math.random() * 10 - 5,
  median: baseSpeed + Math.random() * 8 - 4,
  max: baseSpeed + Math.random() * 25 + 10
});

// Speed categories and colors
const getSpeedCategory = (speed: number): { category: string; color: string } => {
  if (speed >= 50) return { category: 'supersonic', color: '#0066FF' }; // Blue
  if (speed >= 30) return { category: 'good', color: '#00CC00' }; // Green
  if (speed >= 15) return { category: 'okay', color: '#FFAA00' }; // Orange
  return { category: 'bad', color: '#FF3333' }; // Red
};

// Generate color-coded coffee cup SVG icon
const generateCoffeeIcon = (speed: number): string => {
  const { color } = getSpeedCategory(speed);
  const svgContent = `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" fill="white" stroke="${color}" stroke-width="2"/>
      <path d="M10 12h12v8c0 2.2-1.8 4-4 4h-4c-2.2 0-4-1.8-4-4v-8z" fill="${color}"/>
      <path d="M22 14h2c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-2" stroke="${color}" stroke-width="1.5" fill="none"/>
      <path d="M12 10c0-1 1-2 2-2s2 1 2 2" stroke="${color}" stroke-width="1.5" fill="none"/>
      <path d="M16 10c0-1 1-2 2-2s2 1 2 2" stroke="${color}" stroke-width="1.5" fill="none"/>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svgContent)}`;
};

// Define sample coffee shops in Somerset West area
const sampleLocations: MapLocation[] = [
  {
    name: "Blue Waters Café",
    lat: -34.0804,
    lng: 18.8433,
    description: "Popular beachfront café with fast WiFi",
    wifiSpeed: 48,
    rating: 4.5,
    vicinity: "Beach Road, Somerset West",
    imageUrl: generateCoffeeIcon(48),
    hourlyData: generateHourlyData(48),
    internetStats: generateInternetStats(48)
  },
  {
    name: "The Coffee Station",
    lat: -34.0785, 
    lng: 18.8397,
    description: "Work-friendly café with power outlets",
    wifiSpeed: 35,
    rating: 4.2,
    vicinity: "Main Road, Somerset West",
    imageUrl: generateCoffeeIcon(35),
    hourlyData: generateHourlyData(35),
    internetStats: generateInternetStats(35)
  },
  {
    name: "Waterstone Café",
    lat: -34.0712,
    lng: 18.8452,
    description: "Quiet space with outdoor seating and decent WiFi",
    wifiSpeed: 25,
    rating: 4.0,
    vicinity: "Waterstone Drive, Somerset West",
    imageUrl: generateCoffeeIcon(25),
    hourlyData: generateHourlyData(25),
    internetStats: generateInternetStats(25)
  },
  {
    name: "Bootlegger Coffee",
    lat: -34.0734,
    lng: 18.8505,
    description: "Modern coffee shop with high-speed WiFi",
    wifiSpeed: 52,
    rating: 4.7,
    vicinity: "Stellenberg Road, Somerset West",
    imageUrl: generateCoffeeIcon(52),
    hourlyData: generateHourlyData(52),
    internetStats: generateInternetStats(52)
  }
];

const GoogleMapComponent = ({ 
  locations = [],
  center = { lat: -34.0722, lng: 18.8439 }, // Default center coordinates for Somerset West
  usePlacesAPI = true,
  radius = 5000 // Default 5km radius
}: GoogleMapComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  
  const [coffeeShops, setCoffeeShops] = useState<MapLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Load Google Maps script
  useEffect(() => {
    // Check if Google Maps script is already loaded
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Use Google Maps API Key from environment variables
    const googleMapsApiKey = ENV.GOOGLE_MAPS_API_KEY;
    
    // Check if API key is available
    if (!googleMapsApiKey) {
      console.error('Google Maps API key not found in environment variables');
      setError('Google Maps API key not configured. Please set VITE_GOOGLE_MAPS_API_KEY in your environment variables.');
      setIsLoading(false);
      return;
    }
    
    // Create script element with Places library
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&callback=initGoogleMap`;
    script.async = true;
    script.defer = true;
    
    // Define callback function in window scope
    (window as any).initGoogleMap = initializeMap;
    
    // Append script to document
    document.head.appendChild(script);
    
    // Cleanup
    return () => {
      if ((window as any).initGoogleMap) {
        (window as any).initGoogleMap = undefined;
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Initialize map when script is loaded
  const initializeMap = useCallback(() => {
    if (!mapRef.current || typeof window === 'undefined' || !window.google || !window.google.maps) return;

    try {
      // Create map instance
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 13,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: window.google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          mapTypeIds: [
            window.google.maps.MapTypeId.ROADMAP,
            window.google.maps.MapTypeId.TERRAIN,
            window.google.maps.MapTypeId.SATELLITE
          ]
        },
        fullscreenControl: true,
        streetViewControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi.business',
            stylers: [{ visibility: 'on' }]
          },
          {
            featureType: 'poi',
            elementType: 'labels.icon',
            stylers: [{ color: '#6b4925' }]
          }
        ]
      });
      
      setMap(mapInstance);
      
      // Create info window
      setInfoWindow(new window.google.maps.InfoWindow());
      
      // Create Places service
      if (window.google.maps.places) {
        const placesServiceInstance = new window.google.maps.places.PlacesService(mapInstance);
        setPlacesService(placesServiceInstance);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize Google Maps');
      setIsLoading(false);
    }
  }, [center]);

  // Search for coffee shops using Places API
  const searchCoffeeShops = useCallback(() => {
    if (!placesService || !map || typeof window === 'undefined' || !window.google || !window.google.maps) return;
    
    setIsLoading(true);
    
    // Use the center prop for the search location
    const location = new window.google.maps.LatLng(center.lat, center.lng);
    const request: google.maps.places.PlaceSearchRequest = {
      location,
      radius,
      type: 'cafe',
      keyword: 'coffee'
    };
    
    placesService.nearbySearch(request, (
      results: google.maps.places.PlaceResult[] | null, 
      status: google.maps.places.PlacesServiceStatus
    ) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
        const coffeeShopLocations: MapLocation[] = results.map((place: google.maps.places.PlaceResult) => {
          const wifiSpeed = Math.floor(Math.random() * 50) + 5; // Placeholder for WiFi speed
          return {
            name: place.name || 'Unknown Coffee Shop',
            lat: place.geometry?.location ? place.geometry.location.lat() : center.lat,
            lng: place.geometry?.location ? place.geometry.location.lng() : center.lng,
            vicinity: place.vicinity,
            rating: place.rating,
            placeId: place.place_id,
            photos: place.photos,
            imageUrl: generateCoffeeIcon(wifiSpeed),
            description: `Rating: ${place.rating || 'N/A'} • ${place.vicinity || ''}`,
            wifiSpeed: wifiSpeed,
            hourlyData: generateHourlyData(wifiSpeed),
            internetStats: generateInternetStats(wifiSpeed)
          };
        });
        
        setCoffeeShops(coffeeShopLocations);
        setIsLoading(false);
      } else {
        console.warn('Place search failed or returned no results:', status);
        // Fall back to sample locations when Places API fails
        setCoffeeShops(sampleLocations);
        setIsLoading(false);
      }
    });
  }, [placesService, map, center, radius]);

  // Effect to search for coffee shops when placesService is ready
  useEffect(() => {
    if (usePlacesAPI && placesService && map) {
      searchCoffeeShops();
    }
  }, [usePlacesAPI, placesService, map, searchCoffeeShops]);

  // Clear existing markers
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker: google.maps.Marker) => {
      if (marker.getMap()) {
        marker.setMap(null);
      }
    });
    markersRef.current = [];
  }, []);

  // Add markers for locations (either provided or from Places API)
  useEffect(() => {
    if (!map || !infoWindow || typeof window === 'undefined' || !window.google || !window.google.maps) return;
    
    clearMarkers();
    
    const locationsToShow = usePlacesAPI ? coffeeShops : locations;
    
    if (locationsToShow.length === 0) {
      return;
    }
    
    const bounds = new window.google.maps.LatLngBounds();
    const markers: google.maps.Marker[] = [];
    
    // Add markers for each location
    locationsToShow.forEach((location: MapLocation) => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map,
        title: location.name,
        animation: window.google.maps.Animation.DROP,
        icon: {
          url: location.imageUrl || generateCoffeeIcon(location.wifiSpeed || 0),
          scaledSize: new window.google.maps.Size(32, 32)
        }
      });
      
      markers.push(marker);
      
      // Extend bounds if position is valid
      const position = marker.getPosition();
      if (position) {
        bounds.extend(position);
      }
      
      // Get more details about the place if needed
      const getPlaceDetails = (placeId: string) => {
        if (!placesService) return;
        
        const request: google.maps.places.PlaceDetailsRequest = {
          placeId: placeId,
          fields: ['formatted_phone_number', 'website', 'opening_hours', 'rating', 'user_ratings_total', 'price_level', 'formatted_address']
        };
        
        placesService.getDetails(request, (
          place: google.maps.places.PlaceResult | null, 
          status: google.maps.places.PlacesServiceStatus
        ) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            const contentString = createInfoWindowContent(location, place);
            if (infoWindow) {
              infoWindow.setContent(contentString);
            }
          } else {
            // Fallback to basic info
            const contentString = createInfoWindowContent(location);
            if (infoWindow) {
              infoWindow.setContent(contentString);
            }
          }
        });
      };
      
      // Create heatmap bar chart for a metric
      const createHeatmapBar = (data: HourlyData[], metric: keyof HourlyData, label: string, color: string) => {
        if (!data || data.length === 0) return '';
        
        const maxValue = Math.max(...data.map(d => d[metric] as number));
        const bars = data.map(d => {
          const value = d[metric] as number;
          const height = Math.max(5, (value / maxValue) * 40);
          const hour = d.hour;
          const displayHour = hour === 0 ? '12AM' : hour <= 12 ? `${hour}${hour === 12 ? 'PM' : 'AM'}` : `${hour - 12}PM`;
          
          return `
            <div class="flex flex-col items-center" style="width: 45px;">
              <div class="text-xs text-gray-600 mb-1">${Math.round(value)}${metric === 'internetSpeed' ? 'M' : ''}</div>
              <div style="width: 30px; height: ${height}px; background-color: ${color}; border-radius: 2px;"></div>
              <div class="text-xs text-gray-500 mt-1">${displayHour}</div>
            </div>
          `;
        }).join('');
        
        return `
          <div class="mb-3">
            <div class="text-sm font-semibold text-gray-700 mb-2">${label}</div>
            <div class="flex justify-between items-end" style="height: 60px;">
              ${bars}
            </div>
          </div>
        `;
      };

      // Create info window content
      const createInfoWindowContent = (location: MapLocation, placeDetails?: google.maps.places.PlaceResult) => {
        const photoUrl = location.imageUrl || '/icons/default-coffee.png';
        const stars = '★'.repeat(Math.floor(location.rating || 0)) + '☆'.repeat(5 - Math.floor(location.rating || 0));
        const { category, color } = getSpeedCategory(location.wifiSpeed || 0);
        
        // Create heatmaps for next 4 hours
        const heatmapsHtml = location.hourlyData ? `
          <div class="mt-3 p-2 bg-gray-50 rounded" style="max-width: 300px;">
            <h4 class="text-sm font-bold text-gray-800 mb-2">Next 4 Hours Forecast</h4>
            ${createHeatmapBar(location.hourlyData, 'internetSpeed', 'Internet Speed (Mbps)', '#0066FF')}
            ${createHeatmapBar(location.hourlyData, 'vibes', 'Vibes Score', '#00CC00')}
            ${createHeatmapBar(location.hourlyData, 'noise', 'Noise Level', '#FF6600')}
            ${createHeatmapBar(location.hourlyData, 'parking', 'Parking Availability', '#9966FF')}
          </div>
        ` : '';
        
        // Internet stats section
        const internetStatsHtml = location.internetStats ? `
          <div class="mt-2 p-2 bg-blue-50 rounded">
            <div class="text-sm font-semibold text-gray-700 mb-1">30-Day Internet Stats</div>
            <div class="flex justify-between text-xs text-gray-600">
              <span>Mean: ${Math.round(location.internetStats.mean)}M</span>
              <span>Median: ${Math.round(location.internetStats.median)}M</span>
              <span>Max: ${Math.round(location.internetStats.max)}M</span>
            </div>
            <button class="text-xs bg-blue-500 text-white px-2 py-1 rounded mt-1 hover:bg-blue-600 detailed-stats-btn" data-location-name="${location.name}">
              View Detailed Stats
            </button>
          </div>
        ` : '';
        
        return `
          <div class="p-2" style="max-width: 320px;">
            <div class="flex mb-2">
              <img src="${photoUrl}" alt="${location.name}" class="w-20 h-20 object-cover rounded mr-2" onerror="this.src='/icons/default-coffee.png'" />
              <div>
                <h3 class="font-bold text-coffee-brown">${location.name}</h3>
                <div class="text-yellow-500 text-sm">${stars}</div>
                ${location.wifiSpeed ? `
                  <div class="flex items-center text-sm">
                    <span class="font-semibold" style="color: ${color}">${location.wifiSpeed} Mbps</span>
                    <span class="mx-1">·</span>
                    <span class="text-xs px-1 rounded" style="background-color: ${color}20; color: ${color}">${category}</span>
                  </div>
                ` : ''}
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-2">${location.vicinity || location.description || ''}</p>
            ${placeDetails?.formatted_phone_number ? `
              <p class="text-sm text-gray-600 mb-2">
                <strong>Phone:</strong> ${placeDetails.formatted_phone_number}
              </p>
            ` : ''}
            ${placeDetails?.website ? `
              <p class="text-sm text-gray-600 mb-2">
                <a href="${placeDetails.website}" target="_blank" class="text-blue-500 hover:underline">Website</a>
              </p>
            ` : ''}
            ${heatmapsHtml}
            ${internetStatsHtml}
            <div class="mt-3">
              <div class="flex flex-wrap gap-1 mb-2">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}" 
                  target="_blank"
                  class="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                >
                  <i class="fas fa-map-marker-alt"></i> Google Maps
                </a>
                <a 
                  href="https://maps.apple.com/?ll=${location.lat},${location.lng}" 
                  target="_blank"
                  class="text-xs bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-900 flex items-center gap-1"
                >
                  <i class="fab fa-apple"></i> Apple Maps
                </a>
                <a 
                  href="https://www.waze.com/ul?ll=${location.lat},${location.lng}&navigate=yes" 
                  target="_blank"
                  class="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                >
                  <i class="fab fa-waze"></i> Waze
                </a>
                <button 
                  class="text-xs bg-black text-white px-2 py-1 rounded hover:bg-gray-800 flex items-center gap-1 uber-btn"
                  data-drop-lat="${location.lat}"
                  data-drop-lng="${location.lng}"
                  data-drop-name="${location.name}"
                  data-drop-address="${location.vicinity || location.address || location.name}"
                >
                  <i class="fab fa-uber"></i> Uber
                </button>
              </div>
              ${location.placeId ? `
                <button 
                  class="text-sm bg-tech-blue text-white px-3 py-1 rounded hover:bg-opacity-90 view-details-btn w-full"
                  data-place-id="${location.placeId}"
                  data-location-name="${location.name}"
                >
                  View Details
                </button>
              ` : ''}
            </div>
          </div>
        `;
      };
      
      // Add click event to marker
      marker.addListener('click', () => {
        if (location.placeId && placesService) {
          // Get details and then show info window
          getPlaceDetails(location.placeId);
        } else {
          // Just show basic info window
          const contentString = createInfoWindowContent(location);
          infoWindow.setContent(contentString);
        }
        
        infoWindow.open(map, marker);
      });
    });
    
    // Save markers reference
    markersRef.current = markers;
    
    // Add listener to handle button clicks in info windows
    if (infoWindow) {
      const infoWindowListener = window.google.maps.event.addListener(infoWindow, 'domready', () => {
        // Handle "View Details" button clicks
        const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
        viewDetailsButtons.forEach((button: Element) => {
          button.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            const locationName = target.getAttribute('data-location-name') || target.parentElement?.getAttribute('data-location-name');
            if (locationName) {
              const location = locationsToShow.find((loc: MapLocation) => loc.name === locationName);
              if (location && location.onViewDetails) {
                location.onViewDetails();
                if (infoWindow) {
                  infoWindow.close();
                }
              }
            }
          });
        });
        
        // Handle "View Detailed Stats" button clicks
        const detailedStatsButtons = document.querySelectorAll('.detailed-stats-btn');
        detailedStatsButtons.forEach((button: Element) => {
          button.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            const locationName = target.getAttribute('data-location-name');
            if (locationName) {
              const location = locationsToShow.find((loc: MapLocation) => loc.name === locationName);
              if (location) {
                setSelectedLocation(location);
                setDetailsOpen(true);
                if (infoWindow) {
                  infoWindow.close();
                }
              }
            }
          });
        });
        
        // Handle Uber button clicks
        const uberButtons = document.querySelectorAll('.uber-btn');
        uberButtons.forEach((button: Element) => {
          button.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            
            /**
             * Safely build Uber deep link URLSearchParams
             */
            function buildUberLink({ dropLat, dropLng, name, address, pickup }: {
              dropLat: number;
              dropLng: number;
              name: string;
              address: string;
              pickup: { mode: string; lat?: number; lng?: number };
            }) {
              const params = new URLSearchParams({ action: 'setPickup' });
         
              if (!pickup || pickup.mode === 'my_location') {
                params.set('pickup', 'my_location');
              } else if (pickup.mode === 'fixed' && isFinite(pickup.lat!) && isFinite(pickup.lng!)) {
                params.set('pickup[latitude]', String(pickup.lat));
                params.set('pickup[longitude]', String(pickup.lng));
              } else {
                // Fallback to in-app manual pickup UI
                params.set('pickup', 'my_location');
              }
         
              params.set('dropoff[latitude]', String(dropLat));
              params.set('dropoff[longitude]', String(dropLng));
              if (name) params.set('dropoff[nickname]', name);
              if (typeof address === 'string' && address.trim().length > 0) {
                params.set('dropoff[formatted_address]', address);
              }
         
              return `https://m.uber.com/ul/?${params.toString()}`;
            }
         
            /**
             * Attempt geolocation to validate permission (optional).
             * If granted, we still use pickup=my_location (Uber app uses device GPS).
             * If denied/unavailable, we still proceed (Uber lets user set pickup manually).
             */
            function withOptionalGeolocation(continueFn: () => void) {
              if (!navigator.geolocation) { continueFn(); return; }
              let resolved = false;
              const timer = setTimeout(() => { if (!resolved) continueFn(); }, 1200);
         
              navigator.geolocation.getCurrentPosition(
                () => { resolved = true; clearTimeout(timer); continueFn(); },
                () => { resolved = true; clearTimeout(timer); continueFn(); },
                { maximumAge: 30000, timeout: 1000 }
              );
            }
            
            const dropLat = parseFloat(target.getAttribute('data-drop-lat') || '0');
            const dropLng = parseFloat(target.getAttribute('data-drop-lng') || '0');
            const name = target.getAttribute('data-drop-name') || 'Coffee Shop';
            const address = target.getAttribute('data-drop-address') || '';
            
            if (dropLat === 0 || dropLng === 0) {
              console.error('Missing or invalid destination coordinates');
              alert('Destination unavailable. Please try again.');
              return;
            }
            
            const pickup = { mode: 'my_location' };
            
            withOptionalGeolocation(() => {
              const url = buildUberLink({ dropLat, dropLng, name, address, pickup });
              // Open in same tab to allow mobile universal link handoff
              window.location.href = url;
            });
          });
        });
        
      });
      
      // Clean up the event listener
      return () => {
        if (infoWindowListener) {
          window.google.maps.event.removeListener(infoWindowListener);
        }
      };
    }
    
    // Fit map to bounds
    if (!bounds.isEmpty() && map) {
      map.fitBounds(bounds);
    }
    
    // If only one location, zoom out a bit
    if (locationsToShow.length === 1 && map) {
      window.google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        map.setZoom(15);
      });
    }

  }, [map, locations, coffeeShops, infoWindow, usePlacesAPI, clearMarkers, placesService]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full rounded-lg"></div>
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="text-center">
            <svg className="animate-spin h-10 w-10 text-tech-blue mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-700">
              {usePlacesAPI ? 'Finding coffee shops in Somerset West...' : 'Loading map...'}
            </p>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-50">
          <div className="text-center p-4 bg-white rounded-lg shadow-lg">
            <svg className="w-10 h-10 text-red-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 mb-2">{error}</p>
            {error !== 'Google Maps API key not configured' && (
              <button 
                className="px-4 py-2 bg-tech-blue text-white rounded hover:bg-opacity-90"
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  if (usePlacesAPI) {
                    searchCoffeeShops();
                  } else {
                    setIsLoading(false);
                  }
                }}
              >
                Try Again
              </button>
            )}
            {error === 'Google Maps API key not configured' && (
              <p className="text-sm text-gray-600 mt-2">
                Please configure the VITE_GOOGLE_MAPS_API_KEY environment variable.
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Empty Results Message */}
      {!isLoading && !error && usePlacesAPI && coffeeShops.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="text-center p-4 bg-white rounded-lg shadow-lg">
            <svg className="w-10 h-10 text-gray-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-gray-700 mb-2">No coffee shops found in this area.</p>
            <button 
              className="px-4 py-2 bg-tech-blue text-white rounded hover:bg-opacity-90"
              onClick={() => {
                setIsLoading(true);
                searchCoffeeShops();
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      {selectedLocation && (
        <CoffeeShopDetails
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          name={selectedLocation.name}
          description={selectedLocation.description || `A great coffee shop with ${selectedLocation.wifiSpeed} Mbps WiFi speed.`}
          amenities={{
            wheelchairAccessible: true,
            parkingRating: Math.round((selectedLocation.hourlyData?.[0]?.parking || 3)) as 1 | 2 | 3 | 4 | 5,
            videoCallRating: 4 as 1 | 2 | 3 | 4 | 5,
            powerAvailability: 5 as 1 | 2 | 3 | 4 | 5,
            coffeeQuality: 4 as 1 | 2 | 3 | 4 | 5
          }}
          dominantTribe="Digital Nomads"
          location={{
            address: selectedLocation.vicinity || selectedLocation.address || "Address not available",
            city: "Cape Town",
            country: "South Africa",
            coordinates: {
              lat: selectedLocation.lat,
              lng: selectedLocation.lng
            }
          }}
        />
      )}
    </div>
  );
};

export default GoogleMapComponent;