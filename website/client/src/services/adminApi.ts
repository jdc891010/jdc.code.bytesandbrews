import { z } from 'zod';

const API_BASE = '/api/admin';

// Types
export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: AdminUser;
}

export interface DashboardAnalytics {
  totalContacts: number;
  totalSignups: number;
  totalSubscribers: number;
  totalCoffeeShops: number;
  totalCoupons: number;
  totalBlogPosts: number;
  totalNotifications: number;
  recentContacts: Array<{ id: number; name: string; email: string; message: string; createdAt: string }>;
  recentSignups: Array<{ id: number; email: string; createdAt: string }>;
}

export interface CoffeeShop {
  id: number;
  name: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  latitude?: string;
  longitude?: string;
  website?: string;
  phoneNumber?: string;
  rating?: string;
  googlePlacesId?: string;
  openingHours?: string; // JSON string of opening hours
  opensAt?: string; // Earliest opening time
  closesAt?: string; // Latest closing time
  isOpen24Hours?: boolean;
  wifiSpeed?: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaceSearchResult {
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

export interface Coupon {
  id: number;
  code: string;
  description: string;
  discountType: string;
  discountValue: number;
  minOrderAmount?: number;
  maxUses?: number;
  currentUses: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status: string;
  authorId?: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  targetAudience: string;
  isActive: boolean;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth utilities
class AdminAuthService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('admin_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('admin_token', token);
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('admin_token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    if (response.status === 401) {
      this.clearToken();
      throw new Error('Authentication required');
    }

    const data = await response.json();

    // Handle both success/failure response formats
    if (data.success === false) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (data.success && data.token) {
      this.setToken(data.token);
    }

    return data;
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  async getProfile(): Promise<AdminUser> {
    const data = await this.makeRequest<{ user: AdminUser }>(`${API_BASE}/profile`);
    return data.user;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.makeRequest(`${API_BASE}/change-password`, {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // Dashboard
  async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    const data = await this.makeRequest<{ analytics: DashboardAnalytics }>(`${API_BASE}/dashboard`);
    return data.analytics;
  }

  // Coffee Shops
  async getCoffeeShops(): Promise<CoffeeShop[]> {
    const data = await this.makeRequest<{ coffeeShops: CoffeeShop[] }>(`${API_BASE}/coffee-shops`);
    return data.coffeeShops;
  }

  async createCoffeeShop(coffeeShop: Omit<CoffeeShop, 'id' | 'createdAt' | 'updatedAt'>): Promise<CoffeeShop> {
    const data = await this.makeRequest<{ coffeeShop: CoffeeShop }>(`${API_BASE}/coffee-shops`, {
      method: 'POST',
      body: JSON.stringify(coffeeShop),
    });
    return data.coffeeShop;
  }

  async updateCoffeeShop(id: number, coffeeShop: Partial<Omit<CoffeeShop, 'id' | 'createdAt' | 'updatedAt'>>): Promise<CoffeeShop> {
    const data = await this.makeRequest<{ coffeeShop: CoffeeShop }>(`${API_BASE}/coffee-shops/${id}`, {
      method: 'PUT',
      body: JSON.stringify(coffeeShop),
    });
    return data.coffeeShop;
  }

  async deleteCoffeeShop(id: number): Promise<void> {
    await this.makeRequest(`${API_BASE}/coffee-shops/${id}`, {
      method: 'DELETE',
    });
  }

  // Coupons
  async getCoupons(): Promise<Coupon[]> {
    const data = await this.makeRequest<{ coupons: Coupon[] }>(`${API_BASE}/coupons`);
    return data.coupons;
  }

  async createCoupon(coupon: Omit<Coupon, 'id' | 'currentUses' | 'isActive' | 'createdAt' | 'updatedAt'>): Promise<Coupon> {
    const data = await this.makeRequest<{ coupon: Coupon }>(`${API_BASE}/coupons`, {
      method: 'POST',
      body: JSON.stringify(coupon),
    });
    return data.coupon;
  }

  async updateCoupon(id: number, coupon: Partial<Omit<Coupon, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Coupon> {
    const data = await this.makeRequest<{ coupon: Coupon }>(`${API_BASE}/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(coupon),
    });
    return data.coupon;
  }

  async deleteCoupon(id: number): Promise<void> {
    await this.makeRequest(`${API_BASE}/coupons/${id}`, {
      method: 'DELETE',
    });
  }

  // Blog Posts
  async getBlogPosts(): Promise<BlogPost[]> {
    const data = await this.makeRequest<{ blogPosts: BlogPost[] }>(`${API_BASE}/blog-posts`);
    return data.blogPosts;
  }

  async createBlogPost(blogPost: Omit<BlogPost, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
    const data = await this.makeRequest<{ blogPost: BlogPost }>(`${API_BASE}/blog-posts`, {
      method: 'POST',
      body: JSON.stringify(blogPost),
    });
    return data.blogPost;
  }

  async updateBlogPost(id: number, blogPost: Partial<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>>): Promise<BlogPost> {
    const data = await this.makeRequest<{ blogPost: BlogPost }>(`${API_BASE}/blog-posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blogPost),
    });
    return data.blogPost;
  }

  async deleteBlogPost(id: number): Promise<void> {
    await this.makeRequest(`${API_BASE}/blog-posts/${id}`, {
      method: 'DELETE',
    });
  }

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    const data = await this.makeRequest<{ notifications: Notification[] }>(`${API_BASE}/notifications`);
    return data.notifications;
  }

  async createNotification(notification: Omit<Notification, 'id' | 'isActive' | 'sentAt' | 'createdAt' | 'updatedAt'>): Promise<Notification> {
    const data = await this.makeRequest<{ notification: Notification }>(`${API_BASE}/notifications`, {
      method: 'POST',
      body: JSON.stringify(notification),
    });
    return data.notification;
  }

  async updateNotification(id: number, notification: Partial<Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Notification> {
    const data = await this.makeRequest<{ notification: Notification }>(`${API_BASE}/notifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(notification),
    });
    return data.notification;
  }

  async deleteNotification(id: number): Promise<void> {
    await this.makeRequest(`${API_BASE}/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin Users (Super Admin only)
  async getAdminUsers(): Promise<AdminUser[]> {
    const data = await this.makeRequest<{ users: AdminUser[] }>(`${API_BASE}/users`);
    return data.users;
  }

  async createAdminUser(user: { username: string; email: string; password: string; role: string }): Promise<AdminUser> {
    const data = await this.makeRequest<{ user: AdminUser }>(`${API_BASE}/users`, {
      method: 'POST',
      body: JSON.stringify(user),
    });
    return data.user;
  }

  // Image Upload
  async uploadImage(file: File, uploadType: string = 'coffee-shops'): Promise<{ imageUrl: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('uploadType', uploadType);

    const response = await fetch(`${API_BASE}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      },
      body: formData
    });

    if (response.status === 401) {
      this.clearToken();
      throw new Error('Authentication required');
    }

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.message || 'Failed to upload image');
    }

    return { imageUrl: data.imageUrl, filename: data.filename };
  }

  async deleteImage(filename: string, uploadType: string = 'coffee-shops'): Promise<void> {
    await this.makeRequest(`${API_BASE}/upload/image/${filename}?uploadType=${uploadType}`, {
      method: 'DELETE',
    });
  }

  // Google Places API
  async searchPlaces(query: string, lat?: number, lng?: number, radius?: number): Promise<PlaceSearchResult[]> {
    const params = new URLSearchParams({ query });
    if (lat !== undefined) params.append('lat', lat.toString());
    if (lng !== undefined) params.append('lng', lng.toString());
    if (radius !== undefined) params.append('radius', radius.toString());

    const response = await this.makeRequest<{ data: PlaceSearchResult[] }>(`${API_BASE}/places/search?${params.toString()}`);
    return response.data;
  }

  async getPlaceDetails(placeId: string): Promise<CoffeeShopData> {
    const response = await this.makeRequest<{ data: CoffeeShopData }>(`${API_BASE}/places/details/${placeId}`);
    return response.data;
  }
}

export const adminApi = new AdminAuthService();