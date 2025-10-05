#!/bin/bash
echo "Starting Netlify build process..."

# Navigate to chess-frontend directory
cd chess-frontend

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the React app
echo "Building React app..."
npm run build

# Go back to root
cd ..

# Create public directory if it doesn't exist
echo "Creating public directory..."
mkdir -p public

# Copy built files to public directory
echo "Copying files to public directory..."
cp -r chess-frontend/public/* public/

# List contents of public directory
echo "Contents of public directory:"
ls -la public/

echo "Build process completed!"