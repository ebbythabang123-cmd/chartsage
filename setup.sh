#!/bin/bash

echo "🚀 Setting up AI Trading Assistant..."

# Create uploads directory
mkdir -p uploads

# Copy .env file
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created .env file - please update with your configuration"
else
  echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your OpenAI API key and MongoDB URI"
echo "2. Start MongoDB: mongod"
echo "3. Run the server: npm run dev"
echo ""
echo "Server will be available at http://localhost:5000"
