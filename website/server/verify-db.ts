import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { 
  users, contacts, signups, subscribers, coffeeShops, adminUsers,
  coupons, blogPosts, notifications, specials, featuredSpots, images
} from '../shared/schema';

const sqlite = new Database('./database.sqlite');
const db = drizzle(sqlite);

async function verifyDatabase() {
  console.log('🔍 Verifying database content...');

  try {
    const tables = [
      { name: 'users', table: users },
      { name: 'contacts', table: contacts },
      { name: 'signups', table: signups },
      { name: 'subscribers', table: subscribers },
      { name: 'coffeeShops', table: coffeeShops },
      { name: 'adminUsers', table: adminUsers },
      { name: 'coupons', table: coupons },
      { name: 'blogPosts', table: blogPosts },
      { name: 'notifications', table: notifications },
      { name: 'specials', table: specials },
      { name: 'featuredSpots', table: featuredSpots },
      { name: 'images', table: images }
    ];

    for (const { name, table } of tables) {
      const records = await db.select().from(table);
      console.log(`- ${name}: ${records.length} records`);
    }

  } catch (error) {
    console.error('❌ Error verifying database:', error);
  }
}

verifyDatabase();
