import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Bell, Calendar, Users, Send } from 'lucide-react';
import { adminApi, type Notification } from '@/services/adminApi';

export default function NotificationManagement() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    targetAudience: 'all',
    isActive: true,
    scheduledAt: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      targetAudience: 'all',
      isActive: true,
      scheduledAt: ''
    });
    setEditingNotification(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (notification: Notification) => {
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      targetAudience: notification.targetAudience,
      isActive: notification.isActive,
      scheduledAt: notification.scheduledAt 
        ? new Date(notification.scheduledAt).toISOString().slice(0, 16)
        : ''
    });
    setEditingNotification(notification);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const notificationData = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        targetAudience: formData.targetAudience,
        isActive: formData.isActive,
        scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : undefined
      };

      if (editingNotification) {
        await adminApi.updateNotification(editingNotification.id, notificationData);
      } else {
        await adminApi.createNotification(notificationData);
      }

      await loadNotifications();
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save notification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      await adminApi.deleteNotification(id);
      await loadNotifications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete notification');
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case 'info':
      default:
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
    }
  };

  const getAudienceBadge = (audience: string) => {
    switch (audience) {
      case 'admins':
        return <Badge variant="outline">Admins Only</Badge>;
      case 'users':
        return <Badge variant="outline">Users Only</Badge>;
      case 'subscribers':
        return <Badge variant="outline">Subscribers</Badge>;
      case 'all':
      default:
        return <Badge variant="secondary">All Users</Badge>;
    }
  };

  const isScheduled = (notification: Notification) => {
    return notification.scheduledAt && new Date(notification.scheduledAt) > new Date();
  };

  const isSent = (notification: Notification) => {
    return !!notification.sentAt;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notification Management</h2>
          <p className="text-gray-600">Create and manage system notifications</p>
        </div>
        <Button onClick={handleCreate} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="h-4 w-4 mr-2" />
          New Notification
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={`hover:shadow-lg transition-shadow ${
            !notification.isActive ? 'opacity-60' : ''
          }`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-lg">{notification.title}</CardTitle>
                    {getTypeBadge(notification.type)}
                    {getAudienceBadge(notification.targetAudience)}
                  </div>
                  <CardDescription className="text-sm text-gray-600">
                    {notification.message}
                  </CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(notification)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(notification.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                {notification.isActive ? (
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
                
                {isSent(notification) && (
                  <Badge className="bg-purple-100 text-purple-800">
                    <Send className="h-3 w-3 mr-1" />
                    Sent
                  </Badge>
                )}
                
                {isScheduled(notification) && (
                  <Badge className="bg-blue-100 text-blue-800">
                    <Calendar className="h-3 w-3 mr-1" />
                    Scheduled
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
                <div>
                  <span className="font-medium">Created:</span><br />
                  {new Date(notification.createdAt).toLocaleString()}
                </div>
                
                {notification.scheduledAt && (
                  <div>
                    <span className="font-medium">Scheduled for:</span><br />
                    {new Date(notification.scheduledAt).toLocaleString()}
                  </div>
                )}
                
                {notification.sentAt && (
                  <div>
                    <span className="font-medium">Sent at:</span><br />
                    {new Date(notification.sentAt).toLocaleString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No notifications found</p>
            <Button onClick={handleCreate} variant="outline">
              Create your first notification
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingNotification ? 'Edit Notification' : 'Create New Notification'}
            </DialogTitle>
            <DialogDescription>
              {editingNotification ? 'Update the notification details.' : 'Create a new system notification.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={handleInputChange('title')}
                  placeholder="Notification title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={handleInputChange('message')}
                  placeholder="Notification message content"
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience *</Label>
                  <Select
                    value={formData.targetAudience}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, targetAudience: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="users">Users Only</SelectItem>
                      <SelectItem value="subscribers">Subscribers</SelectItem>
                      <SelectItem value="admins">Admins Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Schedule For (Optional)</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={handleInputChange('scheduledAt')}
                  min={new Date().toISOString().slice(0, 16)}
                />
                <p className="text-xs text-gray-500">
                  Leave empty to send immediately when activated
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Active</Label>
                <p className="text-xs text-gray-500 ml-2">
                  Only active notifications will be displayed
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-amber-600 hover:bg-amber-700"
              >
                {isSubmitting ? 'Saving...' : (editingNotification ? 'Update' : 'Create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}