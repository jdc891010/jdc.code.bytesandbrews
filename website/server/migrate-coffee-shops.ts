import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

const sqlite = new Database('./database.sqlite');
const db = drizzle(sqlite);

async function migrateCoffeeShops() {
  console.log('Starting coffee shops migration...');
  
  try {
    // Add new columns to coffee_shops table
    const alterStatements = [
      'ALTER TABLE coffee_shops ADD COLUMN postal_code TEXT',
      'ALTER TABLE coffee_shops ADD COLUMN latitude TEXT',
      'ALTER TABLE coffee_shops ADD COLUMN longitude TEXT', 
      'ALTER TABLE coffee_shops ADD COLUMN website TEXT',
      'ALTER TABLE coffee_shops ADD COLUMN phone_number TEXT',
      'ALTER TABLE coffee_shops ADD COLUMN rating TEXT',
      'ALTER TABLE coffee_shops ADD COLUMN google_places_id TEXT',
      'ALTER TABLE coffee_shops ALTER COLUMN description DROP NOT NULL'
    ];
    
    for (const statement of alterStatements) {
      try {
        sqlite.exec(statement);
        console.log(`✓ Executed: ${statement}`);
      } catch (error: any) {
        if (error.message.includes('duplicate column name')) {
          console.log(`⚠ Column already exists: ${statement}`);
        } else {
          console.error(`✗ Failed: ${statement}`, error.message);
        }
      }
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    sqlite.close();
  }
}

migrateCoffeeShops();