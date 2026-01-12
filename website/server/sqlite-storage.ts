import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, and, lte, gte } from "drizzle-orm";
import {
  users, contacts, signups, subscribers, coffeeShops, adminUsers,
  coupons, blogPosts, notifications, specials, featuredSpots, images,
  tribes, professions, talkingPoints,
  wifiTests, checkIns, recommendationCategories, shopCategories,
  type User, type InsertUser,
  type Contact, type InsertContact,
  type SignUp, type InsertSignUp,
  type Subscriber, type InsertSubscriber,
  type CoffeeShop, type InsertCoffeeShop,
  type AdminUser, type InsertAdminUser,
  type Coupon, type InsertCoupon,
  type BlogPost, type InsertBlogPost,
  type Notification, type InsertNotification,
  type Special, type InsertSpecial,
  type FeaturedSpot, type InsertFeaturedSpot,
  type Image, type InsertImage,
  type Tribe, type Profession, type TalkingPoint,
  type WifiTest, type InsertWifiTest,
  type CheckIn, type InsertCheckIn,
  type RecommendationCategory, type InsertRecommendationCategory,
  type ShopCategory, type InsertShopCategory
} from "../shared/schema.js";
import { type IStorage } from "./storage.js";
import { count } from "drizzle-orm";

export class SQLiteStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor(dbPath: string = "./database.sqlite") {
    const sqlite = new Database(dbPath);
    this.db = drizzle(sqlite);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(user).returning();
    return result[0];
  }

  // Contact form operations
  async createContact(contact: InsertContact): Promise<Contact> {
    const result = await this.db.insert(contacts).values({
      ...contact,
      createdAt: new Date()
    }).returning();
    return result[0];
  }

  async getContact(id: number): Promise<Contact | undefined> {
    const result = await this.db.select().from(contacts).where(eq(contacts.id, id)).limit(1);
    return result[0];
  }

  async getAllContacts(): Promise<Contact[]> {
    return await this.db.select().from(contacts);
  }

  // Sign up operations
  async createSignUp(signup: InsertSignUp): Promise<SignUp> {
    const result = await this.db.insert(signups).values({
      ...signup,
      createdAt: new Date()
    }).returning();
    return result[0];
  }

  async getSignUp(id: number): Promise<SignUp | undefined> {
    const result = await this.db.select().from(signups).where(eq(signups.id, id)).limit(1);
    return result[0];
  }

  async getAllSignUps(): Promise<SignUp[]> {
    return await this.db.select().from(signups);
  }

  // Subscriber operations
  async createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    const result = await this.db.insert(subscribers).values({
      ...subscriber,
      createdAt: new Date()
    }).returning();
    return result[0];
  }

  async getSubscriber(id: number): Promise<Subscriber | undefined> {
    const result = await this.db.select().from(subscribers).where(eq(subscribers.id, id)).limit(1);
    return result[0];
  }

  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    const result = await this.db.select().from(subscribers).where(eq(subscribers.email, email)).limit(1);
    return result[0];
  }

  async getAllSubscribers(): Promise<Subscriber[]> {
    return await this.db.select().from(subscribers);
  }

  // Coffee shop operations
  async createCoffeeShop(coffeeShop: InsertCoffeeShop): Promise<CoffeeShop> {
    const now = new Date();
    const result = await this.db.insert(coffeeShops).values({
      ...coffeeShop,
      createdAt: now,
      updatedAt: now
    }).returning();
    return result[0];
  }

  async getCoffeeShop(id: number): Promise<CoffeeShop | undefined> {
    const result = await this.db.select().from(coffeeShops).where(eq(coffeeShops.id, id)).limit(1);
    return result[0];
  }

  async getAllCoffeeShops(): Promise<CoffeeShop[]> {
    return await this.db.select().from(coffeeShops);
  }

  async updateCoffeeShop(id: number, coffeeShopData: Partial<InsertCoffeeShop>): Promise<CoffeeShop | undefined> {
    const result = await this.db.update(coffeeShops)
      .set({ ...coffeeShopData, updatedAt: new Date() })
      .where(eq(coffeeShops.id, id))
      .returning();
    return result[0];
  }

  async deleteCoffeeShop(id: number): Promise<boolean> {
    const result = await this.db.delete(coffeeShops).where(eq(coffeeShops.id, id));
    return result.changes > 0;
  }

  // Admin user operations
  async createAdminUser(adminUser: InsertAdminUser): Promise<AdminUser> {
    const now = new Date();
    const result = await this.db.insert(adminUsers).values({
      ...adminUser,
      createdAt: now,
      updatedAt: now
    }).returning();
    return result[0];
  }

  async getAdminUser(id: number): Promise<AdminUser | undefined> {
    const result = await this.db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
    return result[0];
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const result = await this.db.select().from(adminUsers).where(eq(adminUsers.username, username)).limit(1);
    return result[0];
  }

  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    const result = await this.db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
    return result[0];
  }

  async getAllAdminUsers(): Promise<AdminUser[]> {
    return await this.db.select().from(adminUsers);
  }

  async updateAdminUser(id: number, adminUserData: Partial<InsertAdminUser>): Promise<AdminUser | undefined> {
    const result = await this.db.update(adminUsers)
      .set({ ...adminUserData, updatedAt: new Date() })
      .where(eq(adminUsers.id, id))
      .returning();
    return result[0];
  }

  async updateAdminUserLastLogin(id: number): Promise<void> {
    await this.db.update(adminUsers)
      .set({ lastLogin: new Date() })
      .where(eq(adminUsers.id, id));
  }

  // Coupon operations
  async createCoupon(coupon: InsertCoupon): Promise<Coupon> {
    const now = new Date();
    const result = await this.db.insert(coupons).values({
      ...coupon,
      createdAt: now,
      updatedAt: now
    }).returning();
    return result[0];
  }

  async getCoupon(id: number): Promise<Coupon | undefined> {
    const result = await this.db.select().from(coupons).where(eq(coupons.id, id)).limit(1);
    return result[0];
  }

  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    const result = await this.db.select().from(coupons).where(eq(coupons.code, code)).limit(1);
    return result[0];
  }

  async getAllCoupons(): Promise<Coupon[]> {
    return await this.db.select().from(coupons);
  }

  async updateCoupon(id: number, couponData: Partial<InsertCoupon>): Promise<Coupon | undefined> {
    const result = await this.db.update(coupons)
      .set({ ...couponData, updatedAt: new Date() })
      .where(eq(coupons.id, id))
      .returning();
    return result[0];
  }

  async deleteCoupon(id: number): Promise<boolean> {
    const result = await this.db.delete(coupons).where(eq(coupons.id, id));
    return result.changes > 0;
  }

  async incrementCouponUsage(id: number): Promise<boolean> {
    const coupon = await this.getCoupon(id);
    if (!coupon) return false;

    const result = await this.db.update(coupons)
      .set({ currentUses: coupon.currentUses + 1 })
      .where(eq(coupons.id, id));
    return result.changes > 0;
  }

  // Blog post operations
  async createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost> {
    const now = new Date();
    const result = await this.db.insert(blogPosts).values({
      ...blogPost,
      createdAt: now,
      updatedAt: now
    }).returning();
    return result[0];
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const result = await this.db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return result[0];
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const result = await this.db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    return result[0];
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await this.db.select().from(blogPosts);
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await this.db.select().from(blogPosts).where(eq(blogPosts.status, "published"));
  }

  async updateBlogPost(id: number, blogPostData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const result = await this.db.update(blogPosts)
      .set({ ...blogPostData, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return result[0];
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await this.db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.changes > 0;
  }

  // Notification operations
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const now = new Date();
    const result = await this.db.insert(notifications).values({
      ...notification,
      createdAt: now,
      updatedAt: now
    }).returning();
    return result[0];
  }

  async getNotification(id: number): Promise<Notification | undefined> {
    const result = await this.db.select().from(notifications).where(eq(notifications.id, id)).limit(1);
    return result[0];
  }

  async getAllNotifications(): Promise<Notification[]> {
    return await this.db.select().from(notifications);
  }

  async getActiveNotifications(): Promise<Notification[]> {
    return await this.db.select().from(notifications).where(eq(notifications.isActive, true));
  }

  async updateNotification(id: number, notificationData: Partial<InsertNotification>): Promise<Notification | undefined> {
    const result = await this.db.update(notifications)
      .set({ ...notificationData, updatedAt: new Date() })
      .where(eq(notifications.id, id))
      .returning();
    return result[0];
  }

  async deleteNotification(id: number): Promise<boolean> {
    const result = await this.db.delete(notifications).where(eq(notifications.id, id));
    return result.changes > 0;
  }

  async markNotificationAsSent(id: number): Promise<void> {
    await this.db.update(notifications)
      .set({ sentAt: new Date(), updatedAt: new Date() })
      .where(eq(notifications.id, id));
  }

  // Specials operations
  async createSpecial(special: InsertSpecial): Promise<Special> {
    const result = await this.db.insert(specials).values({
      ...special,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return result[0];
  }

  async getSpecial(id: number): Promise<Special | undefined> {
    const result = await this.db.select().from(specials).where(eq(specials.id, id)).limit(1);
    return result[0];
  }

  async getAllSpecials(): Promise<Special[]> {
    return await this.db.select().from(specials);
  }

  async getActiveSpecials(): Promise<Special[]> {
    const now = new Date();
    return await this.db.select().from(specials)
      .where(and(
        eq(specials.isActive, true),
        lte(specials.startDate, now),
        gte(specials.endDate, now)
      ));
  }

  async getHomepageSpecials(): Promise<Special[]> {
    const now = new Date();
    return await this.db.select().from(specials)
      .where(and(
        eq(specials.isActive, true),
        eq(specials.displayOnHomepage, true),
        lte(specials.startDate, now),
        gte(specials.endDate, now)
      ));
  }

  async updateSpecial(id: number, specialData: Partial<InsertSpecial>): Promise<Special | undefined> {
    const result = await this.db.update(specials)
      .set({ ...specialData, updatedAt: new Date() })
      .where(eq(specials.id, id))
      .returning();
    return result[0];
  }

  async deleteSpecial(id: number): Promise<boolean> {
    const result = await this.db.delete(specials).where(eq(specials.id, id));
    return result.changes > 0;
  }

  // Featured Spots operations
  async createFeaturedSpot(featuredSpot: InsertFeaturedSpot): Promise<FeaturedSpot> {
    const result = await this.db.insert(featuredSpots).values({
      ...featuredSpot,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return result[0];
  }

  async getFeaturedSpot(id: number): Promise<FeaturedSpot | undefined> {
    const result = await this.db.select().from(featuredSpots).where(eq(featuredSpots.id, id)).limit(1);
    return result[0];
  }

  async getAllFeaturedSpots(): Promise<FeaturedSpot[]> {
    return await this.db.select().from(featuredSpots);
  }

  async getActiveFeaturedSpots(): Promise<FeaturedSpot[]> {
    return await this.db.select().from(featuredSpots).where(eq(featuredSpots.isActive, true));
  }

  async getCurrentFeaturedSpot(): Promise<FeaturedSpot | undefined> {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const result = await this.db.select().from(featuredSpots)
      .where(and(
        eq(featuredSpots.isActive, true),
        eq(featuredSpots.month, currentMonth),
        eq(featuredSpots.year, currentYear)
      ))
      .limit(1);
    return result[0];
  }

  async getFeaturedSpotByMonth(month: number, year: number): Promise<FeaturedSpot | undefined> {
    const result = await this.db.select().from(featuredSpots)
      .where(and(
        eq(featuredSpots.month, month),
        eq(featuredSpots.year, year),
        eq(featuredSpots.isActive, true)
      ))
      .limit(1);
    return result[0];
  }

  async updateFeaturedSpot(id: number, featuredSpotData: Partial<InsertFeaturedSpot>): Promise<FeaturedSpot | undefined> {
    const result = await this.db.update(featuredSpots)
      .set({ ...featuredSpotData, updatedAt: new Date() })
      .where(eq(featuredSpots.id, id))
      .returning();
    return result[0];
  }

  async deleteFeaturedSpot(id: number): Promise<boolean> {
    const result = await this.db.delete(featuredSpots).where(eq(featuredSpots.id, id));
    return result.changes > 0;
  }

  // Images operations
  async createImage(image: InsertImage): Promise<Image> {
    const result = await this.db.insert(images).values({
      ...image,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return result[0];
  }

  async getImage(id: number): Promise<Image | undefined> {
    const result = await this.db.select().from(images).where(eq(images.id, id)).limit(1);
    return result[0];
  }

  async getAllImages(): Promise<Image[]> {
    return await this.db.select().from(images);
  }

  async getImagesByEntity(entityType: string, entityId: number): Promise<Image[]> {
    return await this.db.select().from(images)
      .where(and(
        eq(images.entityType, entityType),
        eq(images.entityId, entityId),
        eq(images.isActive, true)
      ));
  }

  async updateImage(id: number, imageData: Partial<InsertImage>): Promise<Image | undefined> {
    const result = await this.db.update(images)
      .set({ ...imageData, updatedAt: new Date() })
      .where(eq(images.id, id))
      .returning();
    return result[0];
  }

  async deleteImage(id: number): Promise<boolean> {
    const result = await this.db.delete(images).where(eq(images.id, id));
    return result.changes > 0;
  }

  // Tribe, Profession, and Talking Point operations
  async getAllTribes(): Promise<Tribe[]> {
    return await this.db.select().from(tribes).orderBy(tribes.id);
  }

  async getAllProfessions(): Promise<Profession[]> {
    return await this.db.select().from(professions).orderBy(professions.id);
  }

  async getAllTalkingPoints(): Promise<TalkingPoint[]> {
    return await this.db.select().from(talkingPoints);
  }

  async getTalkingPointsByProfession(professionId: number): Promise<TalkingPoint[]> {
    return await this.db.select().from(talkingPoints).where(eq(talkingPoints.professionId, professionId));
  }

  // WiFi Test and Check-in operations
  async recordWifiTest(test: InsertWifiTest): Promise<WifiTest> {
    const result = await this.db.insert(wifiTests).values({
      ...test,
      testedAt: new Date()
    }).returning();
    return result[0];
  }

  async recordCheckIn(checkIn: InsertCheckIn): Promise<CheckIn> {
    const result = await this.db.insert(checkIns).values({
      ...checkIn,
      checkedInAt: new Date()
    }).returning();
    return result[0];
  }

  async getCheckInCount(coffeeShopId: number, since?: Date): Promise<number> {
    const conditions = [eq(checkIns.coffeeShopId, coffeeShopId)];
    if (since) {
      conditions.push(gte(checkIns.checkedInAt, since));
    }
    const result = await this.db.select({ value: count() })
      .from(checkIns)
      .where(and(...conditions));
    return result[0].value;
  }

  async getWifiTestCount(coffeeShopId: number): Promise<number> {
    const result = await this.db.select({ value: count() })
      .from(wifiTests)
      .where(eq(wifiTests.coffeeShopId, coffeeShopId));
    return result[0].value;
  }

  // Recommendation Category operations
  async createRecommendationCategory(category: InsertRecommendationCategory): Promise<RecommendationCategory> {
    const result = await this.db.insert(recommendationCategories).values(category).returning();
    return result[0];
  }

  async getAllRecommendationCategories(): Promise<RecommendationCategory[]> {
    return await this.db.select().from(recommendationCategories);
  }

  async getShopsByRecommendationCategory(categorySlug: string): Promise<CoffeeShop[]> {
    const categoryResult = await this.db.select()
      .from(recommendationCategories)
      .where(eq(recommendationCategories.slug, categorySlug))
      .limit(1);

    if (categoryResult.length === 0) return [];

    const categoryId = categoryResult[0].id;

    // Join shopCategories with coffeeShops
    const results = await this.db.select({
      shop: coffeeShops
    })
      .from(shopCategories)
      .innerJoin(coffeeShops, eq(shopCategories.coffeeShopId, coffeeShops.id))
      .where(eq(shopCategories.categoryId, categoryId));

    return results.map(r => r.shop);
  }

  async addShopToCategory(coffeeShopId: number, categoryId: number): Promise<void> {
    await this.db.insert(shopCategories).values({
      coffeeShopId,
      categoryId
    });
  }
}