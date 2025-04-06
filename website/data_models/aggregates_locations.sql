CREATE TABLE location_metrics (
    location_id INTEGER PRIMARY KEY REFERENCES locations(location_id),
    avg_internet_speed DOUBLE,
    avg_vibe_rating DOUBLE,
    avg_noise_rating DOUBLE,
    avg_power_rating DOUBLE,
    avg_video_rating DOUBLE,
    avg_coffee_rating DOUBLE,
    avg_price_rating DOUBLE,
    avg_staff_rating DOUBLE,
    avg_parking_rating DOUBLE,
    review_count INTEGER,
    speedtest_count INTEGER,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);