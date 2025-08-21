import React, { useState } from 'react';
import { useNotifications } from '../hooks/use-notifications';
import { NotificationData } from '../services/notificationService';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Shield, MapPin } from 'lucide-react';

interface NotificationPanelProps {
  className?: string;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ className = '' }) => {
  const {
    notifications,
    unreadCount,
    removeNotification,
    clearAll,
    markAsRead,
    markAllAsRead,
    addNotification,
    isLoading
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'verified') return notif.isVerified;
    if (filter === 'unverified') return !notif.isVerified;
    return true; // 'all'
  });

  // Get notification icon (simplified to info only)
  const getNotificationIcon = () => {
    return 'ℹ️';
  };

  // Get notification color based on severity
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  // Get severity badge color
  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority: NotificationData['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Navigate to Community Notifications section
  const navigateToCommunityNotifications = () => {
    setIsOpen(false); // Close the notification panel
    window.location.href = '/#community-notifications';
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`relative ${className}`}
          onClick={() => setIsOpen(true)}
        >
          <i className="fas fa-comments mr-2"></i>
          Community Updates
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Live Notifications</span>
            <div className="flex items-center gap-2">
              {isLoading && (
                <div className="animate-spin h-4 w-4 border-2 border-tech-blue border-t-transparent rounded-full"></div>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <i className="fas fa-ellipsis-v"></i>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={navigateToCommunityNotifications}>
                    <i className="fas fa-plus mr-2"></i>
                    Add notification
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SheetTitle>
          <SheetDescription>
            Stay updated with real-time coffee shop information and app updates.
          </SheetDescription>
        </SheetHeader>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-4 mb-4">
          {(['all', 'verified', 'unverified'] as const).map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterType)}
              className="capitalize flex items-center gap-1"
            >
              {filterType === 'verified' && <Shield className="h-3 w-3" />}
              {filterType === 'all' ? 'All' : filterType}
              <span className="ml-1">
                {filterType === 'all' 
                  ? notifications.length
                  : filterType === 'verified'
                  ? notifications.filter(n => n.isVerified).length
                  : notifications.filter(n => !n.isVerified).length
                }
              </span>
            </Button>
          ))}
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[calc(100vh-200px)]">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-bell-slash text-4xl mb-4 opacity-50"></i>
              <p>No notifications yet</p>
              <p className="text-sm mt-2">We'll notify you about coffee shop updates and app news</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification, index) => {
                const isUnread = !notification.id || true; // For demo, treat all as unread initially
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                      getSeverityColor(notification.severity)
                    } ${isUnread ? 'ring-2 ring-blue-200' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-lg">{getNotificationIcon()}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h4 className="font-semibold text-sm">{notification.title}</h4>
                            {notification.isVerified && (
                              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs flex items-center gap-1 hover:bg-green-100">
                                <Shield className="h-3 w-3" />
                                Verified
                              </Badge>
                            )}
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getSeverityBadgeColor(notification.severity)} hover:${getSeverityBadgeColor(notification.severity)}`}
                            >
                              {notification.severity}
                            </Badge>
                          </div>
                          <p className="text-sm opacity-90 mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between text-xs opacity-70">
                            <div className="flex items-center gap-3">
                              <span>{formatTimestamp(notification.timestamp)}</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {notification.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {/* Action buttons removed as requested */}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
              {unreadCount > 0 && ` • ${unreadCount} unread`}
            </span>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live updates enabled</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationPanel;