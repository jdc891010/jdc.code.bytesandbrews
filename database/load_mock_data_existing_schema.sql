-- Script to load mock data into the database
-- Run this after creating the tables with ddl.sql

-- Load places data
\copy places(id, name, address, latitude, longitude, phone, average_spend_min, average_spend_max, internet_quality, handicapped, created_at) FROM 'database/mock_places.csv' WITH (FORMAT csv, HEADER true);

-- Load tribes data
\copy tribes(id, name, description) FROM 'database/mock_tribes.csv' WITH (FORMAT csv, HEADER true);

-- Load place_tribes data
\copy place_tribes(place_id, tribe_id) FROM 'database/mock_place_tribes.csv' WITH (FORMAT csv, HEADER false);

-- Load reviews data
\copy reviews(id, place_id, user_name, rating, comment, created_at) FROM 'database/mock_reviews.csv' WITH (FORMAT csv, HEADER true);

-- Load metrics data
\copy metrics(id, name) FROM 'database/mock_metrics.csv' WITH (FORMAT csv, HEADER true);

-- Load metric_details data
\copy metric_details(id, place_id, metric_id, value, updated_at) FROM 'database/mock_metric_details.csv' WITH (FORMAT csv, HEADER true);

-- Load heatmap_data
\copy heatmap_data(id, place_id, metric_id, day_of_week, hour_of_day, value, created_at) FROM 'database/mock_heatmap_data.csv' WITH (FORMAT csv, HEADER true);