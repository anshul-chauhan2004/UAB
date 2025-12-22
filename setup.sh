#!/bin/bash

# UAB Institute Management System - Setup Script

echo "🎓 UAB Institute Management System - Setup"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed or not in PATH"
    echo "   Please install MongoDB: brew install mongodb-community"
else
    echo "✅ MongoDB is installed"
fi
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Root dependencies installed successfully"
else
    echo "❌ Failed to install root dependencies"
    exit 1
fi
echo ""

# Install client dependencies
echo "📦 Installing React client dependencies..."
cd client
npm install

if [ $? -eq 0 ]; then
    echo "✅ Client dependencies installed successfully"
    cd ..
else
    echo "❌ Failed to install client dependencies"
    exit 1
fi
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
else
    echo "✅ .env file already exists"
fi
echo ""

# Check if MongoDB is running
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running"
else
    echo "⚠️  MongoDB is not running"
    echo "   Start it with: brew services start mongodb-community"
    echo "   Or run: mongod --dbpath /usr/local/var/mongodb"
fi
echo ""

echo "=========================================="
echo "🎉 Setup Complete!"
echo ""
echo "To start the application:"
echo "  npm run dev         - Run both frontend and backend"
echo "  npm run server      - Run backend only"
echo "  npm run client      - Run frontend only"
echo ""
echo "Access the application:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
echo ""
echo "Don't forget to:"
echo "  1. Update .env with your MongoDB URI and JWT secret"
echo "  2. Make sure MongoDB is running"
echo "=========================================="
