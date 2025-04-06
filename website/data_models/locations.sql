CREATE TABLE locations (
    location_id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    address VARCHAR,
    latitude DOUBLE,
    longitude DOUBLE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    google_place_id VARCHAR
);