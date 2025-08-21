-- PostgreSQL DDL for Brews and Bytes schema

-- Drop existing tables if any (cascade to remove dependencies)
DROP TABLE IF EXISTS coffee_shops CASCADE;
DROP TABLE IF EXISTS subscribers CASCADE;
DROP TABLE IF EXISTS signups CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- User Model
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

-- Contact Form Table
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sign Up / Waitlist Table
CREATE TABLE signups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  tribe VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter Subscription Table
CREATE TABLE subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coffee Shop Table (for future implementation)
CREATE TABLE coffee_shops (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  wifi_speed INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_signups_email ON signups(email);
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_coffee_shops_city ON coffee_shops(city);
CREATE INDEX idx_coffee_shops_name ON coffee_shops(name);

-- PostgreSQL DDL for Brews and Bytes schema

-- Drop existing tables if any (cascade to remove dependencies)
DROP TABLE IF EXISTS heatmap_data CASCADE;
DROP TABLE IF EXISTS metric_details CASCADE;
DROP TABLE IF EXISTS metrics CASCADE;
DROP TABLE IF EXISTS place_tribes CASCADE;
DROP TABLE IF EXISTS tribes CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS places CASCADE;

-- Main places table
CREATE TABLE places (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  address         TEXT,
  latitude        NUMERIC(9,6),
  longitude       NUMERIC(9,6),
  phone           VARCHAR(50),
  average_spend_min NUMERIC(10,2),
  average_spend_max NUMERIC(10,2),
  internet_quality VARCHAR(50),
  handicapped      BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tribes and mapping to places
CREATE TABLE tribes (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE place_tribes (
  place_id   INTEGER NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  tribe_id   INTEGER NOT NULL REFERENCES tribes(id) ON DELETE CASCADE,
  PRIMARY KEY(place_id, tribe_id)
);

-- User reviews for places
CREATE TABLE reviews (
  id          SERIAL PRIMARY KEY,
  place_id    INTEGER NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  user_name   VARCHAR(100),
  rating      NUMERIC(2,1) CHECK(rating >= 0 AND rating <= 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Heatmap metrics (speed, vibe, parking, noise)
CREATE TABLE metrics (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(50) NOT NULL UNIQUE
);

-- Summary values or details per metric and place
CREATE TABLE metric_details (
  id         SERIAL PRIMARY KEY,
  place_id   INTEGER NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  metric_id  INTEGER NOT NULL REFERENCES metrics(id) ON DELETE CASCADE,
  value      NUMERIC NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Detailed heatmap data by day/hour
CREATE TABLE heatmap_data (
  id           SERIAL PRIMARY KEY,
  place_id     INTEGER NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  metric_id    INTEGER NOT NULL REFERENCES metrics(id) ON DELETE CASCADE,
  day_of_week  SMALLINT NOT NULL CHECK(day_of_week BETWEEN 0 AND 6),
  hour_of_day  SMALLINT NOT NULL CHECK(hour_of_day BETWEEN 0 AND 23),
  value        NUMERIC NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes to speed lookups
CREATE INDEX idx_reviews_place ON reviews(place_id);
CREATE INDEX idx_metric_details_place_metric ON metric_details(place_id, metric_id);
CREATE INDEX idx_heatmap_place_metric ON heatmap_data(place_id, metric_id);
