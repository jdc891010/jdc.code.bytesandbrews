#!/bin/bash

# Navigate to website directory
cd website || exit

# Install dependencies
npm install

# Build the project (client and server)
npm run build

echo "Installation and build complete."
