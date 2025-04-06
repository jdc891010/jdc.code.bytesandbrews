CREATE TABLE reviews (
    review_id INTEGER PRIMARY KEY,
    location_id INTEGER REFERENCES locations(location_id),
    vibe_rating INTEGER CHECK (vibe_rating BETWEEN 0 AND 5),
    noise_rating INTEGER CHECK (noise_rating BETWEEN 0 AND 5),
    power_rating INTEGER CHECK (power_rating BETWEEN 0 AND 5),
    video_rating INTEGER CHECK (video_rating BETWEEN 0 AND 5),
    coffee_rating INTEGER CHECK (coffee_rating BETWEEN 0 AND 5),
    price_rating INTEGER CHECK (price_rating BETWEEN 0 AND 5),
    staff_rating INTEGER CHECK (staff_rating BETWEEN 0 AND 5),
    parking_rating INTEGER CHECK (parking_rating BETWEEN 0 AND 5),
    comments TEXT,
    occupation_category VARCHAR,
    occupation_role VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_device_hash VARCHAR -- Optional pseudonymous identifier
);