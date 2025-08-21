import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ENV } from '../lib/env';

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
}

interface GoogleMapComponentProps {
  locations?: MapLocation[];
  center?: { lat: number; lng: number };
  usePlacesAPI?: boolean;
  radius?: number; // Search radius in meters
}

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
      imageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTIiIGZpbGw9IiMzMzY2RkYiLz4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iOCIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4K",
    },
    {
      name: "The Coffee Station",
      lat: -34.0785, 
      lng: 18.8397,
      description: "Work-friendly café with power outlets",
      wifiSpeed: 35,
      rating: 4.2,
      vicinity: "Main Road, Somerset West",
      imageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTIiIGZpbGw9IiNGRjMzMzMiLz4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iOCIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4K",
    },
    {
      name: "Waterstone Café",
      lat: -34.0712,
      lng: 18.8452,
      description: "Quiet space with outdoor seating and decent WiFi",
      wifiSpeed: 25,
      rating: 4.0,
      vicinity: "Waterstone Drive, Somerset West",
      imageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTIiIGZpbGw9IiMzM0ZGMzMiLz4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iOCIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4K",
    },
    {
      name: "Bootlegger Coffee",
      lat: -34.0734,
      lng: 18.8505,
      description: "Modern coffee shop with high-speed WiFi",
      wifiSpeed: 52,
      rating: 4.7,
      vicinity: "Stellenberg Road, Somerset West",
      imageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTIiIGZpbGw9IiNGRkZGMzMiLz4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iOCIgZmlsbD0iIzMzMzMzMyIvPgo8L3N2Zz4K",
    }
  ];
  
  const [coffeeShops, setCoffeeShops] = useState<MapLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Load Google Maps script
  useEffect(() => {
    // Check if Google Maps script is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Use Google Maps API Key from environment variables
    const googleMapsApiKey = ENV.GOOGLE_MAPS_API_KEY;
    
    // Check if API key is available
    if (!googleMapsApiKey) {
      console.error('Google Maps API key not found in environment variables');
      setError('Google Maps API key not configured');
      setIsLoading(false);
      return;
    }
    
    // Create script element with Places library
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&callback=initGoogleMap`;
    script.async = true;
    script.defer = true;
    
    // Define callback function in window scope
    window.initGoogleMap = initializeMap;
    
    // Append script to document
    document.head.appendChild(script);
    
    // Cleanup
    return () => {
      window.initGoogleMap = undefined;
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Initialize map when script is loaded
  const initializeMap = useCallback(() => {
    if (!mapRef.current) return;

    try {
      // Create map instance
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 13,
        mapId: 'coffee_shop_map',
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
      const placesServiceInstance = new window.google.maps.places.PlacesService(mapInstance);
      setPlacesService(placesServiceInstance);
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize Google Maps');
      setIsLoading(false);
    }
  }, [center]);

  // Search for coffee shops using Places API
  const searchCoffeeShops = useCallback(() => {
    if (!placesService || !map) return;
    
    setIsLoading(true);
    
    // Define bounds for Somerset West area only
    const somersetWestBounds = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(-34.0960, 18.8200), // SW
      new window.google.maps.LatLng(-34.0550, 18.8700)  // NE
    );
    
    // Set the map bounds
    map.fitBounds(somersetWestBounds);
    
    const request = {
      location: { lat: -34.0789, lng: 18.8429 }, // Somerset West center
      radius: 5000, // 5km radius
      type: 'restaurant', // Type can be: 'restaurant', 'cafe', 'bar', 'bakery', etc.
      keyword: 'coffee' // Additional keyword to focus on coffee-related places
    };
    
    placesService.nearbySearch(request, (results, status) => {
      console.log('Places API search results:', { status, results, request });
      
      if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
        const coffeeShopLocations: MapLocation[] = results.map(place => {
          console.log('Processing place:', place);
          return {
            name: place.name || 'Unknown Coffee Shop',
            lat: place.geometry?.location?.lat() || center.lat,
            lng: place.geometry?.location?.lng() || center.lng,
            vicinity: place.vicinity,
            rating: place.rating,
            placeId: place.place_id,
            photos: place.photos,
            imageUrl: place.photos?.[0]?.getUrl({ maxWidth: 100, maxHeight: 100 }) || '/icons/default-coffee.png',
            description: `Rating: ${place.rating || 'N/A'} • ${place.vicinity || ''}`,
            wifiSpeed: Math.floor(Math.random() * 50) + 5 // Placeholder for WiFi speed
          };
        });
        
        console.log('Processed coffee shop locations:', coffeeShopLocations);
        setCoffeeShops(coffeeShopLocations);
        setIsLoading(false);
      } else {
        console.error('Place search failed:', status, results);
        console.log('Falling back to sample locations');
        
        // Fall back to sample locations when Places API fails
        setCoffeeShops(sampleLocations);
        setIsLoading(false);
      }
    });
  }, [placesService, map, center, radius, sampleLocations]);

  // Effect to search for coffee shops when placesService is ready
  useEffect(() => {
    if (usePlacesAPI && placesService && map) {
      searchCoffeeShops();
    }
  }, [usePlacesAPI, placesService, map, searchCoffeeShops]);

  // Clear existing markers
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  }, []);

  // Add markers for locations (either provided or from Places API)
  useEffect(() => {
    if (!map || !infoWindow) return;
    
    clearMarkers();
    
    const locationsToShow = usePlacesAPI ? coffeeShops : locations;
    
    if (locationsToShow.length === 0) {
      return;
    }
    
    const bounds = new window.google.maps.LatLngBounds();
    const markers: google.maps.Marker[] = [];
    
    // Add markers for each location
    locationsToShow.forEach((location) => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map,
        title: location.name,
        animation: window.google.maps.Animation.DROP,
        icon: {
          url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIsMjFWMTlIMjBWMjFIMk0yMCw4VjVIMThWOEgyME0yMCwzQTIsMiAwIDAsMSAyMiw1VjhBMiwyIDAgMCwxIDIwLDEwSDE4VjEzQTQsNCAwIDAsMSAxNCwxN0g4QTQsNCAwIDAsMSA0LDEzVjNIMjBNMTYsNUg2VjEzQTIsMiAwIDAsMCA4LDE1SDE0QTIsMiAwIDAsMCAxNiwxM1Y1WiIgZmlsbD0iIzZiNDkyNSIvPgo8L3N2Zz4K',
          scaledSize: new window.google.maps.Size(32, 32)
        }
      });
      
      markers.push(marker);
      
      // Extend bounds
      bounds.extend(marker.getPosition()!);
      
      // Get more details about the place if needed
      const getPlaceDetails = (placeId: string) => {
        if (!placesService) return;
        
        const request = {
          placeId: placeId,
          fields: ['formatted_phone_number', 'website', 'opening_hours', 'rating', 'user_ratings_total', 'price_level', 'formatted_address']
        };
        
        placesService.getDetails(request, (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            const contentString = createInfoWindowContent(location, place);
            infoWindow.setContent(contentString);
          } else {
            // Fallback to basic info
            const contentString = createInfoWindowContent(location);
            infoWindow.setContent(contentString);
          }
        });
      };
      
      // Create info window content
      const createInfoWindowContent = (location: MapLocation, placeDetails?: google.maps.places.PlaceResult) => {
        const photoUrl = location.imageUrl || '/icons/default-coffee.png';
        const stars = '★'.repeat(Math.floor(location.rating || 0)) + '☆'.repeat(5 - Math.floor(location.rating || 0));
        
        return `
          <div class="p-2 max-w-xs">
            <div class="flex mb-2">
              <img src="${photoUrl}" alt="${location.name}" class="w-20 h-20 object-cover rounded mr-2" />
              <div>
                <h3 class="font-bold text-coffee-brown">${location.name}</h3>
                <div class="text-yellow-500 text-sm">${stars}</div>
                ${location.wifiSpeed ? `
                  <div class="flex items-center text-sm">
                    <span class="text-tech-blue font-semibold">${location.wifiSpeed} Mbps</span>
                    <span class="mx-1">·</span>
                    <span class="text-gray-500">WiFi</span>
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
            <div class="flex justify-between">
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}" 
                target="_blank"
                class="text-sm bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
              >
                Directions
              </a>
              ${location.placeId ? `
                <button 
                  class="text-sm bg-tech-blue text-white px-3 py-1 rounded hover:bg-opacity-90 view-details-btn"
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
    
    // Add listener to handle "View Details" button clicks in info windows
    window.google.maps.event.addListener(infoWindow, 'domready', () => {
      const buttons = document.querySelectorAll('.view-details-btn');
      buttons.forEach(button => {
        button.addEventListener('click', (e) => {
          const locationName = (e.target as HTMLElement).getAttribute('data-location-name');
          const location = locationsToShow.find(loc => loc.name === locationName);
          if (location && location.onViewDetails) {
            location.onViewDetails();
            infoWindow?.close();
          }
        });
      });
    });
    
    // Fit map to bounds
    map.fitBounds(bounds);
    
    // If only one location, zoom out a bit
    if (locationsToShow.length === 1) {
      window.google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        map.setZoom(15);
      });
    }

  }, [map, locations, coffeeShops, infoWindow, usePlacesAPI, clearMarkers]);

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
                  searchCoffeeShops();
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
    </div>
  );
};

export default GoogleMapComponent;

// Declare global window interface
declare global {
  interface Window {
    google: typeof google;
    initGoogleMap: () => void;
  }
}