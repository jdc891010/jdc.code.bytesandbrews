// Service for fetching coffee shops from the database

export interface CoffeeShop {
  id: number;
  name: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  latitude?: string;
  longitude?: string;
  website?: string;
  phoneNumber?: string;
  rating?: number;
  googlePlacesId?: string;
  userRatingCount?: number;
  businessStatus?: string;
  googleMapsUri?: string;
  openingHours?: string;
  opensAt?: string;
  closesAt?: string;
  isOpen24Hours?: boolean;
  wifiSpeed?: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  tribe?: string;
  vibe?: string;
  amenities?: string;
  priceLevel?: number;
}

export interface CoffeeShopsResponse {
  success: boolean;
  coffeeShops: CoffeeShop[];
  total: number;
}

export interface Special {
  id: number;
  title: string;
  description: string;
  coffeeShopId: number;
  discountType: string;
  discountValue?: number;
  originalPrice?: number;
  specialPrice?: number;
  terms?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  displayOnHomepage: boolean;
  placeName?: string;
  discountedPrice?: number;
}

export interface FeaturedSpot {
  id: number;
  coffeeShopId: number;
  title?: string;
  description?: string;
  month: number;
  year: number;
  isActive: boolean;
  placeName?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
}

/**
 * Fetch coffee shops from the database
 * @param lat - Optional latitude for location-based filtering
 * @param lng - Optional longitude for location-based filtering
 * @param radius - Optional radius in meters for location-based filtering
 */
export async function getCoffeeShops(
  lat?: number,
  lng?: number,
  radius?: number
): Promise<CoffeeShopsResponse> {
  try {
    const params = new URLSearchParams();

    if (lat !== undefined && lng !== undefined && radius !== undefined) {
      params.append('lat', lat.toString());
      params.append('lng', lng.toString());
      params.append('radius', radius.toString());
    }

    const url = `/api/coffee-shops${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch coffee shops');
    }

    return data;
  } catch (error) {
    console.error('Error fetching coffee shops:', error);
    throw error;
  }
}

/**
 * Cache for storing coffee shop data
 */
class CoffeeShopCache {
  private cache: Map<string, { data: CoffeeShopsResponse; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(lat?: number, lng?: number, radius?: number): string {
    if (lat !== undefined && lng !== undefined && radius !== undefined) {
      return `${lat.toFixed(4)}_${lng.toFixed(4)}_${radius}`;
    }
    return 'all';
  }

  get(lat?: number, lng?: number, radius?: number): CoffeeShopsResponse | null {
    const key = this.getCacheKey(lat, lng, radius);
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    // Remove expired cache entry
    if (cached) {
      this.cache.delete(key);
    }

    return null;
  }

  set(data: CoffeeShopsResponse, lat?: number, lng?: number, radius?: number): void {
    const key = this.getCacheKey(lat, lng, radius);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

// Global cache instance
const coffeeShopCache = new CoffeeShopCache();

/**
 * Fetch coffee shops with caching
 * This function first checks the cache, then falls back to API call
 */
export async function getCoffeeShopsWithCache(
  lat?: number,
  lng?: number,
  radius?: number
): Promise<CoffeeShopsResponse> {
  // Try to get from cache first
  const cached = coffeeShopCache.get(lat, lng, radius);
  if (cached) {
    console.log('Using cached coffee shop data');
    return cached;
  }

  // Fetch from API
  console.log('Fetching coffee shops from database');
  const data = await getCoffeeShops(lat, lng, radius);

  // Cache the result
  coffeeShopCache.set(data, lat, lng, radius);

  return data;
}

/**
 * Clear the coffee shop cache
 * Useful when coffee shops are added/updated/deleted
 */
export function clearCoffeeShopCache(): void {
  coffeeShopCache.clear();
}

export async function getSpecials(): Promise<{ success: boolean; specials: Special[] }> {
  try {
    const response = await fetch('/api/specials');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching specials:', error);
    throw error;
  }
}

export async function getFeaturedSpots(): Promise<{ success: boolean; featuredSpots: FeaturedSpot[] }> {
  try {
    const response = await fetch('/api/featured-spots');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured spots:', error);
    throw error;
  }
}