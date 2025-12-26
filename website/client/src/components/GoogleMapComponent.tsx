import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ENV } from '../lib/env';
import CoffeeShopDetails from './CoffeeShopDetails';
import { getCoffeeShopsWithCache, type CoffeeShop } from '../services/coffeeShopApi';

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

  // Convert database coffee shop to MapLocation format
  const convertCoffeeShopToMapLocation = useCallback((shop: CoffeeShop): MapLocation => {
    const wifiSpeed = Math.floor(Math.random() * 50) + 15; // Generate realistic WiFi speed
    return {
      name: shop.name,
      lat: shop.latitude ? parseFloat(shop.latitude) : center.lat,
      lng: shop.longitude ? parseFloat(shop.longitude) : center.lng,
      description: shop.description || `${shop.name} - ${shop.address}`,
      wifiSpeed: wifiSpeed,
      rating: shop.rating || undefined,
      vicinity: shop.address,
      placeId: shop.googlePlaceId || undefined,
      imageUrl: shop.thumbnailUrl || shop.imageUrl || generateCoffeeIcon(wifiSpeed),
      address: shop.address,
      hourlyData: generateHourlyData(wifiSpeed),
      internetStats: generateInternetStats(wifiSpeed)
    };
  }, [center]);

  // Search for coffee shops using database-first approach with Places API fallback
  const searchCoffeeShops = useCallback(async () => {
    if (!map || typeof window === 'undefined' || !window.google || !window.google.maps) return;
    
    setIsLoading(true);
    
    try {
      // First, try to get coffee shops from database with cache
      console.log('Fetching coffee shops from database with cache...');
      const dbResponse = await getCoffeeShopsWithCache(center.lat, center.lng, radius);
      
      if (dbResponse.success && dbResponse.coffeeShops.length > 0) {
        console.log(`Found ${dbResponse.coffeeShops.length} coffee shops in database`);
        const dbLocations = dbResponse.coffeeShops.map(convertCoffeeShopToMapLocation);
        setCoffeeShops(dbLocations);
        setIsLoading(false);
        return;
      }
      
      console.log('No coffee shops found in database, falling back to Places API...');
      
      // Fallback to Places API if no database results
      if (!placesService) {
        console.warn('Places service not available, using sample locations');
        setCoffeeShops(sampleLocations);
        setIsLoading(false);
        return;
      }
      
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
            const wifiSpeed = Math.floor(Math.random() * 50) + 5;
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
          setCoffeeShops(sampleLocations);
          setIsLoading(false);
        }
      });
      
    } catch (error) {
      console.error('Error fetching coffee shops:', error);
      
      // Final fallback to Places API or sample locations
      if (placesService) {
        console.log('Database error, falling back to Places API...');
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
              const wifiSpeed = Math.floor(Math.random() * 50) + 5;
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
          } else {
            setCoffeeShops(sampleLocations);
          }
          setIsLoading(false);
        });
      } else {
        console.log('Using sample locations as final fallback');
        setCoffeeShops(sampleLocations);
        setIsLoading(false);
      }
    }
  }, [map, center, radius, placesService, convertCoffeeShopToMapLocation]);

  // Effect to search for coffee shops when map is ready
  useEffect(() => {
    if (usePlacesAPI && map) {
      searchCoffeeShops();
    }
  }, [usePlacesAPI, map, searchCoffeeShops]);

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
      
      // Create info window content
      const createInfoWindowContent = (location: MapLocation, placeDetails?: google.maps.places.PlaceResult) => {
        const photoUrl = location.imageUrl || '/icons/default-coffee.png';
        const stars = '★'.repeat(Math.floor(location.rating || 0)) + '☆'.repeat(5 - Math.floor(location.rating || 0));
        const { category, color } = getSpeedCategory(location.wifiSpeed || 0);
        
        // Internet stats section - redesigned for modern look
        const internetStatsHtml = location.internetStats ? `
          <div class="mt-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex justify-between items-center">
              <span>Speed Test Summary</span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <div class="text-center p-2 bg-blue-50 rounded-md">
                <div class="text-[10px] text-gray-500 uppercase">Mean</div>
                <div class="font-bold text-blue-700 text-sm">${Math.round(location.internetStats.mean)}<span class="text-[10px] font-normal ml-0.5">Mbps</span></div>
              </div>
              <div class="text-center p-2 bg-blue-50 rounded-md">
                <div class="text-[10px] text-gray-500 uppercase">Median</div>
                <div class="font-bold text-blue-700 text-sm">${Math.round(location.internetStats.median)}<span class="text-[10px] font-normal ml-0.5">Mbps</span></div>
              </div>
              <div class="text-center p-2 bg-blue-50 rounded-md">
                <div class="text-[10px] text-gray-500 uppercase">Max</div>
                <div class="font-bold text-blue-700 text-sm">${Math.round(location.internetStats.max)}<span class="text-[10px] font-normal ml-0.5">Mbps</span></div>
              </div>
            </div>
          </div>
        ` : '';

        // Address/Vicinity with icon
        const addressHtml = location.vicinity ? `
          <div class="flex items-start mt-2 text-gray-500 text-xs">
            <svg class="w-3 h-3 mr-1 mt-0.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span class="line-clamp-2">${location.vicinity}</span>
          </div>
        ` : '';

        // Open status
        const openStatus = placeDetails?.opening_hours?.isOpen ? 
          `<span class="text-green-600 text-[10px] font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-100">OPEN</span>` : 
          (placeDetails?.opening_hours ? `<span class="text-red-500 text-[10px] font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-100">CLOSED</span>` : '');
        
        return `
          <div class="font-sans text-gray-800" style="min-width: 280px; max-width: 320px;">
            <!-- Hero Image Section -->
            <div class="relative h-36 w-full rounded-t-lg overflow-hidden bg-gray-100 group">
              <img src="${photoUrl}" alt="${location.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onerror="this.src='/icons/default-coffee.png'" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div class="absolute bottom-0 left-0 right-0 p-3 text-white">
                <h3 class="font-bold text-lg leading-tight mb-1 text-shadow-sm">${location.name}</h3>
                <div class="flex items-center justify-between">
                   <div class="flex items-center">
                     <span class="text-yellow-400 text-xs tracking-widest mr-1">${stars}</span>
                     <span class="text-white/80 text-[10px]">(${location.rating || 'N/A'})</span>
                   </div>
                   ${openStatus}
                </div>
              </div>
            </div>
            
            <!-- Content Section -->
            <div class="p-3 bg-white rounded-b-lg shadow-sm">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <span class="px-2 py-1 rounded-md text-xs font-bold flex items-center shadow-sm" style="background-color: ${color}; color: white;">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    ${location.wifiSpeed || 0} Mbps
                  </span>
                  <span class="text-xs font-medium text-gray-500 px-2 py-1 bg-gray-100 rounded-md uppercase tracking-wide" style="color: ${color}">
                    ${category}
                  </span>
                </div>
              </div>

              ${addressHtml}
              
              ${internetStatsHtml}
              
              <!-- Action Buttons -->
              <div class="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2 justify-between">
                 <div class="flex gap-1">
                    <a href="https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}" target="_blank" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors" title="Google Maps">
                      <i class="fas fa-map-marker-alt text-sm"></i>
                    </a>
                    <button class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-black hover:text-white transition-colors uber-btn"
                      data-drop-lat="${location.lat}"
                      data-drop-lng="${location.lng}"
                      data-drop-name="${location.name}"
                      data-drop-address="${location.vicinity || location.address || location.name}"
                      title="Uber">
                      <i class="fab fa-uber text-sm"></i>
                    </button>
                 </div>

                 ${location.placeId ? `
                  <button 
                    class="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors shadow-sm view-details-btn font-medium"
                    data-place-id="${location.placeId}"
                    data-location-name="${location.name}"
                  >
                    View Details
                  </button>
                ` : ''}
              </div>
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

            withOptionalGeolocation(() => {
              const url = buildUberLink({
                dropLat,
                dropLng,
                name,
                address,
                pickup: { mode: 'my_location' }
              });
              window.open(url, '_blank');
            });
          });
        });
      });
      
      // Remove listener when info window is closed or map is unmounted
      return () => {
        window.google.maps.event.removeListener(infoWindowListener);
      };
    }
  }, [map, coffeeShops, usePlacesAPI, locations, infoWindow]); // Removed createInfoWindowContent from deps as it's now internal

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg border border-coffee-brown/20">
      <div ref={mapRef} className="w-full h-full min-h-[400px]" />
      
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-brown"></div>
        </div>
      )}
      
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-10">
          <p>{error}</p>
        </div>
      )}
      
      {/* Coffee Shop Details Sidebar/Modal */}
      {selectedLocation && (
        <CoffeeShopDetails
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          name={selectedLocation.name}
          description={selectedLocation.description || ''}
          amenities={{
            wheelchairAccessible: false,
            parkingRating: selectedLocation.wifiSpeed && selectedLocation.wifiSpeed > 40 ? 5 : selectedLocation.wifiSpeed && selectedLocation.wifiSpeed > 25 ? 4 : 3,
            videoCallRating: selectedLocation.wifiSpeed && selectedLocation.wifiSpeed > 40 ? 5 : selectedLocation.wifiSpeed && selectedLocation.wifiSpeed > 25 ? 4 : 3,
            powerAvailability: 4,
            coffeeQuality: 4
          }}
          dominantTribe="Developers"
          location={{
            address: selectedLocation.address || selectedLocation.vicinity || '',
            city: 'Somerset West', // Default city
            country: 'South Africa', // Default country
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
