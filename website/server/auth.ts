import * as bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage.js';
import { AdminUser } from '../shared/schema.js';

// Configuration
const BCRYPT_ROUNDS = 12;

// Extended Request interface to include admin user
export interface AuthenticatedRequest extends Request {
  adminUser?: AdminUser;
}

// JWT Token utilities
export const generateToken = (adminUser: AdminUser): string => {
  // Temporary simple token generation until JWT is properly configured
  const payload = {
    id: adminUser.id,
    username: adminUser.username,
    email: adminUser.email,
    role: adminUser.role,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

export const verifyToken = (token: string): any => {
  try {
    // Temporary simple token verification until JWT is properly configured
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // Check if token is expired
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return payload;
  } catch (error) {
    return null;
  }
};

// Password utilities
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, BCRYPT_ROUNDS);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Authentication middleware
export const authenticateAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    // Get the admin user from storage
    const adminUser = await storage.getAdminUser(decoded.id);
    
    if (!adminUser || !adminUser.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Admin user not found or inactive'
      });
    }
    
    // Update last login time
    await storage.updateAdminUserLastLogin(adminUser.id);
    
    // Attach admin user to request
    req.adminUser = adminUser;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Role-based authorization middleware
export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.adminUser) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    if (!roles.includes(req.adminUser.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }
    
    next();
  };
};

// Create default admin user if none exists
export const createDefaultAdmin = async (): Promise<void> => {
  try {
    const existingAdmins = await storage.getAllAdminUsers();
    
    if (existingAdmins.length === 0) {
      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
      const hashedPassword = await hashPassword(defaultPassword);
      
      await storage.createAdminUser({
        username: 'admin',
        email: 'admin@brewsandbytes.com',
        password: hashedPassword,
        role: 'super_admin'
      });
      
      console.log('Default admin user created:');
      console.log('Username: admin');
      console.log('Password:', defaultPassword);
      console.log('Please change the password after first login!');
    }
  } catch (error) {
    console.error('Error creating default admin user:', error);
  }
};