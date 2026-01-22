#!/bin/bash

# Brews and Bytes - Cloudways Installation Script
# This script prepares the environment by installing global tools and project dependencies.

echo "------------------------------------------------"
echo "🚀 Brews & Bytes: System Setup"
echo "------------------------------------------------"

# 1. Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please enable Node.js in your Cloudways Application Settings."
    exit 1
fi

echo "✅ Node version: $(node -v)"
echo "✅ NPM version: $(npm -v)"

# 2. Install PM2 globally
# On Cloudways, you might need to ensure your npm global bin is in PATH
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2 globally for process persistence..."
    npm install -g pm2
    
    # Add to path for the current session if installed in common location
    export PATH=$PATH:$(npm config get prefix)/bin
else
    echo "✅ PM2 is already installed: $(pm2 -v)"
fi

# 3. Install Root dependencies
echo "📦 Installing root dependencies..."
npm install --no-audit

# 4. Install Website dependencies
if [ -d "website" ]; then
    echo "📦 Installing website dependencies..."
    cd website
    npm install --no-audit
    
    # Check for .env file
    if [ ! -f ".env" ]; then
        echo "⚠️  Warning: .env file not found in website directory."
        if [ -f ".env.example" ]; then
            echo "📝 Creating .env from .env.example..."
            cp .env.example .env
            echo "👉 Please edit website/.env with your production credentials."
        fi
    fi
    cd ..
else
    echo "❌ Error: 'website' directory not found!"
    exit 1
fi

echo "------------------------------------------------"
echo "✅ Setup Complete!"
echo "Next step: Run 'bash scripts/deploy.sh' to build and launch."
echo "------------------------------------------------"
