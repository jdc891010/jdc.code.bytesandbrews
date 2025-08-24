import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  generateThumbnail?: boolean;
  thumbnailSize?: number;
}

export interface ProcessedImage {
  originalPath: string;
  processedPath: string;
  thumbnailPath?: string;
  originalSize: number;
  processedSize: number;
  thumbnailSize?: number;
  width: number;
  height: number;
  format: string;
}

const defaultOptions: ImageProcessingOptions = {
  maxWidth: 1200,
  maxHeight: 800,
  quality: 85,
  format: 'webp',
  generateThumbnail: true,
  thumbnailSize: 300
};

export class ImageProcessor {
  private uploadDir: string;

  constructor(uploadDir: string) {
    this.uploadDir = uploadDir;
  }

  async processImage(
    inputPath: string,
    outputDir: string,
    filename: string,
    options: ImageProcessingOptions = {}
  ): Promise<ProcessedImage> {
    const opts = { ...defaultOptions, ...options };
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const inputStats = fs.statSync(inputPath);
    const originalSize = inputStats.size;

    // Generate output filenames
    const baseName = path.parse(filename).name;
    const processedFilename = `${baseName}.${opts.format}`;
    const thumbnailFilename = `${baseName}_thumb.${opts.format}`;
    
    const processedPath = path.join(outputDir, processedFilename);
    const thumbnailPath = path.join(outputDir, thumbnailFilename);

    try {
      // Process main image
      const sharpInstance = sharp(inputPath);
      const metadata = await sharpInstance.metadata();
      
      let processedImage = sharpInstance
        .resize(opts.maxWidth, opts.maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        });

      // Apply format and quality settings
      switch (opts.format) {
        case 'jpeg':
          processedImage = processedImage.jpeg({ quality: opts.quality });
          break;
        case 'png':
          processedImage = processedImage.png({ quality: opts.quality });
          break;
        case 'webp':
        default:
          processedImage = processedImage.webp({ quality: opts.quality });
          break;
      }

      await processedImage.toFile(processedPath);
      const processedStats = fs.statSync(processedPath);
      const processedSize = processedStats.size;

      const result: ProcessedImage = {
        originalPath: inputPath,
        processedPath,
        originalSize,
        processedSize,
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: opts.format || 'webp'
      };

      // Generate thumbnail if requested
      if (opts.generateThumbnail && opts.thumbnailSize) {
        const thumbnailImage = sharp(inputPath)
          .resize(opts.thumbnailSize, opts.thumbnailSize, {
            fit: 'cover',
            position: 'center'
          });

        switch (opts.format) {
          case 'jpeg':
            await thumbnailImage.jpeg({ quality: opts.quality }).toFile(thumbnailPath);
            break;
          case 'png':
            await thumbnailImage.png({ quality: opts.quality }).toFile(thumbnailPath);
            break;
          case 'webp':
          default:
            await thumbnailImage.webp({ quality: opts.quality }).toFile(thumbnailPath);
            break;
        }

        const thumbnailStats = fs.statSync(thumbnailPath);
        result.thumbnailPath = thumbnailPath;
        result.thumbnailSize = thumbnailStats.size;
      }

      // Clean up original file if it's different from processed
      if (inputPath !== processedPath) {
        fs.unlinkSync(inputPath);
      }

      return result;
    } catch (error) {
      // Clean up any created files on error
      if (fs.existsSync(processedPath)) {
        fs.unlinkSync(processedPath);
      }
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
      throw error;
    }
  }

  async deleteProcessedImage(filename: string, uploadType: string = 'coffee-shops'): Promise<boolean> {
    try {
      const baseName = path.parse(filename).name;
      const dir = path.join(this.uploadDir, uploadType);
      
      // Delete main image and thumbnail
      const extensions = ['webp', 'jpeg', 'jpg', 'png'];
      let deleted = false;
      
      for (const ext of extensions) {
        const mainFile = path.join(dir, `${baseName}.${ext}`);
        const thumbFile = path.join(dir, `${baseName}_thumb.${ext}`);
        
        if (fs.existsSync(mainFile)) {
          fs.unlinkSync(mainFile);
          deleted = true;
        }
        
        if (fs.existsSync(thumbFile)) {
          fs.unlinkSync(thumbFile);
          deleted = true;
        }
      }
      
      return deleted;
    } catch (error) {
      console.error('Error deleting processed image:', error);
      return false;
    }
  }

  getImageUrls(filename: string, uploadType: string = 'coffee-shops'): { imageUrl: string; thumbnailUrl?: string } {
    const baseName = path.parse(filename).name;
    const imageUrl = `/uploads/${uploadType}/${baseName}.webp`;
    const thumbnailUrl = `/uploads/${uploadType}/${baseName}_thumb.webp`;
    
    return { imageUrl, thumbnailUrl };
  }
}

// Export singleton instance
const uploadDir = path.join(process.cwd(), 'client/public/uploads');
export const imageProcessor = new ImageProcessor(uploadDir);