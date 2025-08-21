import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertCircle, MapPin, Shield } from 'lucide-react';
import { notificationService } from '../services/notificationService';

interface NotificationFormData {
  title: string;
  message: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface NotificationFormProps {
  onSubmit?: (data: NotificationFormData) => void;
  onClose?: () => void;
}

export const NotificationForm: React.FC<NotificationFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<NotificationFormData>({
    title: '',
    message: '',
    location: '',
    severity: 'low'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<NotificationFormData & { recaptcha?: string }>>({});
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  
  // reCAPTCHA v3 site key
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeDga0rAAAAANnh8hmk6DWmpCfJjxG4NvenlV8Q'; // v3 key

  const validateForm = (): boolean => {
    const newErrors: Partial<NotificationFormData & { recaptcha?: string }> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!recaptchaToken) {
      newErrors.recaptcha = 'Please complete the reCAPTCHA verification';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !recaptchaToken) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create notification through service
      const newNotification = {
        type: 'info' as const,
        title: formData.title,
        message: formData.message,
        location: formData.location,
        severity: formData.severity,
        priority: formData.severity === 'critical' ? 'high' as const : 
                 formData.severity === 'high' ? 'high' as const : 
                 formData.severity === 'medium' ? 'medium' as const : 'low' as const,
        isVerified: false // New notifications start unverified
      };
      
      await notificationService.addNotificationObject(newNotification);
      
      if (onSubmit) {
        onSubmit(formData);
      }
      
      // Reset form
      setFormData({
        title: '',
        message: '',
        location: '',
        severity: 'low'
      });
      setRecaptchaToken(null);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Failed to submit notification:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Create New Notification
        </CardTitle>
        <CardDescription>
          Submit a new notification for the community. All submissions are reviewed before being published.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter notification title"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message *
            </label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Enter your notification message"
              rows={4}
              className={errors.message ? 'border-red-500' : ''}
            />
            {errors.message && (
              <p className="text-sm text-red-600">{errors.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Location *
            </label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Enter location (e.g., Downtown Coffee Shop, Main Street)"
              className={errors.location ? 'border-red-500' : ''}
            />
            {errors.location && (
              <p className="text-sm text-red-600">{errors.location}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="severity" className="text-sm font-medium">
              Severity
            </label>
            <Select
              value={formData.severity}
              onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => 
                setFormData({ ...formData, severity: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select severity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor('low')}>Low</Badge>
                    <span>General information</span>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor('medium')}>Medium</Badge>
                    <span>Important updates</span>
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor('high')}>High</Badge>
                    <span>Urgent notifications</span>
                  </div>
                </SelectItem>
                <SelectItem value="critical">
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor('critical')}>Critical</Badge>
                    <span>Emergency alerts</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Verification Process</h4>
                <div className="text-sm text-blue-700 mt-1">
                  All notifications are reviewed by our moderation team before being published. 
                  Verified notifications will display a <Badge className="bg-green-100 text-green-800 border-green-200 ml-1">✓ Verified</Badge> badge.
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center">
              {/* @ts-ignore */}
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={handleRecaptchaChange}
                theme="light"
              />
            </div>
            {'recaptcha' in errors && errors.recaptcha && (
              <p className="text-sm text-red-600 text-center">
                {errors.recaptcha}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !recaptchaToken}
              className="flex-1"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Notification'}
            </Button>
            {onClose && (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NotificationForm;