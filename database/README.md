# Database Setup for Brews & Bytes

This directory contains the necessary SQL scripts and mock data to set up a local PostgreSQL database for development.

## Files Included

### Schema 1: Application Schema (brews_and_bytes_ddl.sql)
This schema matches the data models defined in the application's shared/schema.ts file.

Tables:
- `users` - User accounts with username and password
- `contacts` - Contact form submissions
- `signups` - Signup/waitlist form submissions
- `subscribers` - Newsletter subscribers
- `coffee_shops` - Coffee shop information (for future implementation)

### Schema 2: Heatmap Schema (ddl.sql)
This schema is designed for the heatmap and place review features.

Tables:
- `places` - Coffee shop locations with detailed information
- `tribes` - User categories/communities
- `place_tribes` - Mapping between places and tribes
- `reviews` - User reviews for places
- `metrics` - Types of metrics (speed, vibe, parking, noise)
- `metric_details` - Summary values for each metric and place
- `heatmap_data` - Detailed heatmap data by day/hour

## Setup Instructions

### For Application Schema:
1. Make sure you have PostgreSQL installed and running on your local machine.

2. Create a new database:
   ```bash
   createdb brews_and_bytes_dev
   ```

3. Apply the schema:
   ```bash
   psql -d brews_and_bytes_dev -f database/brews_and_bytes_ddl.sql
   ```

4. Load the mock data:
   ```bash
   psql -d brews_and_bytes_dev -f database/load_mock_data.sql
   ```

### For Heatmap Schema:
1. Make sure you have PostgreSQL installed and running on your local machine.

2. Create a new database:
   ```bash
   createdb brews_and_bytes_heatmap_dev
   ```

3. Apply the schema:
   ```bash
   psql -d brews_and_bytes_heatmap_dev -f database/ddl.sql
   ```

4. Load the mock data:
   ```bash
   psql -d brews_and_bytes_heatmap_dev -f database/load_mock_data_existing_schema.sql
   ```

## Docker Setup

This directory also includes Docker Compose files for easy setup:

### Using Docker Compose (Heatmap Schema Only):
```bash
cd database
docker-compose up -d
```

Or for the simple version without custom networks:
```bash
cd database
docker-compose -f docker-compose-simple.yml up -d
```

This will start:
- PostgreSQL database (port 5432) with heatmap schema and mock data
- Adminer web interface (port 8080) for database management

### Using Docker Compose (Application Schema Only):
```bash
cd database
docker-compose -f docker-compose-app.yml up -d
```

Or for the simple version without custom networks:
```bash
cd database
docker-compose -f docker-compose-app-simple.yml up -d
```

This will start:
- PostgreSQL database (port 5433) with application schema and mock data
- Adminer web interface (port 8081) for database management

### Using Docker Compose (Both Schemas):
```bash
cd database
docker-compose -f docker-compose-full.yml up -d
```

Or for the simple version without custom networks:
```bash
cd database
docker-compose -f docker-compose-full-simple.yml up -d
```

This will start:
- PostgreSQL database with heatmap schema (port 5432)
- PostgreSQL database with application schema (port 5433)
- Adminer for heatmap database (port 8080)
- Adminer for application database (port 8081)

To stop the services:
```bash
docker-compose down
# or
docker-compose -f docker-compose-app.yml down
# or
docker-compose -f docker-compose-full.yml down
```

Or for the simple versions:
```bash
docker-compose -f docker-compose-simple.yml down
# or
docker-compose -f docker-compose-app-simple.yml down
# or
docker-compose -f docker-compose-full-simple.yml down
```

## Automated Setup Scripts

For even easier setup, you can use the provided automation scripts:

### On Windows:
```cmd
cd database
setup-database.bat [heatmap|app|both|stop|status|logs]
```

### On Linux/macOS:
```bash
cd database
./setup-database.sh [heatmap|app|both|stop|status|logs]
```

### Script Options:
- `heatmap` - Start heatmap database only (port 5432)
- `app` - Start application database only (port 5433)
- `both` - Start both databases (default)
- `stop` - Stop all containers
- `status` - Show container status
- `logs` - Show container logs

The scripts will automatically:
1. Check if Docker is installed
2. Verify you're in the correct directory
3. Stop any existing containers
4. Start the requested database containers
5. Wait for databases to be ready
6. Show connection information

## Mock Data

### For Application Schema:
- 5 sample users
- 5 contact form submissions
- 10 signup submissions
- 15 newsletter subscribers
- 10 coffee shops with varying WiFi speeds and locations

### For Heatmap Schema:
- 10 coffee shop places with detailed information
- 10 user tribes
- 30 place-tribe mappings
- 20 user reviews
- 4 metric types
- 40 metric details entries
- 42 heatmap data points

All timestamps are set to May-June 2023 for consistency.