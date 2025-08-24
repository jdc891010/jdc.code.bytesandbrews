import { Express, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { storage } from './storage.js';
import { 
  generateToken, 
  comparePassword, 
  hashPassword, 
  authenticateAdmin, 
  requireRole,
  AuthenticatedRequest 
} from './auth.js';
import { 
  adminUserSchema, 
  coffeeShopSchema, 
  couponSchema, 
  blogPostSchema, 
  notificationSchema 
} from '../shared/schema.js';
import { upload, getImageUrl, deleteImage, validateImageFile, processUploadedImage, deleteProcessedImage, getOptimizedImageUrls } from './upload.js';
import { googlePlacesService } from './google-places.js';

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many login attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
} as any);

// Login schema
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

// Change password schema
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters')
});

export function setupAdminRoutes(app: Express) {
  // Admin login
  app.post('/api/admin/login', loginLimiter as any, async (req: Request, res: Response) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      // Find admin user
      const adminUser = await storage.getAdminUserByUsername(username);
      
      if (!adminUser || !adminUser.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
      
      // Verify password
      const isValidPassword = await comparePassword(password, adminUser.password);
      
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
      
      // Update last login
      await storage.updateAdminUserLastLogin(adminUser.id);
      
      // Generate JWT token
      const token = generateToken(adminUser);
      
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: adminUser.id,
          username: adminUser.username,
          email: adminUser.email,
          role: adminUser.role
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid login data',
          errors: error.errors
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Login failed'
      });
    }
  });
  
  // Admin profile
  app.get('/api/admin/profile', authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
    return res.status(200).json({
      success: true,
      user: {
        id: req.adminUser!.id,
        username: req.adminUser!.username,
        email: req.adminUser!.email,
        role: req.adminUser!.role,
        lastLogin: req.adminUser!.lastLogin
      }
    });
  });
  
  // Change password
  app.post('/api/admin/change-password', authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
      
      // Verify current password
      const isValidPassword = await comparePassword(currentPassword, req.adminUser!.password);
      
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
      
      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);
      
      // Update password
      await storage.updateAdminUser(req.adminUser!.id, {
        password: hashedNewPassword
      });
      
      return res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid password data',
          errors: error.errors
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to change password'
      });
    }
  });
  
  // Dashboard analytics
  app.get('/api/admin/dashboard', authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const [contacts, signups, subscribers, coffeeShops, coupons, blogPosts, notifications] = await Promise.all([
        storage.getAllContacts(),
        storage.getAllSignUps(),
        storage.getAllSubscribers(),
        storage.getAllCoffeeShops(),
        storage.getAllCoupons(),
        storage.getAllBlogPosts(),
        storage.getAllNotifications()
      ]);
      
      return res.status(200).json({
        success: true,
        analytics: {
          totalContacts: contacts.length,
          totalSignups: signups.length,
          totalSubscribers: subscribers.length,
          totalCoffeeShops: coffeeShops.length,
          totalCoupons: coupons.length,
          totalBlogPosts: blogPosts.length,
          totalNotifications: notifications.length,
          recentContacts: contacts.slice(-5),
          recentSignups: signups.slice(-5)
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard data'
      });
    }
  });
  
  // Coffee Shop Management
  app.get('/api/admin/coffee-shops', authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const coffeeShops = await storage.getAllCoffeeShops();
      return res.status(200).json({
        success: true,
        coffeeShops
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch coffee shops'
      });
    }
  });
  
  app.post('/api/admin/coffee-shops', authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const coffeeShopData = coffeeShopSchema.parse(req.body);
      const coffeeShop = await storage.createCoffeeShop(coffeeShopData);
      
      return res.status(201).json({
        success: true,
        message: 'Coffee shop created successfully',
        coffeeShop
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid coffee shop data',
          errors: error.errors
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to create coffee shop'
      });
    }
  });
  
  app.put('/api/admin/coffee-shops/:id', authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const coffeeShopData = coffeeShopSchema.partial().parse(req.body);
      
      const updatedCoffeeShop = await storage.updateCoffeeShop(id, coffeeShopData);
      
      if (!updatedCoffeeShop) {
        return res.status(404).json({
          success: false,
          message: 'Coffee shop not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Coffee shop updated successfully',
        coffeeShop: updatedCoffeeShop
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid coffee shop data',
          errors: error.errors
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to update coffee shop'
      });
    }
  });
  
  app.delete('/api/admin/coffee-shops/:id', authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCoffeeShop(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Coffee shop not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Coffee shop deleted successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete coffee shop'
      });
    }
  });
  
  // Coupon Management
  app.get('/api/admin/coupons', authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const coupons = await storage.getAllCoupons();
      return res.status(200).json({
        success: true,
        coupons
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch coupons'
      });
    }
  });
  
  app.post('/api/admin/coupons', authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const couponData = couponSchema.parse(req.body);
      const coupon = await storage.createCoupon(couponData);
      
      return res.status(201).json({
        success: true,
        message: 'Coupon created successfully',
        coupon
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid coupon data',
          errors: error.errors
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to create coupon'
      });
    }
  });
  
  app.put('/api/admin/coupons/:id', authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const couponData = couponSchema.partial().parse(req.body);
      
      const updatedCoupon = await storage.updateCoupon(id, couponData);
      
      if (!updatedCoupon) {
        return res.status(404).json({
          success: false,
          message: 'Coupon not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Coupon updated successfully',
        coupon: updatedCoupon
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid coupon data',
          errors: error.errors
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to update coupon'
      });
    }
  });
  
  app.delete('/api/admin/coupons/:id', authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCoupon(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Coupon not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Coupon deleted successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete coupon'
      });
    }
  });
  
  // Blog Management
  app.get('/api/admin/blog-posts', authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const blogPosts = await storage.getAllBlogPosts();
      return res.status(200).json({
        success: true,
        blogPosts
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch blog posts'
      });
    }
  });
  
  app.post('/api/admin/blog-posts', authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const blogPostData = blogPostSchema.parse(req.body);
      const blogPost = await storage.createBlogPost(blogPostData);
      
      return res.status(201).json({
        success: true,
        message: 'Blog post created successfully',
        blogPost
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid blog post data',
          errors: error.errors
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to create blog post'
      });
    }
  });
  
  app.put('/api/admin/blog-posts/:id', authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const blogPostData = blogPostSchema.partial().parse(req.body);
      
      const updatedBlogPost = await storage.updateBlogPost(id, blogPostData);
      
      if (!updatedBlogPost) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Blog post updated successfully',
        blogPost: updatedBlogPost
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid blog post data',
          errors: error.errors
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to update blog post'
      });
    }
  });
  
  app.delete('/api/admin/blog-posts/:id', authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBlogPost(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Blog post deleted successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete blog post'
      });
    }
  });
  
  // Notification Management
  app.get('/api/admin/notifications', authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const notifications = await storage.getAllNotifications();
      return res.status(200).json({
        success: true,
        notifications
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch notifications'
      });
    }
  });
  
  app.post('/api/admin/notifications', authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const notificationData = notificationSchema.parse(req.body);
      const notification = await storage.createNotification(notificationData);
      
      return res.status(201).json({
        success: true,
        message: 'Notification created successfully',
        notification
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid notification data',
          errors: error.errors
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to create notification'
      });
    }
  });
  
  app.put('/api/admin/notifications/:id', authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const notificationData = notificationSchema.partial().parse(req.body);
      
      const updatedNotification = await storage.updateNotification(id, notificationData);
      
      if (!updatedNotification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Notification updated successfully',
        notification: updatedNotification
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid notification data',
          errors: error.errors
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to update notification'
      });
    }
  });
  
  app.delete('/api/admin/notifications/:id', authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteNotification(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Notification deleted successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete notification'
      });
    }
  });
  
  // User Management (Super Admin only)
  app.get('/api/admin/users', authenticateAdmin, requireRole(['super_admin']), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const adminUsers = await storage.getAllAdminUsers();
      // Remove password from response
      const safeUsers = adminUsers.map(({ password, ...user }) => user);
      
      return res.status(200).json({
        success: true,
        users: safeUsers
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch admin users'
      });
    }
  });
  
  app.post('/api/admin/users', authenticateAdmin, requireRole(['super_admin']), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userData = adminUserSchema.parse(req.body) as { username: string; email: string; password: string; role: string };
      
      // Hash password
      const hashedPassword = await hashPassword(userData.password);
      
      const adminUser = await storage.createAdminUser({
        ...userData,
        password: hashedPassword
      });
      
      // Remove password from response
      const { password: _, ...safeUser } = adminUser;
      
      return res.status(201).json({
        success: true,
        message: 'Admin user created successfully',
        user: safeUser
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user data',
          errors: error.errors
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to create admin user'
      });
    }
  });

  // Enhanced Image Upload Routes with compression and thumbnail generation
  app.post('/api/admin/upload/image', authenticateAdmin, upload.single('image'), async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
      }

      // Validate the uploaded file
      const validation = validateImageFile(req.file);
      if (!validation.valid) {
        // Delete the uploaded file if validation fails
        deleteImage(req.file.filename, req.body.uploadType || 'coffee-shops');
        return res.status(400).json({
          success: false,
          message: validation.error
        });
      }

      // Process the image with compression and thumbnail generation
      const uploadType = req.body.uploadType || 'coffee-shops';
      const processingOptions = {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 85,
        format: 'webp' as const,
        generateThumbnail: true,
        thumbnailSize: 300
      };

      const processedResult = await processUploadedImage(req.file, uploadType, processingOptions);
      
      return res.status(200).json({
        success: true,
        message: 'Image uploaded and processed successfully',
        imageUrl: processedResult.imageUrl,
        thumbnailUrl: processedResult.thumbnailUrl,
        filename: req.file.filename,
        originalSize: processedResult.originalSize,
        processedSize: processedResult.processedSize,
        compressionRatio: Math.round((1 - processedResult.processedSize / processedResult.originalSize) * 100)
      });
    } catch (error) {
      console.error('Image upload error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload and process image'
      });
    }
  });

  app.delete('/api/admin/upload/image/:filename', authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { filename } = req.params;
      const { uploadType = 'coffee-shops' } = req.query;
      
      if (!filename) {
        return res.status(400).json({
          success: false,
          message: 'Filename is required'
        });
      }

      // Use enhanced delete function that handles processed images and thumbnails
      const deleted = await deleteProcessedImage(filename, uploadType as string);
      
      if (deleted) {
        return res.status(200).json({
          success: true,
          message: 'Image and thumbnail deleted successfully'
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'Image not found'
        });
      }
    } catch (error) {
      console.error('Image deletion error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete image'
      });
    }
  });

  // Google Places API routes
  app.get('/api/admin/places/search', authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { query, lat, lng, radius } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const location = lat && lng ? {
        lat: parseFloat(lat as string),
        lng: parseFloat(lng as string)
      } : undefined;

      const searchRadius = radius ? parseInt(radius as string) : 5000;
      
      const places = await googlePlacesService.searchPlaces(query, location, searchRadius);
      
      return res.status(200).json({
        success: true,
        data: places
      });
    } catch (error) {
      console.error('Places search error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to search places'
      });
    }
  });

  app.get('/api/admin/places/details/:placeId', authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { placeId } = req.params;
      
      if (!placeId) {
        return res.status(400).json({
          success: false,
          message: 'Place ID is required'
        });
      }

      const placeDetails = await googlePlacesService.getPlaceDetails(placeId);
      const coffeeShopData = googlePlacesService.convertToShopData(placeDetails);
      
      return res.status(200).json({
        success: true,
        data: coffeeShopData
      });
    } catch (error) {
      console.error('Place details error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get place details'
      });
    }
  });
}