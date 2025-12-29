import Database from 'better-sqlite3';

const db = new Database('./database.sqlite');

try {
  console.log('Migrating database schema...');
  
  // Add price_level
  try {
    db.prepare('ALTER TABLE coffee_shops ADD COLUMN price_level TEXT').run();
    console.log('Added price_level column');
  } catch (e: any) {
    console.log('price_level column already exists or error:', e.message);
  }

  // Add user_rating_count
  try {
    db.prepare('ALTER TABLE coffee_shops ADD COLUMN user_rating_count INTEGER').run();
    console.log('Added user_rating_count column');
  } catch (e: any) {
    console.log('user_rating_count column already exists or error:', e.message);
  }

  // Add business_status
  try {
    db.prepare('ALTER TABLE coffee_shops ADD COLUMN business_status TEXT').run();
    console.log('Added business_status column');
  } catch (e: any) {
    console.log('business_status column already exists or error:', e.message);
  }

  // Add google_maps_uri
  try {
    db.prepare('ALTER TABLE coffee_shops ADD COLUMN google_maps_uri TEXT').run();
    console.log('Added google_maps_uri column');
  } catch (e: any) {
    console.log('google_maps_uri column already exists or error:', e.message);
  }

  console.log('Migration completed.');
} catch (e) {
  console.error('Migration failed:', e);
}
