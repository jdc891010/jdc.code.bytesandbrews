import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { Request } from 'express';
import { imageProcessor, ImageProcessingOptions } from './image-processor.js';

// Ensure upload directories exist
const uploadDir = path.join(process.cwd(), 'client/public/uploads');
const coffeeShopsDir = path.join(uploadDir, 'coffee-shops');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(coffeeShopsDir)) {
  fs.mkdirSync(coffeeShopsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadType = (req.body as any).uploadType || 'coffee-shops';
    const destPath = path.join(uploadDir, uploadType);
    
    // Ensure destination directory exists
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }
    
    cb(null, destPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter for images only
const fileFilter: multer.Options['fileFilter'] = function (req: any, file: any, cb: any) {
  const allowedTypes = /jpeg|jpg|png|gif|webp|avif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp, avif)') as any);
  }
};

// Configure multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// Helper function to get relative URL for uploaded file
export const getImageUrl = (filename: string, uploadType: string = 'coffee-shops'): string => {
  return `/uploads/${uploadType}/${filename}`;
};

// Helper function to delete uploaded file
export const deleteImage = (filename: string, uploadType: string = 'coffee-shops'): boolean => {
  try {
    const filePath = path.join(uploadDir, uploadType, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

// Helper function to validate image file
export const validateImageFile = (file: Express.Multer.File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];

  if (!allowedTypes.includes(file.mimetype)) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, GIF, WebP, and AVIF are allowed.' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size too large. Maximum size is 5MB.' };
  }

  return { valid: true };
};

// Enhanced image processing function
export const processUploadedImage = async (
  file: Express.Multer.File,
  uploadType: string = 'coffee-shops',
  options?: ImageProcessingOptions
): Promise<{ imageUrl: string; thumbnailUrl?: string; processedSize: number; originalSize: number }> => {
  try {
    const outputDir = path.join(uploadDir, uploadType);
    const result = await imageProcessor.processImage(
      file.path,
      outputDir,
      file.filename,
      options
    );

    const urls = imageProcessor.getImageUrls(file.filename, uploadType);
    
    return {
      imageUrl: urls.imageUrl,
      thumbnailUrl: urls.thumbnailUrl,
      processedSize: result.processedSize,
      originalSize: result.originalSize
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to process image');
  }
};

// Enhanced delete function that handles processed images
export const deleteProcessedImage = async (filename: string, uploadType: string = 'coffee-shops'): Promise<boolean> => {
  try {
    return await imageProcessor.deleteProcessedImage(filename, uploadType);
  } catch (error) {
    console.error('Error deleting processed image:', error);
    return false;
  }
};

// Get optimized image URLs
export const getOptimizedImageUrls = (filename: string, uploadType: string = 'coffee-shops'): { imageUrl: string; thumbnailUrl?: string } => {
  return imageProcessor.getImageUrls(filename, uploadType);
};