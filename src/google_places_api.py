import os
import requests
import json
import logging
import re
from pathlib import Path
from typing import List, Dict, Optional

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Constants
API_KEY_ENV_VAR = "GOOGLE_PLACES_API_KEY"
BASE_URL = "https://places.googleapis.com/v1/places:searchText"
IMAGES_DIR = "places_images"
DATA_FILE = "places_data.json"

class GooglePlacesClient:
    """
    Client for interacting with the Google Places API (New).
    """
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.environ.get(API_KEY_ENV_VAR)
        if not self.api_key:
            logger.error(f"API Key not found. Please set {API_KEY_ENV_VAR} environment variable.")
            raise ValueError(f"API Key not found. Please set {API_KEY_ENV_VAR} environment variable.")
        
    def search_places(self, query: str) -> List[Dict]:
        """
        Search for places using the Google Places API (New) Text Search.
        
        Args:
            query (str): The text query to search for (e.g., "restaurants in Somerset West").
            
        Returns:
            List[Dict]: A list of place objects containing the requested details.
        """
        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": self.api_key,
            # FieldMask specifies which fields to return to save bandwidth and latency.
            # We request fields corresponding to the user's requirements:
            # - Name: displayName
            # - Address: formattedAddress
            # - Coordinates: location
            # - Ratings: rating, userRatingCount
            # - Meta info: businessStatus, types, priceLevel
            # - Accessibility: accessibilityOptions
            # - Contact: internationalPhoneNumber, websiteUri
            # - Photo: photos
            "X-Goog-FieldMask": (
                "places.id,"
                "places.displayName,"
                "places.formattedAddress,"
                "places.location,"
                "places.rating,"
                "places.userRatingCount,"
                "places.businessStatus,"
                "places.types,"
                "places.priceLevel,"
                "places.accessibilityOptions,"
                "places.internationalPhoneNumber,"
                "places.websiteUri,"
                "places.photos,"
                "places.regularOpeningHours"
            )
        }
        
        payload = {
            "textQuery": query
        }
        
        response = None
        try:
            logger.info(f"Searching for: {query}")
            response = requests.post(BASE_URL, headers=headers, json=payload)
            response.raise_for_status()
            
            data = response.json()
            places = data.get("places", [])
            logger.info(f"Found {len(places)} places for query: {query}")
            return places
            
        except requests.exceptions.RequestException as e:
            logger.error(f"API request failed: {e}")
            if response is not None:
                logger.error(f"Response content: {response.text}")
            raise

    def download_photo(self, photo_name: str, max_width: int = 1600, max_height: int = 1600) -> Optional[bytes]:
        """
        Download a photo from the Google Places API.
        
        Args:
            photo_name (str): The resource name of the photo (e.g., "places/PLACE_ID/photos/PHOTO_ID").
            max_width (int): The maximum width of the photo.
            max_height (int): The maximum height of the photo.
            
        Returns:
            bytes: The photo content if successful, None otherwise.
        """
        url = f"https://places.googleapis.com/v1/{photo_name}/media"
        params = {
            "key": self.api_key,
            "maxHeightPx": max_height,
            "maxWidthPx": max_width,
        }
        
        try:
            # By default, requests follows redirects. The API redirects to the image URL.
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.content
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to download photo {photo_name}: {e}")
            return None

def sanitize_filename(name: str) -> str:
    """Sanitize a string to be safe for use as a filename/directory name."""
    # Remove invalid characters
    return re.sub(r'[<>:"/\\|?*]', '', name).strip()

def save_places_data(places: List[Dict], filename: str):
    """
    Append places to a JSON file.
    Reads existing data, appends new unique places, and writes back.
    """
    existing_places = []
    if os.path.exists(filename):
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                existing_places = json.load(f)
        except json.JSONDecodeError:
            logger.warning(f"Could not decode {filename}, starting with empty list.")
    
    # Create a map of existing places by ID to avoid duplicates
    places_map = {p['id']: p for p in existing_places}
    
    # Update/Add new places
    for p in places:
        places_map[p['id']] = p
        
    final_list = list(places_map.values())
    
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(final_list, f, ensure_ascii=False, indent=2)
        logger.info(f"Saved {len(final_list)} places to {filename}")
    except IOError as e:
        logger.error(f"Failed to save to file: {e}")

def main():
    # Example usage
    try:
        # Check if API key is set, otherwise mock or warn
        if not os.environ.get(API_KEY_ENV_VAR):
            logger.warning("GOOGLE_PLACES_API_KEY not set. Please set it to run the script.")
            return

        client = GooglePlacesClient()
        
        categories = ["restaurants", "coffeeshops"]
        location = "Somerset West"
        
        all_places = []
        
        for category in categories:
            query = f"{category} in {location}"
            places = client.search_places(query)
            all_places.extend(places)
            
        # Deduplicate places based on 'id' locally before processing
        unique_places_map = {p['id']: p for p in all_places}
        unique_places = list(unique_places_map.values())
        
        logger.info(f"Total unique places found in this run: {len(unique_places)}")
        
        # Process photos and save
        base_images_dir = Path(IMAGES_DIR)
        base_images_dir.mkdir(exist_ok=True)
        
        for place in unique_places:
            place_name = place.get('displayName', {}).get('text', 'Unknown')
            place_id = place.get('id')
            sanitized_name = sanitize_filename(place_name)
            
            # Create directory for the place
            # We append ID to ensure uniqueness if names are same?
            # User said "directory with the name of the place". 
            # If duplicates exist, we might overwrite or mix. 
            # Let's use name, but if we have multiple places with same name, maybe add ID.
            # For now, just name as requested.
            place_dir = base_images_dir / sanitized_name
            place_dir.mkdir(exist_ok=True)
            
            photos = place.get('photos', [])
            if photos:
                logger.info(f"Downloading {len(photos)} photos for {place_name}...")
                for i, photo in enumerate(photos):
                    photo_name = photo.get('name')
                    if photo_name:
                        # Construct a filename.
                        # photo_name looks like "places/PLACE_ID/photos/PHOTO_ID"
                        # We can use the last part or just index.
                        file_ext = "jpg" # API returns JPEG by default usually
                        # we can try to infer content type from response headers if we want, 
                        # but for now assume jpg or check later.
                        
                        image_filename = f"photo_{i+1}.{file_ext}"
                        image_path = place_dir / image_filename
                        
                        # Check if already exists to avoid re-downloading
                        if not image_path.exists():
                            content = client.download_photo(photo_name)
                            if content:
                                with open(image_path, "wb") as f:
                                    f.write(content)
                        else:
                            logger.info(f"Photo {image_filename} already exists.")

        # Save data to JSON
        save_places_data(unique_places, DATA_FILE)
        
    except Exception as e:
        logger.error(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
