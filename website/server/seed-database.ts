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
  notifications,
  specials,
  featuredSpots,
  images
} from '../shared/schema';
import { eq } from 'drizzle-orm';

const sqlite = new Database('./database.sqlite');
const db = drizzle(sqlite);

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.delete(images);
    await db.delete(featuredSpots);
    await db.delete(specials);
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
        name: 'Bootlegger Coffee Company',
        description: 'Trendy coffee chain offering artisanal brews, fresh pastries, and light meals in a stylish setting.',
        address: 'The Sanctuary Shopping Centre, Cnr R44 & De Beers Ave, Somerset West',
        city: 'Somerset West',
        country: 'South Africa',
        latitude: '-34.0841',
        longitude: '18.8365',
        wifiSpeed: 52,
        rating: 4.7,
        imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        tribe: 'Code Conjurers',
        vibe: 'Focus Factory',
        amenities: JSON.stringify({
          wheelchairAccessible: true,
          parkingRating: 4,
          videoCallRating: 5,
          powerAvailability: 5,
          coffeeQuality: 4
        })
      },
      {
        name: 'The Millhouse Kitchen',
        description: 'Relaxed bistro on Lourensford Wine Estate serving seasonal dishes and excellent coffee with mountain views.',
        address: 'Lourensford Wine Estate, Lourensford Rd, Somerset West',
        city: 'Somerset West',
        country: 'South Africa',
        latitude: '-34.0722',
        longitude: '18.8890',
        wifiSpeed: 35,
        rating: 4.5,
        imageUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        tribe: 'Word Weavers',
        vibe: 'Quiet Zen',
        amenities: JSON.stringify({
          wheelchairAccessible: true,
          parkingRating: 5,
          videoCallRating: 3,
          powerAvailability: 3,
          coffeeQuality: 5
        })
      },
      {
        name: 'Stables at Vergelegen',
        description: 'Elegant bistro offering a contemporary menu and coffee in a beautiful garden setting.',
        address: 'Vergelegen Wine Estate, Lourensford Rd, Somerset West',
        city: 'Somerset West',
        country: 'South Africa',
        latitude: '-34.0768',
        longitude: '18.8913',
        wifiSpeed: 28,
        rating: 4.6,
        imageUrl: 'https://images.unsplash.com/photo-1469631423217-c7eb88862ccb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1469631423217-c7eb88862ccb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        tribe: 'Creative Chaos',
        vibe: 'Chatty Buzz',
        amenities: JSON.stringify({
          wheelchairAccessible: true,
          parkingRating: 5,
          videoCallRating: 2,
          powerAvailability: 2,
          coffeeQuality: 5
        })
      },
      {
        name: 'Grandma\'s Cafe',
        description: 'Quaint and cozy cafe serving homemade treats and comforting coffee blends.',
        address: '147 Main Rd, Somerset West',
        city: 'Somerset West',
        country: 'South Africa',
        latitude: '-34.0833',
        longitude: '18.8486',
        wifiSpeed: 22,
        rating: 4.3,
        imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        tribe: 'Pixel Pixies',
        vibe: 'Chatty Buzz',
        amenities: JSON.stringify({
          wheelchairAccessible: true,
          parkingRating: 3,
          videoCallRating: 2,
          powerAvailability: 3,
          coffeeQuality: 4
        })
      },
      {
        name: 'The Daily Coffee Café',
        description: 'New-York-meets-Karoo themed coffee shop known for good vibes and great coffee.',
        address: 'Sitari Village Mall, R102, Somerset West',
        city: 'Somerset West',
        country: 'South Africa',
        latitude: '-34.0995',
        longitude: '18.7990',
        wifiSpeed: 45,
        rating: 4.4,
        imageUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        tribe: 'Web Wizards',
        vibe: 'Focus Factory',
        amenities: JSON.stringify({
          wheelchairAccessible: true,
          parkingRating: 5,
          videoCallRating: 4,
          powerAvailability: 4,
          coffeeQuality: 4
        })
      },
      {
        name: 'Waterstone Café',
        description: 'Conveniently located cafe with outdoor seating and a wide menu selection.',
        address: 'Waterstone Village, Main Rd, Somerset West',
        city: 'Somerset West',
        country: 'South Africa',
        latitude: '-34.0712',
        longitude: '18.8452',
        wifiSpeed: 30,
        rating: 4.1,
        imageUrl: 'https://images.unsplash.com/photo-1507133750069-69d3cdad863a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507133750069-69d3cdad863a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        tribe: 'Word Weavers',
        vibe: 'Quiet Zen',
        amenities: JSON.stringify({
          wheelchairAccessible: true,
          parkingRating: 5,
          videoCallRating: 3,
          powerAvailability: 3,
          coffeeQuality: 3
        })
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

    // Fetch coffee shops for linking
    const allCoffeeShops = await db.select().from(coffeeShops);
    if (allCoffeeShops.length > 0) {
      // Seed specials
      console.log('🏷️ Seeding specials...');
      const specialsData = [
        {
          coffeeShopId: allCoffeeShops[0].id,
          title: "Morning Kickstart",
          description: "Get a free pastry with any large coffee before 9 AM.",
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
          isActive: true,
          displayOnHomepage: true,
          discountType: 'free_item',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          coffeeShopId: allCoffeeShops[1].id,
          title: "Work from Cafe Special",
          description: "Unlimited WiFi and bottomless filter coffee for R80/day.",
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          isActive: true,
          displayOnHomepage: true,
          discountType: 'fixed_price',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      await db.insert(specials).values(specialsData);

      // Seed featured spots
      console.log('🌟 Seeding featured spots...');
      const featuredSpotsData = [
        {
          coffeeShopId: allCoffeeShops[2].id,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          description: "Voted best atmosphere for remote work in Somerset West.",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      await db.insert(featuredSpots).values(featuredSpotsData);
    }

    // Seed images
    console.log('🖼️ Seeding images...');
    if (allCoffeeShops.length > 0) {
      const imagesData = [
        {
          filename: 'bootlegger-interior.jpg',
          originalName: 'bootlegger-interior.jpg',
          mimeType: 'image/jpeg',
          size: 1024000,
          url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          entityType: 'coffee_shop',
          entityId: allCoffeeShops[0].id,
          altText: 'Bootlegger Coffee Company Interior',
          caption: 'Spacious seating area',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          filename: 'millhouse-view.jpg',
          originalName: 'millhouse-view.jpg',
          mimeType: 'image/jpeg',
          size: 2048000,
          url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          entityType: 'coffee_shop',
          entityId: allCoffeeShops[1].id,
          altText: 'Millhouse Kitchen View',
          caption: 'Mountain views from the terrace',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          filename: 'stables-garden.jpg',
          originalName: 'stables-garden.jpg',
          mimeType: 'image/jpeg',
          size: 1500000,
          url: 'https://images.unsplash.com/photo-1469631423217-c7eb88862ccb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1469631423217-c7eb88862ccb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          entityType: 'coffee_shop',
          entityId: allCoffeeShops[2].id,
          altText: 'Stables at Vergelegen Garden',
          caption: 'Beautiful garden setting',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          filename: 'grandmas-cozy.jpg',
          originalName: 'grandmas-cozy.jpg',
          mimeType: 'image/jpeg',
          size: 1200000,
          url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          entityType: 'coffee_shop',
          entityId: allCoffeeShops[3].id,
          altText: 'Grandma\'s Cafe Interior',
          caption: 'Cozy and quaint atmosphere',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          filename: 'daily-coffee-vibe.jpg',
          originalName: 'daily-coffee-vibe.jpg',
          mimeType: 'image/jpeg',
          size: 1800000,
          url: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          entityType: 'coffee_shop',
          entityId: allCoffeeShops[4].id,
          altText: 'The Daily Coffee Café Vibe',
          caption: 'Good vibes and great coffee',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          filename: 'waterstone-outdoor.jpg',
          originalName: 'waterstone-outdoor.jpg',
          mimeType: 'image/jpeg',
          size: 1600000,
          url: 'https://images.unsplash.com/photo-1507133750069-69d3cdad863a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1507133750069-69d3cdad863a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          entityType: 'coffee_shop',
          entityId: allCoffeeShops[5].id,
          altText: 'Waterstone Café Outdoor',
          caption: 'Outdoor seating area',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      await db.insert(images).values(imagesData);
    }

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