import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import {
  users,
  contacts,
  signups,
  subscribers,
  coffeeShops,
  adminUsers,
  coupons,
  blogPosts,
  notifications
} from '../shared/schema';

const sqlite = new Database('./database.sqlite');
const db = drizzle(sqlite);

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.delete(notifications);
    await db.delete(blogPosts);
    await db.delete(coupons);
    await db.delete(adminUsers);
    await db.delete(coffeeShops);
    await db.delete(subscribers);
    await db.delete(signups);
    await db.delete(contacts);
    await db.delete(users);

    // Seed users
    console.log('👥 Seeding users...');
    const userData = [
      { username: 'johndoe', password: await bcrypt.hash('password123', 10) },
      { username: 'janesmith', password: await bcrypt.hash('password123', 10) },
      { username: 'mikejohnson', password: await bcrypt.hash('password123', 10) },
      { username: 'sarahwilson', password: await bcrypt.hash('password123', 10) },
      { username: 'davidbrown', password: await bcrypt.hash('password123', 10) }
    ];
    await db.insert(users).values(userData);

    // Seed contacts
    console.log('📞 Seeding contacts...');
    const contactData = [
      { name: 'Alice Cooper', email: 'alice@example.com', subject: 'Coffee Selection', message: 'Love your coffee selection!' },
      { name: 'Bob Dylan', email: 'bob@example.com', subject: 'New Location', message: 'When will you open a location in downtown?' },
      { name: 'Charlie Parker', email: 'charlie@example.com', subject: 'Remote Work', message: 'Great atmosphere for remote work!' },
      { name: 'Diana Ross', email: 'diana@example.com', subject: 'Vegan Options', message: 'Could you add more vegan options?' }
    ];
    await db.insert(contacts).values(contactData);

    // Seed signups
    console.log('📝 Seeding signups...');
    const signupData = [
      { name: 'Emma Watson', email: 'emma@example.com', city: 'Somerset West', tribe: 'coffee_lovers' },
      { name: 'Tom Hardy', email: 'tom@example.com', city: 'Strand', tribe: 'remote_workers' },
      { name: 'Ryan Gosling', email: 'ryan@example.com', city: 'Gordon\'s Bay', tribe: 'entrepreneurs' },
      { name: 'Scarlett Johansson', email: 'scarlett@example.com', city: 'Somerset West', tribe: 'students' }
    ];
    await db.insert(signups).values(signupData);

    // Seed subscribers
    console.log('📧 Seeding subscribers...');
    const subscriberData = [
      { email: 'subscriber1@example.com' },
      { email: 'subscriber2@example.com' },
      { email: 'subscriber3@example.com' },
      { email: 'subscriber4@example.com' },
      { email: 'subscriber5@example.com' }
    ];
    await db.insert(subscribers).values(subscriberData);

    // Seed coffee shops
    console.log('☕ Seeding coffee shops...');
    const coffeeShopData = [
      {
        name: 'The Daily Grind',
        description: 'A cozy neighborhood coffee shop with artisanal brews and fresh pastries.',
        address: '123 Main St, Somerset West, 7130',
        city: 'Somerset West',
        country: 'South Africa',
        wifiSpeed: 50,
        imageUrl: 'dailygrind1.jpg',
        thumbnailUrl: 'dailygrind_thumb.jpg'
      },
      {
        name: 'Bean There Coffee Co.',
        description: 'Specialty coffee roasters with a focus on single-origin beans.',
        address: '456 Oak Ave, Strand, 7140',
        city: 'Strand',
        country: 'South Africa',
        wifiSpeed: 75,
        imageUrl: 'beanthere1.jpg',
        thumbnailUrl: 'beanthere_thumb.jpg'
      },
      {
        name: 'Café Mocha',
        description: 'Waterfront café with stunning views and gourmet coffee.',
        address: '789 Pine Rd, Gordon\'s Bay, 7150',
        city: 'Gordon\'s Bay',
        country: 'South Africa',
        wifiSpeed: 40,
        imageUrl: 'cafemocha1.jpg',
        thumbnailUrl: 'cafemocha_thumb.jpg'
      }
    ];
    await db.insert(coffeeShops).values(coffeeShopData);

    // Seed admin users
    console.log('👨‍💼 Seeding admin users...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminData = [
      {
        username: 'admin',
        email: 'admin@brewsandbytes.co.za',
        password: hashedPassword,
        role: 'super_admin',
        isActive: true,
        lastLogin: new Date()
      },
      {
        username: 'manager',
        email: 'manager@brewsandbytes.co.za',
        password: await bcrypt.hash('manager123', 10),
        role: 'admin',
        isActive: true,
        lastLogin: new Date(Date.now() - 86400000) // 1 day ago
      }
    ];
    await db.insert(adminUsers).values(adminData);

    // Seed coupons
    console.log('🎫 Seeding coupons...');
    const couponData = [
      {
        code: 'WELCOME10',
        description: 'Welcome discount for new customers',
        discountType: 'percentage',
        discountValue: 10,
        isActive: true,
        expiresAt: new Date(Date.now() + 2592000000), // 30 days from now
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'COFFEE20',
        description: '20% off all coffee drinks',
        discountType: 'percentage',
        discountValue: 20,
        isActive: true,
        expiresAt: new Date(Date.now() + 1209600000), // 14 days from now
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'FREESHIP',
        description: 'Free shipping on orders over R200',
        discountType: 'free_shipping',
        discountValue: 0,
        isActive: true,
        expiresAt: new Date(Date.now() + 5184000000), // 60 days from now
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await db.insert(coupons).values(couponData);

    // Seed blog posts
    console.log('📝 Seeding blog posts...');
    const blogData = [
      {
        title: 'The Art of Coffee Brewing',
        slug: 'art-of-coffee-brewing',
        content: 'Discover the secrets behind brewing the perfect cup of coffee. From bean selection to water temperature, every detail matters in creating that perfect morning ritual.',
        excerpt: 'Learn the fundamentals of brewing exceptional coffee at home.',
        author: 'Coffee Master',
        status: 'published',
        featuredImage: 'coffee-brewing.jpg',
        seoTitle: 'Master the Art of Coffee Brewing | Brews & Bytes',
        seoDescription: 'Learn professional coffee brewing techniques and tips for the perfect cup every time.',
        publishedAt: new Date(Date.now() - 604800000), // 1 week ago
        createdAt: new Date(Date.now() - 604800000),
        updatedAt: new Date()
      },
      {
        title: 'Best Coffee Shops in Somerset West',
        slug: 'best-coffee-shops-somerset-west',
        content: 'Explore the vibrant coffee culture in Somerset West. From cozy neighborhood cafés to trendy roasteries, discover your next favorite coffee spot.',
        excerpt: 'A curated guide to Somerset West\'s finest coffee establishments.',
        author: 'Local Guide',
        status: 'published',
        featuredImage: 'somerset-west-cafes.jpg',
        seoTitle: 'Best Coffee Shops in Somerset West 2024 | Local Guide',
        seoDescription: 'Discover the top-rated coffee shops and cafés in Somerset West with our comprehensive local guide.',
        publishedAt: new Date(Date.now() - 259200000), // 3 days ago
        createdAt: new Date(Date.now() - 259200000),
        updatedAt: new Date()
      },
      {
        title: 'Sustainable Coffee: Why It Matters',
        slug: 'sustainable-coffee-why-it-matters',
        content: 'Understanding the impact of sustainable coffee practices on farmers, communities, and the environment. Learn how your coffee choices can make a difference.',
        excerpt: 'Explore the importance of ethical and sustainable coffee sourcing.',
        author: 'Sustainability Expert',
        status: 'draft',
        featuredImage: 'sustainable-coffee.jpg',
        seoTitle: 'Sustainable Coffee Practices | Environmental Impact',
        seoDescription: 'Learn about sustainable coffee farming and how ethical sourcing benefits everyone.',
        publishedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await db.insert(blogPosts).values(blogData);

    // Seed notifications
    console.log('🔔 Seeding notifications...');
    const notificationData = [
      {
        title: 'Welcome to Brews & Bytes!',
        message: 'Thank you for joining our coffee community. Explore the best coffee shops in your area.',
        type: 'welcome',
        isActive: true,
        scheduledAt: new Date(),
        sentAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'New Coffee Shop Added',
        message: 'Check out the newly added Bean There Coffee Co. in Strand!',
        type: 'announcement',
        isActive: true,
        scheduledAt: new Date(Date.now() - 86400000), // 1 day ago
        sentAt: new Date(Date.now() - 86400000),
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date()
      },
      {
        title: 'Weekend Special Offers',
        message: 'Don\'t miss out on weekend specials at participating coffee shops!',
        type: 'promotion',
        isActive: true,
        scheduledAt: new Date(Date.now() + 172800000), // 2 days from now
        sentAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await db.insert(notifications).values(notificationData);

    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - ${userData.length} users`);
    console.log(`   - ${contactData.length} contacts`);
    console.log(`   - ${signupData.length} signups`);
    console.log(`   - ${subscriberData.length} subscribers`);
    console.log(`   - ${coffeeShopData.length} coffee shops`);
    console.log(`   - ${adminData.length} admin users`);
    console.log(`   - ${couponData.length} coupons`);
    console.log(`   - ${blogData.length} blog posts`);
    console.log(`   - ${notificationData.length} notifications`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    sqlite.close();
  }
}

// Run the seeding function
seedDatabase()
  .then(() => {
    console.log('🎉 Seeding process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding process failed:', error);
    process.exit(1);
  });

export { seedDatabase };