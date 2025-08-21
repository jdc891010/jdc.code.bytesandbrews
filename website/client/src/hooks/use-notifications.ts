import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationService, NotificationData } from '../services/notificationService';
import { useToast } from './use-toast';

interface UseNotificationsOptions {
  autoShowToasts?: boolean;
  enableLivePolling?: boolean;
  pollIntervalMs?: number;
  maxToastNotifications?: number;
}

interface UseNotificationsReturn {
  notifications: NotificationData[];
  unreadCount: number;
  addNotification: (notification: Omit<NotificationData, 'id' | 'timestamp'>) => Promise<boolean>;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  getNotificationsByType: (type: NotificationData['type']) => NotificationData[];
  getNotificationsByCoffeeShop: (coffeeShopId: string) => NotificationData[];
  isLoading: boolean;
}

export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
  const {
    autoShowToasts = true,
    enableLivePolling = true,
    pollIntervalMs = 30000,
    maxToastNotifications = 3
  } = options;

  const [notifications, setNotifications] = useState<NotificationData[]>(() => 
    notificationService.getNotifications()
  );
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Refs for tracking toast queue
  const toastQueue = useRef<{id: string, priority: NotificationData['priority']}[]>([]);
  const activeToasts = useRef(0);
  const processingQueue = useRef(false);

  // Process toast queue
  const processToastQueue = useCallback(() => {
    if (processingQueue.current || activeToasts.current >= maxToastNotifications || toastQueue.current.length === 0) {
      processingQueue.current = false;
      return;
    }

    processingQueue.current = true;
    const nextToast = toastQueue.current.shift();
    
    if (nextToast) {
      const notif = notifications.find(n => n.id === nextToast.id);
      if (notif) {
        const toastVariant = getToastVariant(notif.type);
        const duration = getToastDuration(nextToast.priority);
        
        toast({
          title: notif.title,
          description: notif.message,
          variant: toastVariant,
          duration: duration
        });
        
        activeToasts.current++;
        
        // Decrease active toast count after duration
        setTimeout(() => {
          activeToasts.current = Math.max(0, activeToasts.current - 1);
          processToastQueue(); // Process next in queue
        }, duration);
      }
    }
    
    processingQueue.current = false;
  }, [notifications, maxToastNotifications, toast]);

  // Helper function to get toast variant based on notification type
  const getToastVariant = (type: NotificationData['type']): 'default' | 'destructive' => {
    switch (type) {
      case 'info':
      default:
        return 'default';
    }
  };

  // Helper function to get toast duration based on priority
  const getToastDuration = (priority: NotificationData['priority']): number => {
    switch (priority) {
      case 'high':
        return 8000; // 8 seconds
      case 'medium':
        return 5000; // 5 seconds
      case 'low':
        return 3000; // 3 seconds
      default:
        return 5000;
    }
  };

  // Handle notification updates from service
  useEffect(() => {
    const unsubscribe = notificationService.subscribe((newNotifications) => {
      setNotifications(newNotifications);
      
      // Show toast notifications for new notifications
      if (autoShowToasts) {
        const previousIds = new Set(notifications.map(n => n.id));
        const newNotifs = newNotifications.filter(n => !previousIds.has(n.id));
        
        if (newNotifs.length > 0) {
          // Add new notifications to toast queue
          newNotifs.forEach(notif => {
            toastQueue.current.push({id: notif.id, priority: notif.priority});
          });
          
          // Process the queue
          processToastQueue();
        }
      }
    });

    return unsubscribe;
  }, [notifications, autoShowToasts, processToastQueue]);

  // Start/stop live polling
  useEffect(() => {
    if (enableLivePolling) {
      notificationService.startLivePolling(pollIntervalMs);
    }

    return () => {
      if (enableLivePolling) {
        notificationService.stopLivePolling();
      }
    };
  }, [enableLivePolling, pollIntervalMs]);

  // Add notification wrapper
  const addNotification = useCallback(async (
    notification: Omit<NotificationData, 'id' | 'timestamp'>
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await notificationService.addNotificationObject(notification);
      return success;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Remove notification wrapper
  const removeNotification = useCallback((id: string) => {
    notificationService.removeNotification(id);
    setReadNotifications(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    notificationService.clearAll();
    setReadNotifications(new Set());
    toastQueue.current = [];
    activeToasts.current = 0;
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setReadNotifications(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    const allIds = notifications.map(n => n.id);
    setReadNotifications(new Set(allIds));
  }, [notifications]);

  // Get notifications by type
  const getNotificationsByType = useCallback((type: NotificationData['type']) => {
    return notificationService.getNotificationsByType(type);
  }, []);

  // Get notifications by coffee shop
  const getNotificationsByCoffeeShop = useCallback((coffeeShopId: string) => {
    return notificationService.getNotificationsByCoffeeShop(coffeeShopId);
  }, []);

  // Calculate unread count
  const readIds = Array.from(readNotifications);
  const unreadCount = notifications.filter(n => !readIds.includes(n.id)).length;

  return {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    clearAll,
    markAsRead,
    markAllAsRead,
    getNotificationsByType,
    getNotificationsByCoffeeShop,
    isLoading
  }
}

export type { NotificationData };