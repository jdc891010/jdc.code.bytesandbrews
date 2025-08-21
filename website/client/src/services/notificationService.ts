import { apiRequest } from '../lib/queryClient';
import { ENV } from '../lib/env';

interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'info'; // Simplified to only info type for UI display
  timestamp: string;
  coffeeShopId?: string;
  priority: 'low' | 'medium' | 'high';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string; // Required location field
  isVerified: boolean; // Verification badge status
  expiresAt?: string;
}

interface DeepseekValidationRequest {
  message: string;
  context: string;
  userInput: string;
}

interface DeepseekValidationResponse {
  isValid: boolean;
  confidence: number;
  reason?: string;
  suggestedAction?: string;
}

class NotificationService {
  private static instance: NotificationService;
  private notifications: NotificationData[] = [];
  private listeners: ((notifications: NotificationData[]) => void)[] = [];
  private pollInterval: NodeJS.Timeout | null = null;
  private isPolling = false;

  private constructor() {
    this.notifications = [];
    this.listeners = [];
    this.isPolling = false;
    this.initializeMockNotifications();
    this.startPolling();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Subscribe to notification updates
  subscribe(callback: (notifications: NotificationData[]) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  // Validate notification content with Deepseek API
  private async validateWithDeepseek(request: DeepseekValidationRequest): Promise<DeepseekValidationResponse> {
    try {
      const deepseekApiKey = ENV.DEEPSEEK_API_KEY || 'sk-73408321b0414f6da08ac5e7b2dcc341';
      
      if (!deepseekApiKey) {
        console.warn('Deepseek API key not configured, skipping validation');
        return { isValid: true, confidence: 0.5, reason: 'API key not configured' };
      }

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${deepseekApiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are a content validation assistant for a coffee shop discovery app. Validate if user-submitted notifications about coffee shops are appropriate, factual, and helpful. Respond with a JSON object containing: isValid (boolean), confidence (0-1), reason (string), and suggestedAction (string if needed).'
            },
            {
              role: 'user',
              content: `Please validate this notification:\n\nContext: ${request.context}\nUser Input: ${request.userInput}\nMessage: ${request.message}\n\nIs this appropriate for a coffee shop app?`
            }
          ],
          max_tokens: 200,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`Deepseek API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (content) {
        try {
          return JSON.parse(content);
        } catch {
          // Fallback parsing if JSON is malformed
          const isValid = content.toLowerCase().includes('true') || content.toLowerCase().includes('valid');
          return {
            isValid,
            confidence: 0.7,
            reason: 'Parsed from text response'
          };
        }
      }

      return { isValid: true, confidence: 0.5, reason: 'No response from API' };
    } catch (error) {
      console.error('Deepseek validation error:', error);
      // Fail open - allow notification but with low confidence
      return { isValid: true, confidence: 0.3, reason: 'Validation service unavailable' };
    }
  }

  // Add a new notification with validation (legacy method)
  async addNotification(
    title: string,
    message: string,
    type: NotificationData['type'] = 'info',
    priority: NotificationData['priority'] = 'medium',
    coffeeShopId?: string,
    expiresAt?: string
  ): Promise<boolean> {
    try {
      // Validate with Deepseek API
      const validation = await this.validateWithDeepseek({
        message,
        context: `Coffee shop notification - ${type} priority ${priority}`,
        userInput: `${title}: ${message}`
      });

      if (!validation.isValid && validation.confidence > 0.7) {
        console.warn('Notification rejected by validation:', validation.reason);
        return false;
      }

      const notification: NotificationData = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title,
        message,
        type,
        priority,
        timestamp: new Date().toISOString(),
        severity: priority === 'high' ? 'high' : priority === 'medium' ? 'medium' : 'low',
        location: 'Unknown',
        isVerified: false,
        coffeeShopId,
        expiresAt
      };

      this.notifications.unshift(notification);
      
      // Keep only the latest 50 notifications
      if (this.notifications.length > 50) {
        this.notifications = this.notifications.slice(0, 50);
      }

      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Error adding notification:', error);
      return false;
    }
  }

  // Add a notification object directly (new method)
  async addNotificationObject(notification: Omit<NotificationData, 'id' | 'timestamp'>): Promise<boolean> {
    try {
      // Validate with Deepseek API
      const validation = await this.validateWithDeepseek({
        message: notification.message,
        context: `Coffee shop notification - ${notification.type} priority ${notification.priority}`,
        userInput: `${notification.title}: ${notification.message}`
      });

      if (!validation.isValid && validation.confidence > 0.7) {
        console.warn('Notification rejected by validation:', validation.reason);
        return false;
      }

      const fullNotification: NotificationData = {
        ...notification,
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
      };

      this.notifications.unshift(fullNotification);
      
      // Keep only the latest 50 notifications
      if (this.notifications.length > 50) {
        this.notifications = this.notifications.slice(0, 50);
      }

      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Error adding notification:', error);
      return false;
    }
  }

  // Remove a notification
  removeNotification(id: string) {
    this.notifications = this.notifications.filter(notif => notif.id !== id);
    this.notifyListeners();
  }

  // Get all notifications
  getNotifications(): NotificationData[] {
    return [...this.notifications];
  }

  // Get notifications by type
  getNotificationsByType(type: NotificationData['type']): NotificationData[] {
    return this.notifications.filter(notif => notif.type === type);
  }

  // Get notifications by coffee shop
  getNotificationsByCoffeeShop(coffeeShopId: string): NotificationData[] {
    return this.notifications.filter(notif => notif.coffeeShopId === coffeeShopId);
  }

  // Clear expired notifications
  private clearExpiredNotifications() {
    const now = new Date().toISOString();
    const beforeCount = this.notifications.length;
    
    this.notifications = this.notifications.filter(notif => 
      !notif.expiresAt || notif.expiresAt > now
    );

    if (this.notifications.length !== beforeCount) {
      this.notifyListeners();
    }
  }

  // Start polling for live notifications (simulated)
  startLivePolling(intervalMs: number = 30000) {
    if (this.isPolling) return;

    this.isPolling = true;
    this.pollInterval = setInterval(() => {
      this.clearExpiredNotifications();
      this.simulateLiveNotifications();
    }, intervalMs);
  }

  // Stop polling
  stopLivePolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.isPolling = false;
  }

  private mockNotifications: NotificationData[] = [
    {
      id: '1',
      type: 'info',
      title: 'Welcome to Brews & Bytes!',
      message: 'Discover the best coffee shops for remote work in your area.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      priority: 'medium',
      severity: 'low',
      location: 'General',
      isVerified: true
    },
    {
      id: '2',
      type: 'info',
      title: 'New Coffee Shop Added',
      message: 'Blue Bottle Coffee in downtown is now available with excellent WiFi!',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      priority: 'high',
      severity: 'medium',
      location: 'Downtown',
      isVerified: true
    },
    {
      id: '3',
      type: 'info',
      title: 'WiFi Speed Alert',
      message: 'Starbucks on Main St is experiencing slower internet speeds today.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      priority: 'medium',
      severity: 'medium',
      location: 'Main Street',
      isVerified: true,
      coffeeShopId: 'starbucks-main'
    },
    {
      id: '4',
      type: 'info',
      title: 'Happy Hour Special',
      message: 'Local Grounds is offering 20% off all drinks from 3-5 PM today!',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      priority: 'low',
      severity: 'low',
      location: 'Local Grounds Café',
      isVerified: true,
      coffeeShopId: 'local-grounds'
    },
    {
      id: '5',
      type: 'info',
      title: 'Review Submitted',
      message: 'Thank you for reviewing Café Luna! Your feedback helps the community.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      priority: 'low',
      severity: 'low',
      location: 'Café Luna',
      isVerified: true,
      coffeeShopId: 'cafe-luna'
    },
    {
      id: '6',
      type: 'info',
      title: 'Location Services',
      message: 'Unable to detect your location. Please enable location services for better recommendations.',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      priority: 'high',
      severity: 'high',
      location: 'System',
      isVerified: true
    },
    {
      id: '7',
      type: 'info',
      title: 'New Feature Available',
      message: 'Try our new noise level indicator to find the perfect work environment!',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
      severity: 'low',
      location: 'App Features',
      isVerified: true
    },
    {
      id: '8',
      type: 'info',
      title: 'Busy Period Alert',
      message: 'The Coffee Bean is currently at 90% capacity. Consider visiting later.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
      severity: 'medium',
      location: 'The Coffee Bean',
      isVerified: true,
      coffeeShopId: 'coffee-bean'
    },
    {
      id: '9',
      type: 'info',
      title: 'Playlist Updated',
      message: 'Your Coffee Shop Vibes playlist has been updated with 5 new tracks!',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      priority: 'low',
      severity: 'low',
      location: 'Music Features',
      isVerified: true
    },
    {
      id: '10',
      type: 'info',
      title: 'Weekend Hours',
      message: 'Reminder: Many coffee shops have extended hours this weekend for remote workers.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      priority: 'low',
      severity: 'low',
      location: 'General',
      isVerified: true
    }
  ];

  // Initialize with mock notifications for demo purposes
  private initializeMockNotifications() {
     
    this.notifications = this.mockNotifications;
    this.notifyListeners();
  }

  // Start polling for live notifications
  startPolling() {
    if (this.isPolling) return;
    
    this.isPolling = true;
    this.simulateLiveNotifications();
  }

  // Stop polling for live notifications
  stopPolling() {
    this.isPolling = false;
  }

  // Simulate live notifications for demo purposes
  private async simulateLiveNotifications() {
    const sampleNotifications = [
      {
        title: 'WiFi Update',
        message: 'Blue Waters Café WiFi speed improved to 65 Mbps',
        type: 'info' as const,
        priority: 'medium' as const,
        severity: 'medium' as const,
        location: 'Blue Waters Café',
        isVerified: true,
        coffeeShopId: 'blue-waters-cafe'
      },
      {
        title: 'Temporary Closure',
        message: 'The Coffee Station will be closed for maintenance tomorrow 2-4 PM',
        type: 'info' as const,
        priority: 'high' as const,
        severity: 'high' as const,
        location: 'The Coffee Station',
        isVerified: true,
        coffeeShopId: 'coffee-station',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: 'New Coffee Shop',
        message: 'Artisan Brew House just opened on Main Street with excellent WiFi!',
        type: 'info' as const,
        priority: 'medium' as const,
        severity: 'low' as const,
        location: 'Main Street',
        isVerified: true
      },
      {
        title: 'Power Outage',
        message: 'Bootleggers Coffee experiencing power issues - limited outlets available',
        type: 'info' as const,
        priority: 'high' as const,
        severity: 'critical' as const,
        location: 'Bootleggers Coffee',
        isVerified: true,
        coffeeShopId: 'bootleggers-coffee',
        expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Randomly add a notification (10% chance per poll)
    if (Math.random() < 0.1) {
      const randomNotif = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
      await this.addNotificationObject(randomNotif);
    }
  }

  // Clear all notifications
  clearAll() {
    this.notifications = [];
    this.notifyListeners();
  }
}

export const notificationService = NotificationService.getInstance();
export type { NotificationData };