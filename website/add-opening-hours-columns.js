import Database from 'better-sqlite3';

const db = new Database('./database.sqlite');

try {
  // Add the new columns to the coffee_shops table
  db.exec(`
    ALTER TABLE coffee_shops ADD COLUMN opening_hours TEXT;
    ALTER TABLE coffee_shops ADD COLUMN opens_at TEXT;
    ALTER TABLE coffee_shops ADD COLUMN closes_at TEXT;
    ALTER TABLE coffee_shops ADD COLUMN is_open_24_hours INTEGER DEFAULT 0;
  `);
  
  console.log('Successfully added opening hours columns to coffee_shops table');
} catch (error) {
  if (error.message.includes('duplicate column name')) {
    console.log('Columns already exist, skipping...');
  } else {
    console.error('Error adding columns:', error.message);
  }
} finally {
  db.close();
}