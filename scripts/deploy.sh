#!/bin/bash

# Brews and Bytes - Cloudways Deployment Script
# This script pulls the latest code, builds the production bundle, and starts/restarts the app with PM2.

APP_NAME="brews-and-bytes"
WEBSITE_DIR="website"

echo "------------------------------------------------"
echo "🚀 Brews & Bytes: Deployment"
echo "------------------------------------------------"

# 1. Pull latest changes
if [ -d ".git" ]; then
    echo "📥 Pulling latest changes from git..."
    git pull origin main
else
    echo "ℹ️  Not a git repository, skipping git pull."
fi

# 2. Build the application
if [ -d "$WEBSITE_DIR" ]; then
    echo "🏗️  Building production bundle in $WEBSITE_DIR..."
    cd $WEBSITE_DIR
    
    # Ensure dependencies are up to date
    npm install --no-audit
    
    # Run the build process
    echo "⚒️  Running build command..."
    npm run build
    
    if [ $? -ne 0 ]; then
        echo "❌ Build failed! Aborting deployment."
        exit 1
    fi
    
    # 3. Handle PM2 Process
    echo "🚀 Managing PM2 process: $APP_NAME..."
    
    # Check if the app is already running under PM2
    if pm2 show $APP_NAME > /dev/null 2>&1; then
        echo "🔄 App is already running. Reloading to apply changes..."
        pm2 reload $APP_NAME
    else
        echo "🆕 Starting new PM2 process..."
        # We start the bundled server file. In this project, it's dist/index.js
        # We set NODE_ENV to production explicitly
        NODE_ENV=production pm2 start dist/index.js --name "$APP_NAME"
    fi
    
    # Make sure PM2 saves the state to restart on server reboot
    pm2 save
    
    echo "------------------------------------------------"
    echo "🎉 Deployment Successful!"
    echo "📡 App is live and managed by PM2."
    echo "📊 Use 'pm2 status' to view process info."
    echo "------------------------------------------------"
    cd ..
else
    echo "❌ Error: '$WEBSITE_DIR' directory not found!"
    exit 1
fi
