#!/bin/bash
set -e

# Create the database schema
echo "Creating database schema..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
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
EOSQL

echo "Schema created successfully."

# Load mock data
echo "Loading mock data..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
-- Load places data
COPY places(id, name, address, latitude, longitude, phone, average_spend_min, average_spend_max, internet_quality, handicapped, created_at) FROM '/docker-entrypoint-initdb.d/data/mock_places.csv' WITH (FORMAT csv, HEADER true);

-- Load tribes data
COPY tribes(id, name, description) FROM '/docker-entrypoint-initdb.d/data/mock_tribes.csv' WITH (FORMAT csv, HEADER true);

-- Load place_tribes data
COPY place_tribes(place_id, tribe_id) FROM '/docker-entrypoint-initdb.d/data/mock_place_tribes.csv' WITH (FORMAT csv, HEADER false);

-- Load reviews data
COPY reviews(id, place_id, user_name, rating, comment, created_at) FROM '/docker-entrypoint-initdb.d/data/mock_reviews.csv' WITH (FORMAT csv, HEADER true);

-- Load metrics data
COPY metrics(id, name) FROM '/docker-entrypoint-initdb.d/data/mock_metrics.csv' WITH (FORMAT csv, HEADER true);

-- Load metric_details data
COPY metric_details(id, place_id, metric_id, value, updated_at) FROM '/docker-entrypoint-initdb.d/data/mock_metric_details.csv' WITH (FORMAT csv, HEADER true);

-- Load heatmap_data
COPY heatmap_data(id, place_id, metric_id, day_of_week, hour_of_day, value, created_at) FROM '/docker-entrypoint-initdb.d/data/mock_heatmap_data.csv' WITH (FORMAT csv, HEADER true);
EOSQL

echo "Mock data loaded successfully."