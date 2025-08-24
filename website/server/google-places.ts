import { Client, PlaceType1 } from '@googlemaps/google-maps-services-js';

interface PlaceSearchResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
}

interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  formatted_phone_number?: string;
  website?: string;
  rating?: number;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  opening_hours?: {
    open_now?: boolean;
    periods?: Array<{
      open: {
        day: number; // 0-6 (Sunday-Saturday)
        time: string; // HHMM format
      };
      close?: {
        day: number;
        time: string;
      };
    }>;
    weekday_text?: string[];
  };
}

export interface CoffeeShopData {
  name: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  latitude: string;
  longitude: string;
  website?: string;
  phoneNumber?: string;
  rating?: string;
  googlePlacesId: string;
  imageUrl?: string;
  openingHours?: string; // JSON string of opening hours
  opensAt?: string; // Earliest opening time
  closesAt?: string; // Latest closing time
  isOpen24Hours?: boolean;
}

class GooglePlacesService {
  private client: Client;
  private apiKey: string;

  constructor() {
    this.client = new Client({});
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('Google Places API key not found. Set GOOGLE_PLACES_API_KEY environment variable.');
    }
  }

  async searchPlaces(query: string, location?: { lat: number; lng: number }, radius: number = 5000): Promise<PlaceSearchResult[]> {
    if (!this.apiKey) {
      throw new Error('Google Places API key not configured');
    }

    try {
      const response = await this.client.textSearch({
        params: {
          query: `${query} coffee shop`,
          key: this.apiKey,
          location: location,
          radius: radius,
          type: PlaceType1.cafe
        }
      });

      return response.data.results as PlaceSearchResult[];
    } catch (error) {
      console.error('Error searching places:', error);
      throw new Error('Failed to search places');
    }
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
    if (!this.apiKey) {
      throw new Error('Google Places API key not configured');
    }

    try {
      const response = await this.client.placeDetails({
        params: {
          place_id: placeId,
          key: this.apiKey,
          fields: [
            'place_id',
            'name',
            'formatted_address',
            'address_components',
            'geometry',
            'formatted_phone_number',
            'website',
            'rating',
            'photos',
            'opening_hours'
          ]
        }
      });

      return response.data.result as PlaceDetails;
    } catch (error) {
      console.error('Error getting place details:', error);
      throw new Error('Failed to get place details');
    }
  }

  async getPhotoUrl(photoReference: string, maxWidth: number = 400): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Google Places API key not configured');
    }

    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${this.apiKey}`;
  }

  convertToShopData(placeDetails: PlaceDetails): CoffeeShopData {
    // Extract city and postal code from address components
    let city = '';
    let country = '';
    let postalCode = '';

    placeDetails.address_components.forEach(component => {
      if (component.types.includes('locality')) {
        city = component.long_name;
      } else if (component.types.includes('administrative_area_level_1') && !city) {
        city = component.long_name;
      } else if (component.types.includes('country')) {
        country = component.long_name;
      } else if (component.types.includes('postal_code')) {
        postalCode = component.long_name;
      }
    });

    // Process opening hours
    let openingHours: string | undefined;
    let opensAt: string | undefined;
    let closesAt: string | undefined;
    let isOpen24Hours = false;

    if (placeDetails.opening_hours?.periods) {
      const hoursData: Record<string, { open: string; close: string }> = {};
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      
      let earliestOpen = '2400';
      let latestClose = '0000';
      
      placeDetails.opening_hours.periods.forEach(period => {
        const dayName = dayNames[period.open.day];
        const openTime = this.formatTime(period.open.time);
        const closeTime = period.close ? this.formatTime(period.close.time) : '24:00';
        
        hoursData[dayName] = {
          open: openTime,
          close: closeTime
        };
        
        // Track earliest and latest times
        if (period.open.time < earliestOpen) {
          earliestOpen = period.open.time;
        }
        if (period.close && period.close.time > latestClose) {
          latestClose = period.close.time;
        }
        
        // Check for 24-hour operation
        if (!period.close || (period.open.time === '0000' && period.close.time === '0000')) {
          isOpen24Hours = true;
        }
      });
      
      openingHours = JSON.stringify(hoursData);
      opensAt = this.formatTime(earliestOpen);
      closesAt = this.formatTime(latestClose);
    }

    return {
      name: placeDetails.name,
      address: placeDetails.formatted_address,
      city: city || 'Unknown',
      country: country || 'Unknown',
      postalCode: postalCode,
      latitude: placeDetails.geometry.location.lat.toString(),
      longitude: placeDetails.geometry.location.lng.toString(),
      website: placeDetails.website,
      phoneNumber: placeDetails.formatted_phone_number,
      rating: placeDetails.rating?.toString(),
      googlePlacesId: placeDetails.place_id,
      imageUrl: placeDetails.photos?.[0] ? 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${placeDetails.photos[0].photo_reference}&key=${this.apiKey}` : 
        undefined,
      openingHours,
      opensAt,
      closesAt,
      isOpen24Hours
    };
  }

  private formatTime(time: string): string {
    // Convert HHMM format to HH:MM
    if (time.length === 4) {
      return `${time.substring(0, 2)}:${time.substring(2, 4)}`;
    }
    return time;
  }
}

export const googlePlacesService = new GooglePlacesService();