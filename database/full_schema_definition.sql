-- Full Database Schema Definition for Brews and Bytes
-- Generated based on website/shared/schema.ts (Drizzle ORM definition)
-- Target Dialect: SQLite (Compatible with PostgreSQL with minor adjustments)

-- ==========================================
-- 1. Users Table
-- Purpose: Stores user authentication data
-- Update Strategy: Updated via profile management (rarely changed)
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- ==========================================
-- 2. Contacts Table
-- Purpose: Stores contact form submissions
-- Update Strategy: Append-only (Created via form, read by admin)
-- ==========================================
CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. Signups Table
-- Purpose: Waitlist management
-- Update Strategy: Append-only
-- ==========================================
CREATE TABLE IF NOT EXISTS signups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    city TEXT NOT NULL,
    tribe TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 4. Subscribers Table
-- Purpose: Newsletter subscriptions
-- Update Strategy: Append-only (Unsubscribe deletes row or marks inactive)
-- ==========================================
CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 5. Coffee Shops Table
-- Purpose: Core data for workspaces
-- Update Strategy: 
--   - Created via Admin Panel or Google Places Import
--   - Updated frequently for ratings, wifi speeds, and details
-- Indexing:
--   - city: Frequent filtering by location
--   - google_places_id: Duplicate check and syncing
--   - wifi_speed: Filtering by quality
-- ==========================================
CREATE TABLE IF NOT EXISTS coffee_shops (
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
    opening_hours TEXT, -- Stored as JSON
    opens_at TEXT,
    closes_at TEXT,
    is_open_24_hours INTEGER DEFAULT 0, -- Boolean
    wifi_speed INTEGER,
    image_url TEXT,
    thumbnail_url TEXT,
    tribe TEXT,
    vibe TEXT,
    amenities TEXT, -- Stored as JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_coffee_shops_city ON coffee_shops(city);
CREATE INDEX IF NOT EXISTS idx_coffee_shops_google_places_id ON coffee_shops(google_places_id);
CREATE INDEX IF NOT EXISTS idx_coffee_shops_wifi_speed ON coffee_shops(wifi_speed);

-- ==========================================
-- 6. Admin Users Table
-- Purpose: Back-office access
-- ==========================================
CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    is_active INTEGER NOT NULL DEFAULT 1,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 7. Coupons Table
-- Purpose: Promotional codes
-- ==========================================
CREATE TABLE IF NOT EXISTS coupons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    discount_type TEXT NOT NULL, -- 'percentage', 'fixed'
    discount_value INTEGER NOT NULL,
    min_order_amount INTEGER,
    max_uses INTEGER,
    current_uses INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- ==========================================
-- 8. Blog Posts Table
-- Purpose: Content marketing
-- Indexing: slug for URL lookups
-- ==========================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'archived'
    author_id INTEGER REFERENCES admin_users(id),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);

-- ==========================================
-- 9. Notifications Table
-- Purpose: System alerts and messages
-- ==========================================
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    target_audience TEXT NOT NULL DEFAULT 'all',
    is_active INTEGER NOT NULL DEFAULT 1,
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 10. Specials Table
-- Purpose: Offers linked to coffee shops
-- Relationship: Many-to-One with coffee_shops
-- ==========================================
CREATE TABLE IF NOT EXISTS specials (
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
    is_active INTEGER NOT NULL DEFAULT 1,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    display_on_homepage INTEGER NOT NULL DEFAULT 1,
    priority INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_specials_coffee_shop_id ON specials(coffee_shop_id);
CREATE INDEX IF NOT EXISTS idx_specials_active_dates ON specials(is_active, start_date, end_date);

-- ==========================================
-- 11. Featured Spots Table
-- Purpose: Monthly highlights
-- Relationship: Many-to-One with coffee_shops
-- ==========================================
CREATE TABLE IF NOT EXISTS featured_spots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    coffee_shop_id INTEGER NOT NULL REFERENCES coffee_shops(id),
    title TEXT,
    description TEXT,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_featured_spots_date ON featured_spots(year, month);

-- ==========================================
-- 12. Images Table
-- Purpose: Polymorphic image storage for various entities
-- Update Strategy: Linked to entities via entity_type and entity_id
-- ==========================================
CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    entity_type TEXT NOT NULL, -- 'coffee_shop', 'special', 'featured_spot', 'blog_post'
    entity_id INTEGER,
    alt_text TEXT,
    caption TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_images_entity ON images(entity_type, entity_id);

-- ==========================================
-- Update Triggers (Concept for SQLite/Postgres)
-- ==========================================
-- Note: SQLite requires separate triggers for each table to update 'updated_at'
-- Example for coffee_shops:
/*
CREATE TRIGGER update_coffee_shops_timestamp 
AFTER UPDATE ON coffee_shops
BEGIN
    UPDATE coffee_shops SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
*/
