-- Script to load mock data into the database
-- Run this after creating the tables with brews_and_bytes_ddl.sql

-- Load users data
\copy users(id, username, password) FROM 'database/mock_users.csv' WITH (FORMAT csv, HEADER true);

-- Load contacts data
\copy contacts(id, name, email, subject, message, created_at) FROM 'database/mock_contacts.csv' WITH (FORMAT csv, HEADER true);

-- Load signups data
\copy signups(id, name, email, city, tribe, created_at) FROM 'database/mock_signups.csv' WITH (FORMAT csv, HEADER true);

-- Load subscribers data
\copy subscribers(id, email, created_at) FROM 'database/mock_subscribers.csv' WITH (FORMAT csv, HEADER true);

-- Load coffee shops data
\copy coffee_shops(id, name, description, address, city, country, wifi_speed, created_at, updated_at) FROM 'database/mock_coffee_shops.csv' WITH (FORMAT csv, HEADER true);