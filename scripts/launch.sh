#!/bin/bash

# Navigate to website directory
cd website || exit

# Start the application using the start script defined in package.json
# This runs on PORT 5001 by default as per server/index.ts
npm start
