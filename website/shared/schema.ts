import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Model (keeping the original)
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Contact Form Table
export const contacts = sqliteTable("contacts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const contactFormSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof contactFormSchema>;

// Sign Up / Waitlist Table
export const signups = sqliteTable("signups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  city: text("city").notNull(),
  tribe: text("tribe"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const signUpFormSchema = createInsertSchema(signups).pick({
  name: true,
  email: true,
  city: true,
  tribe: true,
});

export type SignUp = typeof signups.$inferSelect;
export type InsertSignUp = z.infer<typeof signUpFormSchema>;

// Newsletter Subscription Table
export const subscribers = sqliteTable("subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const subscribeSchema = createInsertSchema(subscribers).pick({
  email: true,
});

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = z.infer<typeof subscribeSchema>;

// Coffee Shop Table (for future implementation)
export const coffeeShops = sqliteTable("coffee_shops", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  postalCode: text("postal_code"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  website: text("website"),
  phoneNumber: text("phone_number"),
  rating: text("rating"),
  googlePlacesId: text("google_places_id"),
  // Opening hours stored as JSON string with day-wise hours
  openingHours: text("opening_hours"), // JSON: {"monday": {"open": "08:00", "close": "18:00"}, ...}
  // Simplified opening/closing times for quick queries
  opensAt: text("opens_at"), // e.g., "08:00" (earliest opening time)
  closesAt: text("closes_at"), // e.g., "22:00" (latest closing time)
  isOpen24Hours: integer("is_open_24_hours", { mode: "boolean" }).default(false),
  wifiSpeed: integer("wifi_speed"),
  imageUrl: text("image_url"),
  thumbnailUrl: text("thumbnail_url"),
  tribe: text("tribe"),
  vibe: text("vibe"),
  amenities: text("amenities"), // JSON string
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const coffeeShopSchema = createInsertSchema(coffeeShops).pick({
  name: true,
  description: true,
  address: true,
  city: true,
  country: true,
  postalCode: true,
  latitude: true,
  longitude: true,
  website: true,
  phoneNumber: true,
  rating: true,
  googlePlacesId: true,
  openingHours: true,
  opensAt: true,
  closesAt: true,
  isOpen24Hours: true,
  wifiSpeed: true,
  imageUrl: true,
  thumbnailUrl: true,
  tribe: true,
  vibe: true,
  amenities: true,
});

export type CoffeeShop = typeof coffeeShops.$inferSelect;
export type InsertCoffeeShop = z.infer<typeof coffeeShopSchema>;

// Admin Users Table
export const adminUsers = sqliteTable("admin_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // bcrypt hashed
  role: text("role").notNull().default("admin"), // admin, super_admin
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  lastLogin: integer("last_login", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const adminUserSchema = createInsertSchema(adminUsers).pick({
  username: true,
  email: true,
  password: true,
  role: true,
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof adminUserSchema>;

// Coupons Table
export const coupons = sqliteTable("coupons", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  discountType: text("discount_type").notNull(), // percentage, fixed
  discountValue: integer("discount_value").notNull(), // percentage or cents
  minOrderAmount: integer("min_order_amount"), // in cents
  maxUses: integer("max_uses"),
  currentUses: integer("current_uses").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const couponSchema = createInsertSchema(coupons).pick({
  code: true,
  description: true,
  discountType: true,
  discountValue: true,
  minOrderAmount: true,
  maxUses: true,
  expiresAt: true,
});

export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = z.infer<typeof couponSchema>;

// Blog Posts Table
export const blogPosts = sqliteTable("blog_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  featuredImage: text("featured_image"),
  status: text("status").notNull().default("draft"), // draft, published, archived
  authorId: integer("author_id").references(() => adminUsers.id),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const blogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  slug: true,
  content: true,
  excerpt: true,
  featuredImage: true,
  status: true,
  publishedAt: true,
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof blogPostSchema>;

// Notifications Table
export const notifications = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("info"), // info, warning, error, success
  targetAudience: text("target_audience").notNull().default("all"), // all, subscribers, signups
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  scheduledAt: integer("scheduled_at", { mode: "timestamp" }),
  sentAt: integer("sent_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const notificationSchema = createInsertSchema(notifications).pick({
  title: true,
  message: true,
  type: true,
  targetAudience: true,
  scheduledAt: true,
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof notificationSchema>;

// Specials/Promotions Table
export const specials = sqliteTable("specials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  coffeeShopId: integer("coffee_shop_id").references(() => coffeeShops.id).notNull(),
  discountType: text("discount_type").notNull(), // percentage, fixed, bogo, free_item
  discountValue: integer("discount_value"), // percentage or cents
  originalPrice: integer("original_price"), // in cents
  specialPrice: integer("special_price"), // in cents
  terms: text("terms"), // terms and conditions
  imageUrl: text("image_url"),
  thumbnailUrl: text("thumbnail_url"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }).notNull(),
  displayOnHomepage: integer("display_on_homepage", { mode: "boolean" }).notNull().default(true),
  priority: integer("priority").notNull().default(0), // higher number = higher priority
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const specialSchema = createInsertSchema(specials).pick({
  title: true,
  description: true,
  coffeeShopId: true,
  discountType: true,
  discountValue: true,
  originalPrice: true,
  specialPrice: true,
  terms: true,
  imageUrl: true,
  thumbnailUrl: true,
  startDate: true,
  endDate: true,
  displayOnHomepage: true,
  priority: true,
});

export type Special = typeof specials.$inferSelect;
export type InsertSpecial = z.infer<typeof specialSchema>;

// Featured Spots Table
export const featuredSpots = sqliteTable("featured_spots", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  coffeeShopId: integer("coffee_shop_id").references(() => coffeeShops.id).notNull(),
  title: text("title"), // optional custom title
  description: text("description"), // why it's featured
  month: integer("month").notNull(), // 1-12
  year: integer("year").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const featuredSpotSchema = createInsertSchema(featuredSpots).pick({
  coffeeShopId: true,
  title: true,
  description: true,
  month: true,
  year: true,
});

export type FeaturedSpot = typeof featuredSpots.$inferSelect;
export type InsertFeaturedSpot = z.infer<typeof featuredSpotSchema>;

// Images Table for better image management
export const images = sqliteTable("images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(), // in bytes
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  entityType: text("entity_type").notNull(), // coffee_shop, special, featured_spot, blog_post
  entityId: integer("entity_id"), // reference to the entity
  altText: text("alt_text"),
  caption: text("caption"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const imageSchema = createInsertSchema(images).pick({
  filename: true,
  originalName: true,
  mimeType: true,
  size: true,
  url: true,
  thumbnailUrl: true,
  entityType: true,
  entityId: true,
  altText: true,
  caption: true,
});

export type Image = typeof images.$inferSelect;
export type InsertImage = z.infer<typeof imageSchema>;
