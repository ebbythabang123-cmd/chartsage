# 🚀 ChartSage - Complete Setup Guide

This guide will help you get ChartSage AI Trading Assistant up and running.

## Prerequisites

- **Node.js** v14+ ([Download](https://nodejs.org/))
- **MongoDB** ([Download](https://www.mongodb.com/try/download/community))
- **OpenAI API Key** with GPT-4 Vision access ([Get Key](https://platform.openai.com/api-keys))

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/ebbythabang123-cmd/chartsage.git
cd chartsage
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-actual-key-here

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/chartsage

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server Configuration
PORT=5000
NODE_ENV=development

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800
```

### 3. Start MongoDB

**macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo service mongod start
```

**Windows:**
```bash
net start MongoDB
```

### 4. Run the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

✅ Server running at: `http://localhost:5000`

## Testing the API

### 1. Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "trader1",
    "email": "trader@example.com",
    "password": "securepass123"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "username": "trader1",
    "email": "trader@example.com",
    "tradingProfile": {...}
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "trader@example.com",
    "password": "securepass123"
  }'
```

### 3. Update Trading Profile

```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "experience": "intermediate",
    "riskTolerance": "medium",
    "preferredAssets": ["BTC", "ETH", "SOL"],
    "preferredTimeframes": ["1H", "4H", "1D"]
  }'
```

### 4. Analyze Chart Image

```bash
curl -X POST http://localhost:5000/api/ai-entries/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "chart=@/path/to/chart.jpg"
```

### 5. Analyze Symbol

```bash
curl -X POST http://localhost:5000/api/technical-analysis/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "BTC",
    "timeframe": "1D"
  }'
```

### 6. Compare Assets

```bash
curl -X POST http://localhost:5000/api/technical-analysis/compare \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "assets": ["BTC", "ETH", "SOL"],
    "timeframe": "4H"
  }'
```

### 7. Get Market Insights

```bash
curl -X GET http://localhost:5000/api/market-insights \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 8. Get Your Statistics

```bash
curl -X GET http://localhost:5000/api/ai-entries/stats/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 9. View Analysis History

```bash
curl -X GET http://localhost:5000/api/ai-entries/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Project Structure

```
chartsage/
├── server.js                      # Main Express server
├── package.json                   # Dependencies
├── .env.example                   # Environment template
├── .env                           # Your local config (git ignored)
├── models/
│   ├── User.js                   # User schema with auth
│   └── AnalysisResult.js         # Analysis data schema
├── routes/
│   ├── auth.js                   # Authentication endpoints
│   ├── aiEntries.js              # AI chart analysis endpoints
│   ├── technicalAnalysis.js      # Technical analysis endpoints
│   ├── marketInsights.js         # Market insights endpoints
│   └── chartAnalysis.js          # Chart result tracking
├── services/
│   ├── aiAnalysisService.js      # OpenAI Vision analysis
│   ├── technicalAnalysisService.js
│   └── marketInsightsService.js
├── middleware/
│   └── auth.js                   # JWT authentication
├── uploads/                       # Chart image storage
└── setup.sh                       # Setup script
```

## Features Overview

### 🤖 AI Chart Analysis
- Upload trading chart images
- Get instant technical analysis
- Receive trading recommendations
- Track confidence scores

### 📊 Technical Analysis
- Analyze any symbol
- Multiple timeframe support
- Support/Resistance detection
- Entry points & targets

### 📈 Market Insights
- Real-time market sentiment
- Trading opportunities
- Pattern analysis
- Risk management advice

### 👤 User Management
- Secure registration/login
- Trading profile customization
- Statistics tracking
- Analysis history

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running: `mongod` or check your MONGODB_URI

### OpenAI API Error
```
Error: Invalid API key
```
**Solution:** Verify your OPENAI_API_KEY is correct and has GPT-4 Vision access

### File Upload Error
```
Error: ENOENT: no such file or directory, open './uploads/...
```
**Solution:** Create uploads folder: `mkdir uploads`

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:** Change PORT in .env or kill process: `lsof -ti:5000 | xargs kill -9`

## Development Commands

```bash
# Start with auto-reload
npm run dev

# Start production
npm start

# Run tests
npm test
```

## Security Notes

✅ **Passwords** are hashed with bcryptjs  
✅ **JWT tokens** expire in 7 days  
✅ **File uploads** validated by type  
✅ **Protected routes** require authentication  
✅ **CORS** enabled for cross-origin requests  

## API Response Format

All successful responses:
```json
{
  "success": true,
  "data": {...}
}
```

Error responses:
```json
{
  "error": "Error message"
}
```

## Next Steps

1. ✅ Set up environment variables
2. ✅ Start MongoDB
3. ✅ Run `npm install && npm run dev`
4. ✅ Test endpoints with curl or Postman
5. ✅ Build your trading bot on top!

## Support & Contributing

For issues: [GitHub Issues](https://github.com/ebbythabang123-cmd/chartsage/issues)  
Contributions welcome! Fork and submit PRs.

## License

MIT © 2024
