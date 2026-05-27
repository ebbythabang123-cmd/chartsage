#!/bin/bash

# ChartSage Setup Script

echo "🚀 ChartSage AI Trading Assistant - Setup"
echo "=========================================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install from https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js found: $(node --version)"

# Check MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found. Install from https://www.mongodb.com/"
else
    echo "✅ MongoDB found"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your API keys"
else
    echo "✅ .env file already exists"
fi

# Create uploads directory
mkdir -p uploads
echo "✅ Created uploads directory"

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env with your OpenAI API key and MongoDB URI"
echo "2. Start MongoDB: mongod"
echo "3. Run: npm run dev"
echo ""
echo "Server will run at http://localhost:5000"
