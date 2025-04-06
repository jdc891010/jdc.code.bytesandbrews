CREATE TABLE occupations (
    occupation_id INTEGER PRIMARY KEY,
    category VARCHAR NOT NULL,
    role VARCHAR NOT NULL,
    UNIQUE(category, role)
);