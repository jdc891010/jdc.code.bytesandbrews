#!/bin/bash

# Start the application with PM2
# We use 'npm run start' to ensure all environment variables defined in package.json are loaded

# Navigate to the website directory
cd "$(dirname "$0")/../website" || exit

# Check if build exists, if not, build it
if [ ! -d "dist" ]; then
    echo "Build directory not found. Installing dependencies and building..."
    npm install
    npm run build
fi

# Delete existing process if it exists to allow for restart/update
pm2 delete brews-and-bytes 2>/dev/null || true

# Start the process
# npm run start uses: NODE_ENV=production node dist/index.js
pm2 start npm --name "brews-and-bytes" -- run start

# Save the PM2 list so it restarts on reboot
pm2 save

echo "Application started with PM2."
