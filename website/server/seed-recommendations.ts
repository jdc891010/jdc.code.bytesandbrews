
import { storage } from './storage';

async function seedRecommendations() {
    console.log('Starting recommendations seeding...');

    // 1. Create Categories
    const categories = [
        {
            slug: 'safe',
            label: 'Safe Options',
            description: 'Reliable workspaces with consistent Wi-Fi and great amenities'
        },
        {
            slug: 'surprise',
            label: 'Surprise Me',
            description: 'Unique spaces with unexpected perks and interesting vibes'
        },
        {
            slug: 'upcoming',
            label: 'Up and Coming',
            description: 'New locations gaining popularity in the community'
        },
        {
            slug: 'fresh',
            label: 'Fresh For Real',
            description: 'Recently reviewed locations with the latest updates'
        }
    ];

    const categoryMap = new Map();

    for (const cat of categories) {
        try {
            const created = await storage.createRecommendationCategory(cat);
            categoryMap.set(cat.slug, created.id);
            console.log(`Created category: ${cat.label}`);
        } catch (e) {
            // Might already exist
            const existing = await storage.getAllRecommendationCategories();
            const found = existing.find(c => c.slug === cat.slug);
            if (found) {
                categoryMap.set(cat.slug, found.id);
                console.log(`Category already exists: ${cat.label}`);
            }
        }
    }

    // 2. Assign shops to categories
    const shops = await storage.getAllCoffeeShops();
    if (shops.length === 0) {
        console.warn('No coffee shops found in database. Run import-places first.');
        return;
    }

    const assignments = [
        { slug: 'safe', shopNames: ['Bootlegger', 'Slug & Lettuce', 'The Coffee Roasting Co.'] },
        { slug: 'surprise', shopNames: ['Nom Nom', 'Blue Waters', 'Craft Burger Bar'] },
        { slug: 'upcoming', shopNames: ['Life Retreat Café', 'Moksh', 'Daily Coffee'] },
        { slug: 'fresh', shopNames: ['Seattle Coffee Co', 'Bootlegger', 'Slug & Lettuce'] }
    ];

    for (const assignment of assignments) {
        const categoryId = categoryMap.get(assignment.slug);
        if (!categoryId) continue;

        for (const shopName of assignment.shopNames) {
            const shop = shops.find(s => s.name.includes(shopName));
            if (shop) {
                try {
                    await storage.addShopToCategory(shop.id, categoryId);
                    console.log(`Linked ${shop.name} to ${assignment.slug}`);
                } catch (e) {
                    // Already linked possibly
                }
            }
        }
    }

    // 3. Add some mock check-ins and wifi tests for the enriched data
    for (const shop of shops) {
        // Random check-ins
        const checkInCount = Math.floor(Math.random() * 20) + 5;
        for (let i = 0; i < checkInCount; i++) {
            await storage.recordCheckIn({ coffeeShopId: shop.id });
        }

        // Random wifi test
        const speed = Math.floor(Math.random() * 50) + 20;
        await storage.recordWifiTest({ coffeeShopId: shop.id, speed });
        await storage.updateCoffeeShop(shop.id, { wifiSpeed: speed });
    }

    console.log('Seeding recommendations complete.');
}

seedRecommendations().catch(console.error);
