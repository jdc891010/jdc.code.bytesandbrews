-- Locations table for coffee shops and workspaces
CREATE TABLE locations (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    address VARCHAR,
    latitude DOUBLE,
    longitude DOUBLE,
    place_id VARCHAR,  -- For Google Places integration
    place_types VARCHAR[],  -- Array of place types
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
    id VARCHAR PRIMARY KEY,
    username VARCHAR NOT NULL,
    email VARCHAR,
    tribe_category VARCHAR,
    tribe_role VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE reviews (
    id VARCHAR PRIMARY KEY,
    location_id VARCHAR NOT NULL REFERENCES locations(id),
    user_id VARCHAR REFERENCES users(id),
    vibe_rating INTEGER CHECK (vibe_rating BETWEEN 0 AND 5),
    noise_rating INTEGER CHECK (noise_rating BETWEEN 0 AND 5),
    power_rating INTEGER CHECK (power_rating BETWEEN 0 AND 5),
    video_rating INTEGER CHECK (video_rating BETWEEN 0 AND 5),
    coffee_rating INTEGER CHECK (coffee_rating BETWEEN 0 AND 5),
    price_rating INTEGER CHECK (price_rating BETWEEN 0 AND 5),
    staff_rating INTEGER CHECK (staff_rating BETWEEN 0 AND 5),
    parking_rating INTEGER CHECK (parking_rating BETWEEN 0 AND 5),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Metrics table for speed tests and connectivity
CREATE TABLE metrics (
    id VARCHAR PRIMARY KEY,
    location_id VARCHAR NOT NULL REFERENCES locations(id),
    user_id VARCHAR REFERENCES users(id),
    download_speed DOUBLE,  -- Mbps
    upload_speed DOUBLE,    -- Mbps
    ping INTEGER,           -- ms
    jitter DOUBLE,          -- ms
    wifi_name VARCHAR,
    wifi_frequency VARCHAR,
    wifi_signal_strength VARCHAR,
    device_type VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tribes (occupation categories)
CREATE TABLE tribes (
    id VARCHAR PRIMARY KEY,
    category VARCHAR NOT NULL,
    subcategory VARCHAR,
    icon VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);