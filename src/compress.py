import os
import sys
import argparse
from PIL import Image
from pathlib import Path

def get_size_format(b, factor=1024, suffix="B"):
    """
    Scale bytes to its proper byte format
    e.g:
        1253656 => '1.20MB'
        1253656678 => '1.17GB'
    """
    for unit in ["", "K", "M", "G", "T", "P", "E", "Z"]:
        if b < factor:
            return f"{b:.2f}{unit}{suffix}"
        b /= factor
    return f"{b:.2f}Y{suffix}"

def compress_image(file_path, max_width=1200, quality=80, create_webp=True):
    """
    Compresses an image file.
    - Resizes if width > max_width
    - Optimizes JPEG/PNG compression
    - Optionally creates a WebP version
    """
    try:
        img = Image.open(file_path)
        original_size = os.path.getsize(file_path)
        ext = file_path.suffix.lower()
        
        # Handle transparency for JPEG
        if ext in ['.jpg', '.jpeg'] and img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
            
        # Resize if needed
        width, height = img.size
        if width > max_width:
            ratio = max_width / width
            new_height = int(height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            print(f"Resized {file_path.name}: {width}x{height} -> {max_width}x{new_height}")
            
        # Save optimized original
        if ext in ['.jpg', '.jpeg']:
            img.save(file_path, "JPEG", quality=quality, optimize=True)
        elif ext == '.png':
            # PNG optimization in PIL is limited but optimize=True helps
            img.save(file_path, "PNG", optimize=True)
            
        new_size = os.path.getsize(file_path)
        saved = original_size - new_size
        saved_percent = (saved / original_size) * 100 if original_size > 0 else 0
        
        print(f"Compressed {file_path.name}: {get_size_format(original_size)} -> {get_size_format(new_size)} (-{saved_percent:.1f}%)")
        
        # Create WebP version
        if create_webp:
            webp_path = file_path.with_suffix('.webp')
            # WebP supports transparency, so no need to convert mode usually,
            # but if we converted to RGB for JPG earlier, 'img' is now RGB.
            # If it was PNG (and we didn't convert to RGB), it might be RGBA.
            img.save(webp_path, "WEBP", quality=quality)
            webp_size = os.path.getsize(webp_path)
            print(f"Created WebP {webp_path.name}: {get_size_format(webp_size)}")
            
        return original_size, new_size
        
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return 0, 0

def main():
    parser = argparse.ArgumentParser(description="Compress images in a directory recursively.")
    parser.add_argument("directory", nargs="?", default=r"website\client\public\places_images", 
                        help="Target directory containing images")
    parser.add_argument("--max-width", type=int, default=1200, help="Maximum width for images")
    parser.add_argument("--quality", type=int, default=80, help="JPEG/WebP quality (0-100)")
    parser.add_argument("--no-webp", action="store_true", help="Skip WebP generation")
    
    args = parser.parse_args()
    
    target_dir = Path(args.directory)
    if not target_dir.exists():
        # Try relative to current script if absolute path fails
        target_dir = Path(os.getcwd()) / args.directory
        if not target_dir.exists():
            print(f"Directory not found: {target_dir}")
            sys.exit(1)
            
    print(f"Scanning {target_dir}...")
    
    image_extensions = {'.jpg', '.jpeg', '.png'}
    total_original = 0
    total_new = 0
    files_processed = 0
    
    for file_path in target_dir.rglob("*"):
        if file_path.is_file() and file_path.suffix.lower() in image_extensions:
            # Skip if it looks like a thumbnail or something we shouldn't touch? 
            # For now, process all.
            
            orig, new = compress_image(
                file_path, 
                max_width=args.max_width, 
                quality=args.quality,
                create_webp=not args.no_webp
            )
            
            total_original += orig
            total_new += new
            files_processed += 1
            
    print("\nSummary:")
    print(f"Processed {files_processed} images")
    print(f"Total Original Size: {get_size_format(total_original)}")
    print(f"Total New Size: {get_size_format(total_new)}")
    if total_original > 0:
        total_saved = total_original - total_new
        percent = (total_saved / total_original) * 100
        print(f"Total Saved: {get_size_format(total_saved)} ({percent:.1f}%)")

if __name__ == "__main__":
    main()
