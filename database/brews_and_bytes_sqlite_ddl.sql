-- SQLite DDL for Brews and Bytes schema (aligned with Drizzle schema)

-- Drop existing tables if they exist
DROP TABLE IF EXISTS featured_spots;
DROP TABLE IF EXISTS specials;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS blog_posts;
DROP TABLE IF EXISTS coupons;
DROP TABLE IF EXISTS admin_users;
DROP TABLE IF EXISTS coffee_shops;
DROP TABLE IF EXISTS subscribers;
DROP TABLE IF EXISTS signups;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS users;

-- User Model
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Contact Form Table
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Sign Up / Waitlist Table
CREATE TABLE signups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  tribe TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Newsletter Subscription Table
CREATE TABLE subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Coffee Shop Table
CREATE TABLE coffee_shops (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  postal_code TEXT,
  latitude TEXT,
  longitude TEXT,
  website TEXT,
  phone_number TEXT,
  rating TEXT,
  google_places_id TEXT,
  price_level TEXT,
  user_rating_count INTEGER,
  business_status TEXT,
  google_maps_uri TEXT,
  opening_hours TEXT, -- JSON: {"monday": {"open": "08:00", "close": "18:00"}, ...}
  opens_at TEXT,
  closes_at TEXT,
  is_open_24_hours INTEGER DEFAULT 0,
  wifi_speed INTEGER,
  image_url TEXT,
  thumbnail_url TEXT,
  tribe TEXT,
  vibe TEXT,
  amenities TEXT, -- JSON string
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Admin Users Table
CREATE TABLE admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'admin' NOT NULL,
  is_active INTEGER DEFAULT 1 NOT NULL,
  last_login INTEGER,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Coupons Table
CREATE TABLE coupons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  discount_type TEXT NOT NULL,
  discount_value INTEGER NOT NULL,
  min_order_amount INTEGER,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0 NOT NULL,
  is_active INTEGER DEFAULT 1 NOT NULL,
  expires_at INTEGER,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Blog Posts Table
CREATE TABLE blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  status TEXT DEFAULT 'draft' NOT NULL,
  author_id INTEGER REFERENCES admin_users(id),
  published_at INTEGER,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Notifications Table
CREATE TABLE notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' NOT NULL,
  target_audience TEXT DEFAULT 'all' NOT NULL,
  is_active INTEGER DEFAULT 1 NOT NULL,
  scheduled_at INTEGER,
  sent_at INTEGER,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Specials/Promotions Table
CREATE TABLE specials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  coffee_shop_id INTEGER NOT NULL REFERENCES coffee_shops(id),
  discount_type TEXT NOT NULL,
  discount_value INTEGER,
  original_price INTEGER,
  special_price INTEGER,
  terms TEXT,
  image_url TEXT,
  thumbnail_url TEXT,
  is_active INTEGER DEFAULT 1 NOT NULL,
  start_date INTEGER NOT NULL,
  end_date INTEGER NOT NULL,
  display_on_homepage INTEGER DEFAULT 1 NOT NULL,
  priority INTEGER DEFAULT 0 NOT NULL,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Featured Spots Table
CREATE TABLE featured_spots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  coffee_shop_id INTEGER NOT NULL REFERENCES coffee_shops(id),
  title TEXT,
  description TEXT,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  is_active INTEGER DEFAULT 1 NOT NULL,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Indexes
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_signups_email ON signups(email);
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_coffee_shops_city ON coffee_shops(city);
CREATE INDEX idx_coffee_shops_name ON coffee_shops(name);
