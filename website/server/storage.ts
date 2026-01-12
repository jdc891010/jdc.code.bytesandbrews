import { users, type User, type InsertUser } from "../shared/schema.js";
import { type Contact, type InsertContact } from "../shared/schema.js";
import { type SignUp, type InsertSignUp } from "../shared/schema.js";
import { type Subscriber, type InsertSubscriber } from "../shared/schema.js";
import { type CoffeeShop, type InsertCoffeeShop } from "../shared/schema.js";
import { type AdminUser, type InsertAdminUser } from "../shared/schema.js";
import { type Coupon, type InsertCoupon } from "../shared/schema.js";
import { type BlogPost, type InsertBlogPost } from "../shared/schema.js";
import { type Notification, type InsertNotification } from "../shared/schema.js";
import { type Special, type InsertSpecial } from "../shared/schema.js";
import { type FeaturedSpot, type InsertFeaturedSpot } from "../shared/schema.js";
import { type Tribe, type InsertTribe, type Profession, type InsertProfession, type TalkingPoint, type InsertTalkingPoint } from "../shared/schema.js";

// Update the interface with required CRUD methods
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Contact form operations
  createContact(contact: InsertContact): Promise<Contact>;
  getContact(id: number): Promise<Contact | undefined>;
  getAllContacts(): Promise<Contact[]>;

  // Sign up operations
  createSignUp(signup: InsertSignUp): Promise<SignUp>;
  getSignUp(id: number): Promise<SignUp | undefined>;
  getAllSignUps(): Promise<SignUp[]>;

  // Subscriber operations
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  getSubscriber(id: number): Promise<Subscriber | undefined>;
  getSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
  getAllSubscribers(): Promise<Subscriber[]>;

  // Coffee shop operations
  createCoffeeShop(coffeeShop: InsertCoffeeShop): Promise<CoffeeShop>;
  getCoffeeShop(id: number): Promise<CoffeeShop | undefined>;
  getAllCoffeeShops(): Promise<CoffeeShop[]>;
  updateCoffeeShop(id: number, coffeeShop: Partial<InsertCoffeeShop>): Promise<CoffeeShop | undefined>;
  deleteCoffeeShop(id: number): Promise<boolean>;

  // Admin user operations
  createAdminUser(adminUser: InsertAdminUser): Promise<AdminUser>;
  getAdminUser(id: number): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  getAdminUserByEmail(email: string): Promise<AdminUser | undefined>;
  getAllAdminUsers(): Promise<AdminUser[]>;
  updateAdminUser(id: number, adminUser: Partial<InsertAdminUser>): Promise<AdminUser | undefined>;
  updateAdminUserLastLogin(id: number): Promise<void>;

  // Coupon operations
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  getCoupon(id: number): Promise<Coupon | undefined>;
  getCouponByCode(code: string): Promise<Coupon | undefined>;
  getAllCoupons(): Promise<Coupon[]>;
  updateCoupon(id: number, coupon: Partial<InsertCoupon>): Promise<Coupon | undefined>;
  deleteCoupon(id: number): Promise<boolean>;
  incrementCouponUsage(id: number): Promise<boolean>;

  // Blog post operations
  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  updateBlogPost(id: number, blogPost: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotification(id: number): Promise<Notification | undefined>;
  getAllNotifications(): Promise<Notification[]>;
  getActiveNotifications(): Promise<Notification[]>;
  updateNotification(id: number, notification: Partial<InsertNotification>): Promise<Notification | undefined>;
  deleteNotification(id: number): Promise<boolean>;
  markNotificationAsSent(id: number): Promise<void>;

  // Special/Promotion operations
  createSpecial(special: InsertSpecial): Promise<Special>;
  getSpecial(id: number): Promise<Special | undefined>;
  getAllSpecials(): Promise<Special[]>;
  getActiveSpecials(): Promise<Special[]>;
  updateSpecial(id: number, special: Partial<InsertSpecial>): Promise<Special | undefined>;
  deleteSpecial(id: number): Promise<boolean>;

  // Featured Spot operations
  createFeaturedSpot(featuredSpot: InsertFeaturedSpot): Promise<FeaturedSpot>;
  getFeaturedSpot(id: number): Promise<FeaturedSpot | undefined>;
  getAllFeaturedSpots(): Promise<FeaturedSpot[]>;
  getActiveFeaturedSpots(): Promise<FeaturedSpot[]>;
  updateFeaturedSpot(id: number, featuredSpot: Partial<InsertFeaturedSpot>): Promise<FeaturedSpot | undefined>;
  deleteFeaturedSpot(id: number): Promise<boolean>;

  // Tribe, Profession, and Talking Point operations
  getAllTribes(): Promise<Tribe[]>;
  getAllProfessions(): Promise<Profession[]>;
  getAllTalkingPoints(): Promise<TalkingPoint[]>;
  getTalkingPointsByProfession(professionId: number): Promise<TalkingPoint[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contacts: Map<number, Contact>;
  private signups: Map<number, SignUp>;
  private subscribers: Map<number, Subscriber>;
  private coffeeShops: Map<number, CoffeeShop>;
  private adminUsers: Map<number, AdminUser>;
  private coupons: Map<number, Coupon>;
  private blogPosts: Map<number, BlogPost>;
  private notifications: Map<number, Notification>;

  private userCurrentId: number;
  private contactCurrentId: number;
  private signupCurrentId: number;
  private subscriberCurrentId: number;
  private coffeeShopCurrentId: number;
  private adminUserCurrentId: number;
  private couponCurrentId: number;
  private blogPostCurrentId: number;
  private notificationCurrentId: number;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.signups = new Map();
    this.subscribers = new Map();
    this.coffeeShops = new Map();
    this.adminUsers = new Map();
    this.coupons = new Map();
    this.blogPosts = new Map();
    this.notifications = new Map();

    this.userCurrentId = 1;
    this.contactCurrentId = 1;
    this.signupCurrentId = 1;
    this.subscriberCurrentId = 1;
    this.coffeeShopCurrentId = 1;
    this.adminUserCurrentId = 1;
    this.couponCurrentId = 1;
    this.blogPostCurrentId = 1;
    this.notificationCurrentId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user = {
      ...insertUser,
      id
    } as User;
    this.users.set(id, user);
    return user;
  }

  // Contact form operations
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.contactCurrentId++;
    const now = new Date();
    const contact = {
      ...insertContact,
      id,
      createdAt: now
    } as Contact;
    this.contacts.set(id, contact);
    return contact;
  }

  async getContact(id: number): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  // Sign up operations
  async createSignUp(insertSignUp: InsertSignUp): Promise<SignUp> {
    const id = this.signupCurrentId++;
    const now = new Date();
    const signup = {
      ...insertSignUp,
      id,
      createdAt: now,
      tribe: (insertSignUp as any).tribe ?? null
    } as SignUp;
    this.signups.set(id, signup);
    return signup;
  }

  async getSignUp(id: number): Promise<SignUp | undefined> {
    return this.signups.get(id);
  }

  async getAllSignUps(): Promise<SignUp[]> {
    return Array.from(this.signups.values());
  }

  // Subscriber operations
  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    // Check if the email already exists
    const existingSubscriber = await this.getSubscriberByEmail(insertSubscriber.email);
    if (existingSubscriber) {
      return existingSubscriber;
    }

    const id = this.subscriberCurrentId++;
    const now = new Date();
    const subscriber = {
      ...insertSubscriber,
      id,
      createdAt: now
    } as Subscriber;
    this.subscribers.set(id, subscriber);
    return subscriber;
  }

  async getSubscriber(id: number): Promise<Subscriber | undefined> {
    return this.subscribers.get(id);
  }

  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    return Array.from(this.subscribers.values()).find(
      (subscriber) => subscriber.email === email,
    );
  }

  async getAllSubscribers(): Promise<Subscriber[]> {
    return Array.from(this.subscribers.values());
  }

  // Coffee shop operations
  async createCoffeeShop(insertCoffeeShop: InsertCoffeeShop): Promise<CoffeeShop> {
    const id = this.coffeeShopCurrentId++;
    const now = new Date();
    const coffeeShop = {
      ...insertCoffeeShop,
      id,
      createdAt: now,
      updatedAt: now,
      wifiSpeed: (insertCoffeeShop as any).wifiSpeed ?? null
    } as CoffeeShop;
    this.coffeeShops.set(id, coffeeShop);
    return coffeeShop;
  }

  async getCoffeeShop(id: number): Promise<CoffeeShop | undefined> {
    return this.coffeeShops.get(id);
  }

  async getAllCoffeeShops(): Promise<CoffeeShop[]> {
    return Array.from(this.coffeeShops.values());
  }

  async updateCoffeeShop(id: number, coffeeShopData: Partial<InsertCoffeeShop>): Promise<CoffeeShop | undefined> {
    const existing = this.coffeeShops.get(id);
    if (!existing) return undefined;

    const updated: CoffeeShop = {
      ...existing,
      ...coffeeShopData,
      updatedAt: new Date()
    };
    this.coffeeShops.set(id, updated);
    return updated;
  }

  async deleteCoffeeShop(id: number): Promise<boolean> {
    return this.coffeeShops.delete(id);
  }

  // Admin user operations
  async createAdminUser(insertAdminUser: InsertAdminUser): Promise<AdminUser> {
    const id = this.adminUserCurrentId++;
    const now = new Date();
    const adminUser = {
      ...insertAdminUser,
      id,
      isActive: true,
      lastLogin: null,
      createdAt: now,
      updatedAt: now,
      role: (insertAdminUser as any).role ?? 'admin'
    } as AdminUser;
    this.adminUsers.set(id, adminUser);
    return adminUser;
  }

  async getAdminUser(id: number): Promise<AdminUser | undefined> {
    return this.adminUsers.get(id);
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    return Array.from(this.adminUsers.values()).find(
      (user) => user.username === username
    );
  }

  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    return Array.from(this.adminUsers.values()).find(
      (user) => user.email === email
    );
  }

  async getAllAdminUsers(): Promise<AdminUser[]> {
    return Array.from(this.adminUsers.values());
  }

  async updateAdminUser(id: number, adminUserData: Partial<InsertAdminUser>): Promise<AdminUser | undefined> {
    const existing = this.adminUsers.get(id);
    if (!existing) return undefined;

    const updated: AdminUser = {
      ...existing,
      ...adminUserData,
      updatedAt: new Date()
    };
    this.adminUsers.set(id, updated);
    return updated;
  }

  async updateAdminUserLastLogin(id: number): Promise<void> {
    const existing = this.adminUsers.get(id);
    if (existing) {
      existing.lastLogin = new Date();
      this.adminUsers.set(id, existing);
    }
  }

  // Coupon operations
  async createCoupon(insertCoupon: InsertCoupon): Promise<Coupon> {
    const id = this.couponCurrentId++;
    const now = new Date();
    const coupon = {
      ...insertCoupon,
      id,
      currentUses: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      minOrderAmount: insertCoupon.minOrderAmount ?? null,
      maxUses: insertCoupon.maxUses ?? null,
      expiresAt: insertCoupon.expiresAt ?? null
    } as Coupon;
    this.coupons.set(id, coupon);
    return coupon;
  }

  async getCoupon(id: number): Promise<Coupon | undefined> {
    return this.coupons.get(id);
  }

  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    return Array.from(this.coupons.values()).find(
      (coupon) => coupon.code === code
    );
  }

  async getAllCoupons(): Promise<Coupon[]> {
    return Array.from(this.coupons.values());
  }

  async updateCoupon(id: number, couponData: Partial<InsertCoupon>): Promise<Coupon | undefined> {
    const existing = this.coupons.get(id);
    if (!existing) return undefined;

    const updated: Coupon = {
      ...existing,
      ...couponData,
      updatedAt: new Date()
    };
    this.coupons.set(id, updated);
    return updated;
  }

  async deleteCoupon(id: number): Promise<boolean> {
    return this.coupons.delete(id);
  }

  async incrementCouponUsage(id: number): Promise<boolean> {
    const existing = this.coupons.get(id);
    if (!existing) return false;

    existing.currentUses += 1;
    this.coupons.set(id, existing);
    return true;
  }

  // Blog post operations
  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostCurrentId++;
    const now = new Date();
    const blogPost = {
      ...insertBlogPost,
      id,
      authorId: null,
      createdAt: now,
      updatedAt: now,
      excerpt: insertBlogPost.excerpt ?? null,
      featuredImage: insertBlogPost.featuredImage ?? null,
      status: insertBlogPost.status ?? 'draft',
      publishedAt: insertBlogPost.publishedAt ?? null
    } as BlogPost;
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(
      (post) => post.slug === slug
    );
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).filter(
      (post) => post.status === 'published'
    );
  }

  async updateBlogPost(id: number, blogPostData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existing = this.blogPosts.get(id);
    if (!existing) return undefined;

    const updated: BlogPost = {
      ...existing,
      ...blogPostData,
      updatedAt: new Date()
    };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  // Notification operations
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.notificationCurrentId++;
    const now = new Date();
    const notification = {
      ...insertNotification,
      id,
      isActive: true,
      sentAt: null,
      createdAt: now,
      updatedAt: now,
      type: insertNotification.type ?? 'info',
      targetAudience: insertNotification.targetAudience ?? 'all',
      scheduledAt: insertNotification.scheduledAt ?? null
    } as Notification;
    this.notifications.set(id, notification);
    return notification;
  }

  async getNotification(id: number): Promise<Notification | undefined> {
    return this.notifications.get(id);
  }

  async getAllNotifications(): Promise<Notification[]> {
    return Array.from(this.notifications.values());
  }

  async getActiveNotifications(): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(
      (notification) => notification.isActive
    );
  }

  async updateNotification(id: number, notificationData: Partial<InsertNotification>): Promise<Notification | undefined> {
    const existing = this.notifications.get(id);
    if (!existing) return undefined;

    const updated: Notification = {
      ...existing,
      ...notificationData,
      updatedAt: new Date()
    };
    this.notifications.set(id, updated);
    return updated;
  }

  async deleteNotification(id: number): Promise<boolean> {
    return this.notifications.delete(id);
  }

  async markNotificationAsSent(id: number): Promise<void> {
    const existing = this.notifications.get(id);
    if (existing) {
      existing.sentAt = new Date();
      this.notifications.set(id, existing);
    }
  }

  // Tribe, Profession, and Talking Point stubs
  async getAllTribes(): Promise<Tribe[]> {
    return [];
  }
  async getAllProfessions(): Promise<Profession[]> {
    return [];
  }
  async getAllTalkingPoints(): Promise<TalkingPoint[]> {
    return [];
  }
  async getTalkingPointsByProfession(professionId: number): Promise<TalkingPoint[]> {
    return [];
  }
}

import { SQLiteStorage } from "./sqlite-storage.js";

export const storage = new SQLiteStorage();
