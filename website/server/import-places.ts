
import fs from 'fs';
import path from 'path';
import { storage } from './storage';
import { type InsertCoffeeShop } from '../shared/schema';

// Path to the JSON file
const DATA_FILE_PATH = path.resolve(process.cwd(), '../places_data.json');

function formatEnumString(str: string | undefined): string | null {
  if (!str) return null;
  // PRICE_LEVEL_MODERATE -> Moderate
  // OPERATIONAL -> Operational
  return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()).replace('Price Level ', '');
}

async function importPlaces() {
  console.log(`Reading data from ${DATA_FILE_PATH}...`);
  
  if (!fs.existsSync(DATA_FILE_PATH)) {
    console.error('Data file not found!');
    process.exit(1);
  }

  const rawData = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
  const places = JSON.parse(rawData);

  console.log(`Found ${places.length} places. Starting import...`);

  let count = 0;
  let updatedCount = 0;
  for (const place of places) {
    try {
      // Map JSON data to InsertCoffeeShop schema
      const name = place.displayName?.text || 'Unknown Coffee Shop';
      const address = place.formattedAddress || '';
      
      // Extract city from address (simple heuristic)
      let city = 'Somerset West'; // Default
      if (address.includes('Cape Town')) city = 'Cape Town';
      if (address.includes('Stellenbosch')) city = 'Stellenbosch';
      if (address.includes('Somerset West')) city = 'Somerset West';

      // Parse opening hours
      let openingHoursString = null;
      let opensAt = null;
      let closesAt = null;
      
      if (place.regularOpeningHours) {
        openingHoursString = JSON.stringify(place.regularOpeningHours);
        
        // Try to find earliest open and latest close
        if (place.regularOpeningHours.periods && place.regularOpeningHours.periods.length > 0) {
            // This is a simplification. Real logic would be more complex.
            // Just taking the first period's open/close for now or leaving null to avoid bad data
            const firstPeriod = place.regularOpeningHours.periods[0];
            if (firstPeriod.open) {
                opensAt = `${firstPeriod.open.hour.toString().padStart(2, '0')}:${firstPeriod.open.minute.toString().padStart(2, '0')}`;
            }
            if (firstPeriod.close) {
                closesAt = `${firstPeriod.close.hour.toString().padStart(2, '0')}:${firstPeriod.close.minute.toString().padStart(2, '0')}`;
            }
        }
      }

      const coffeeShop: InsertCoffeeShop = {
        name: name,
        description: `Experience ${name} in ${city}.`,
        address: address,
        city: city,
        country: 'South Africa',
        latitude: place.location?.latitude?.toString() || null,
        longitude: place.location?.longitude?.toString() || null,
        website: place.websiteUri || null,
        phoneNumber: place.internationalPhoneNumber || null,
        rating: place.rating?.toString() || null,
        googlePlacesId: place.id,
        openingHours: openingHoursString,
        opensAt: opensAt,
        closesAt: closesAt,
        wifiSpeed: null, // No speed data in JSON
        imageUrl: null, // No direct public image URL
        tribe: 'Digital Nomad', // Default
        vibe: 'Productive', // Default
        amenities: JSON.stringify({
            wifi: true,
            power: true,
            parking: true
        }),
        priceLevel: formatEnumString(place.priceLevel),
        userRatingCount: place.userRatingCount || null,
        businessStatus: formatEnumString(place.businessStatus),
        googleMapsUri: place.googleMapsUri || null
      };

      // Check if already exists by googlePlacesId
      const existingShops = await storage.getAllCoffeeShops();
      const existing = existingShops.find(s => s.googlePlacesId === place.id);

      if (existing) {
        console.log(`Updating existing shop: ${name}`);
        await storage.updateCoffeeShop(existing.id, coffeeShop);
        updatedCount++;
      } else {
        await storage.createCoffeeShop(coffeeShop);
        console.log(`Imported: ${name}`);
        count++;
      }

    } catch (err) {
      console.error(`Failed to import place ${place.id}:`, err);
    }
  }
  console.log(`Import complete. Created: ${count}, Updated: ${updatedCount}`);
}

importPlaces().catch(console.error);
