import { users, type User, type InsertUser } from "@shared/schema";
import { type Contact, type InsertContact } from "@shared/schema";
import { type SignUp, type InsertSignUp } from "@shared/schema";
import { type Subscriber, type InsertSubscriber } from "@shared/schema";
import { type CoffeeShop, type InsertCoffeeShop } from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contacts: Map<number, Contact>;
  private signups: Map<number, SignUp>;
  private subscribers: Map<number, Subscriber>;
  private coffeeShops: Map<number, CoffeeShop>;
  
  private userCurrentId: number;
  private contactCurrentId: number;
  private signupCurrentId: number;
  private subscriberCurrentId: number;
  private coffeeShopCurrentId: number;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.signups = new Map();
    this.subscribers = new Map();
    this.coffeeShops = new Map();
    
    this.userCurrentId = 1;
    this.contactCurrentId = 1;
    this.signupCurrentId = 1;
    this.subscriberCurrentId = 1;
    this.coffeeShopCurrentId = 1;
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
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Contact form operations
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.contactCurrentId++;
    const now = new Date();
    const contact: Contact = { 
      ...insertContact, 
      id, 
      createdAt: now
    };
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
    const signup: SignUp = { 
      ...insertSignUp, 
      id, 
      createdAt: now
    };
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
    const subscriber: Subscriber = { 
      ...insertSubscriber, 
      id, 
      createdAt: now
    };
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
    const coffeeShop: CoffeeShop = { 
      ...insertCoffeeShop, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.coffeeShops.set(id, coffeeShop);
    return coffeeShop;
  }
  
  async getCoffeeShop(id: number): Promise<CoffeeShop | undefined> {
    return this.coffeeShops.get(id);
  }
  
  async getAllCoffeeShops(): Promise<CoffeeShop[]> {
    return Array.from(this.coffeeShops.values());
  }
}

export const storage = new MemStorage();
