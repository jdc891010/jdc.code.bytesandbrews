import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { ENV } from '@/lib/env';

// Add Google Maps types to window object
declare global {
  interface Window {
    google: typeof google;
    initGoogleMap: () => void;
  }
}

interface CoffeeShopAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Somerset West, South Africa location coordinates
const SOMERSET_WEST_BOUNDS = {
  center: { lat: -34.0789, lng: 18.8429 },
  radius: 5000 // 5km radius
};

// Google Places prediction result type
interface PlacePrediction {
  description: string;
  place_id: string;
}

const CoffeeShopAutocomplete = ({
  value,
  onChange,
  placeholder = 'Search for coffee shops, restaurants...',
  className = ''
}: CoffeeShopAutocompleteProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [placesService, setPlacesService] = useState<google.maps.places.AutocompleteService | null>(null);
  const [sessionToken, setSessionToken] = useState<google.maps.places.AutocompleteSessionToken | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Initialize Google Places Autocomplete service
  useEffect(() => {
    const initPlacesService = () => {
      try {
        if (window.google && window.google.maps && window.google.maps.places) {
          setPlacesService(new window.google.maps.places.AutocompleteService());
          setSessionToken(new window.google.maps.places.AutocompleteSessionToken());
        } else {
          console.error('Google Places API not loaded');
        }
      } catch (error) {
        console.error('Error initializing Places Autocomplete service:', error);
      }
    };

    // Check if Google Maps script is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      initPlacesService();
    } else {
      // If not loaded, wait for it to be loaded by GoogleMapComponent
      const checkGoogleMapsLoaded = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
          clearInterval(checkGoogleMapsLoaded);
          initPlacesService();
        }
      }, 500);
      
      // Clean up interval
      return () => clearInterval(checkGoogleMapsLoaded);
    }
  }, []);

  // Get place predictions from Google Places API
  const getPlacePredictions = useCallback((input: string) => {
    if (!placesService || !sessionToken || input.trim() === '') {
      setSuggestions([]);
      return;
    }

    const request = {
      input,
      sessionToken,
      types: ['establishment'],
      componentRestrictions: { country: 'za' }, // Restrict to South Africa
      locationBias: {
        radius: SOMERSET_WEST_BOUNDS.radius,
        center: SOMERSET_WEST_BOUNDS.center
      }
    };

    placesService.getPlacePredictions(
      request,
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          // Get only establishment places and focus on coffee shops, cafes, restaurants
          const filteredPredictions = predictions
            .filter(prediction => 
              prediction.types?.some((type: string) => 
                ['cafe', 'restaurant', 'bakery', 'food', 'bar', 'meal_takeaway'].includes(type)
              )
            )
            .map(prediction => ({
              description: prediction.description,
              place_id: prediction.place_id
            }));
          
          setSuggestions(filteredPredictions);
        } else {
          setSuggestions([]);
        }
      }
    );
  }, [placesService, sessionToken]);

  // Update suggestions when input changes
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      getPlacePredictions(inputValue);
    }, 300); // Debounce to avoid too many API calls

    return () => clearTimeout(delaySearch);
  }, [inputValue, getPlacePredictions]);

  // Handle clicks outside the autocomplete component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: PlacePrediction) => {
    setInputValue(suggestion.description);
    onChange(suggestion.description);
    setShowSuggestions(false);
    
    // Reset session token after each selection to avoid being charged for unused predictions
    if (window.google && window.google.maps && window.google.maps.places) {
      setSessionToken(new window.google.maps.places.AutocompleteSessionToken());
    }
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder}
        className={className}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li 
                key={suggestion.place_id || index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CoffeeShopAutocomplete;