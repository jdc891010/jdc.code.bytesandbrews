#!/bin/bash

# Start the application with PM2
# We use 'npm run start' to ensure all environment variables defined in package.json are loaded

# Delete existing process if it exists to allow for restart/update
pm2 delete brews-and-bytes 2>/dev/null || true

# Start the process
pm2 start npm --name "brews-and-bytes" -- run start

# Save the PM2 list so it restarts on reboot
pm2 save

echo "Application started with PM2."
