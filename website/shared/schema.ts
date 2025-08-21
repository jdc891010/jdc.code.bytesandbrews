import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Model (keeping the original)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
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
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
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
export const signups = pgTable("signups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  city: text("city").notNull(),
  tribe: text("tribe"),
  createdAt: timestamp("created_at").defaultNow(),
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
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subscribeSchema = createInsertSchema(subscribers).pick({
  email: true,
});

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = z.infer<typeof subscribeSchema>;

// Coffee Shop Table (for future implementation)
export const coffeeShops = pgTable("coffee_shops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  wifiSpeed: integer("wifi_speed"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const coffeeShopSchema = createInsertSchema(coffeeShops).pick({
  name: true,
  description: true,
  address: true,
  city: true,
  country: true,
  wifiSpeed: true,
});

export type CoffeeShop = typeof coffeeShops.$inferSelect;
export type InsertCoffeeShop = z.infer<typeof coffeeShopSchema>;
