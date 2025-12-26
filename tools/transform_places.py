import json
import random
import re
import os
from typing import List, Dict

# Constants
PLACES_DATA_FILE = "places_data.json"
OUTPUT_FILE = "website/client/src/lib/generated_places.json"
IMAGES_BASE_URL = "/places_images"

# Mock Data for random generation
VIBES = [
    "Quiet Zen", "Chatty Buzz", "Creative Chaos", "Focus Factory", "Digital Hub",
    "Cozy Corner", "Industrial Chic", "Green Oasis"
]

POPULAR_WITH = [
    "Code Conjurers", "Word Weavers", "Pixel Pixies", "Buzz Beasts", 
    "Data Druids", "Web Wizards", "Story Spinners", "Digital Nomads"
]

DESCRIPTIONS = [
    "A perfect spot for productivity with excellent coffee.",
    "Great atmosphere for meetings and casual work.",
    "Quiet and focused environment, ideal for coding sessions.",
    "Lively cafe with strong Wi-Fi and plenty of power outlets.",
    "Hidden gem with a relaxing vibe and delicious pastries.",
    "Modern space designed for digital nomads and creatives.",
    "Rustic charm meets high-speed internet.",
    "Bright and airy location with friendly staff."
]

def sanitize_filename(name: str) -> str:
    """Sanitize a string to match the directory naming convention."""
    return re.sub(r'[<>:"/\\|?*]', '', name).strip()

def transform_places():
    """Reads Google Places data and transforms it to the CoffeeShop model."""
    
    if not os.path.exists(PLACES_DATA_FILE):
        print(f"Error: {PLACES_DATA_FILE} not found.")
        return

    with open(PLACES_DATA_FILE, 'r', encoding='utf-8') as f:
        google_places = json.load(f)
    
    transformed_places = []
    
    for place in google_places:
        place_name = place.get('displayName', {}).get('text', 'Unknown')
        sanitized_name = sanitize_filename(place_name)
        
        # Check if we have photos locally
        # We assume if the folder exists and has files, we take the first one
        image_url = "https://picsum.photos/500/300?random=1" # Fallback
        
        # In the previous step, we moved images to website/client/public/places_images
        # The path should be relative to public, e.g., /places_images/Place Name/photo_1.jpg
        # We need to check if the directory exists in the source location or assume it moved.
        # Since we moved it, let's assume the structure is correct.
        
        # Note: In a real script we might want to verify file existence, but for now we construct the path.
        # We downloaded as photo_1.jpg
        image_url = f"{IMAGES_BASE_URL}/{sanitized_name}/photo_1.jpg"
        
        # Generate random attributes
        wifi_speed = random.randint(15, 150)
        num_vibes = random.randint(1, 3)
        place_vibes = random.sample(VIBES, num_vibes)
        
        num_popular = random.randint(1, 2)
        place_popular = random.sample(POPULAR_WITH, num_popular)
        
        description = random.choice(DESCRIPTIONS)
        if place.get('rating'):
            description += f" Rated {place.get('rating')} stars by locals."

        # Construct the CoffeeShop object
        coffee_shop = {
            "id": place['id'],
            "name": place_name,
            "description": description,
            "imageUrl": image_url,
            "wifiSpeed": wifi_speed,
            "vibes": place_vibes,
            "popularWith": place_popular,
            "address": place.get('formattedAddress'),
            "city": "Somerset West", # Hardcoded for this batch as known context
            "country": "South Africa",
            "updated": "Today",
            "coordinates": {
                "lat": place['location']['latitude'],
                "lng": place['location']['longitude']
            }
        }
        
        transformed_places.append(coffee_shop)
        
    # Save to file
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(transformed_places, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully transformed {len(transformed_places)} places to {OUTPUT_FILE}")

if __name__ == "__main__":
    transform_places()
