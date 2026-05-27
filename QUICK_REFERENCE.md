# ChartSage Quick Reference

## 🚀 Start in 60 Seconds

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
# Edit .env with your OpenAI API key

# 3. Run
npm run dev

# 4. Visit http://localhost:5000/api/health ✅
```

## 🔐 Authentication Flow

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"trader1","email":"trader@example.com","password":"pass123"}'
```

**Response:** `{"token":"eyJ...","user":{...}}`

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"trader@example.com","password":"pass123"}'
```

**Save the token for all authenticated requests:**
```bash
TOKEN="your-jwt-token-here"
```

## 📊 API Endpoints Quick Reference

### AI Chart Analysis
```bash
# Upload chart image
curl -X POST http://localhost:5000/api/ai-entries/analyze \
  -H "Authorization: Bearer $TOKEN" \
  -F "chart=@chart.jpg"

# Get analysis history
curl -X GET http://localhost:5000/api/ai-entries/history \
  -H "Authorization: Bearer $TOKEN"

# Get statistics
curl -X GET http://localhost:5000/api/ai-entries/stats/summary \
  -H "Authorization: Bearer $TOKEN"
```

### Technical Analysis
```bash
# Analyze symbol
curl -X POST http://localhost:5000/api/technical-analysis/analyze \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"symbol":"BTC","timeframe":"1D"}'

# Compare assets
curl -X POST http://localhost:5000/api/technical-analysis/compare \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"assets":["BTC","ETH","SOL"],"timeframe":"4H"}'
```

### Market Insights
```bash
# Get insights
curl -X GET http://localhost:5000/api/market-insights \
  -H "Authorization: Bearer $TOKEN"

# Analyze patterns
curl -X POST http://localhost:5000/api/market-insights/patterns \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"patterns":["Head and Shoulders","Double Top"]}'

# Get risk management advice
curl -X POST http://localhost:5000/api/market-insights/risk-management \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"capital":10000,"riskPercentage":2}'
```

### Update Trade Result
```bash
curl -X PUT http://localhost:5000/api/chart-analysis/ANALYSIS_ID/result \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "exitPrice":46500,
    "profitLoss":1500,
    "successful":true,
    "resultNotes":"Trade executed perfectly"
  }'
```

## 🗂️ Project Structure

```
chartsage/
├── server.js              # Main app
├── models/                # Database schemas
│   ├── User.js
│   └── AnalysisResult.js
├── routes/                # API endpoints
│   ├── auth.js
│   ├── aiEntries.js
│   ├── technicalAnalysis.js
│   ├── marketInsights.js
│   └── chartAnalysis.js
├── services/              # Business logic
│   ├── aiAnalysisService.js
│   ├── technicalAnalysisService.js
│   └── marketInsightsService.js
├── middleware/
│   └── auth.js           # JWT verification
├── uploads/              # Chart images
├── package.json
├── .env                  # Your secrets
└── Dockerfile
```

## 📦 Environment Variables

```env
# Required
OPENAI_API_KEY=sk-your-key-here
MONGODB_URI=mongodb://localhost:27017/chartsage
JWT_SECRET=your-secret-key-here

# Optional
PORT=5000
NODE_ENV=development
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800
```

## 🐳 Docker Quick Start

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f chartsage
```

## 🧪 Common Test Flows

### Flow 1: Register → Analyze Chart → Get Stats
```bash
# 1. Register
REGISTER=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"trader1","email":"trader@example.com","password":"pass123"}')
TOKEN=$(echo $REGISTER | jq -r '.token')

# 2. Analyze chart
curl -X POST http://localhost:5000/api/ai-entries/analyze \
  -H "Authorization: Bearer $TOKEN" \
  -F "chart=@chart.jpg"

# 3. Get stats
curl -X GET http://localhost:5000/api/ai-entries/stats/summary \
  -H "Authorization: Bearer $TOKEN"
```

### Flow 2: Analyze Symbol → Compare Assets → Get Insights
```bash
# 1. Analyze BTC
curl -X POST http://localhost:5000/api/technical-analysis/analyze \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"symbol":"BTC","timeframe":"1D"}'

# 2. Compare multiple assets
curl -X POST http://localhost:5000/api/technical-analysis/compare \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"assets":["BTC","ETH","SOL"],"timeframe":"1D"}'

# 3. Get market insights
curl -X GET http://localhost:5000/api/market-insights \
  -H "Authorization: Bearer $TOKEN"
```

## 🔍 Response Examples

### Chart Analysis Response
```json
{
  "success": true,
  "analysisId": "507f1f77bcf86cd799439011",
  "analysis": {
    "bias": {
      "direction": "BULLISH",
      "strength": 85
    },
    "entryZone": {
      "minPrice": 45000,
      "maxPrice": 46000,
      "probability": 75
    },
    "targets": [
      {
        "price": 48000,
        "importance": "high",
        "potentialReturn": "4.35%"
      }
    ],
    "riskLevels": {
      "stopLoss": 43000,
      "riskPercentage": 2
    },
    "riskRewardRatio": {
      "ratio": "1:2.5",
      "description": "Excellent",
      "profitPotential": "8.7%"
    },
    "technicalIndicators": {
      "rsi": 65,
      "macd": {...},
      "bollingerBands": {...},
      "movingAverages": {...}
    },
    "marketCondition": "trending",
    "confidenceScore": 88
  },
  "tradingDecision": {
    "action": "BUY",
    "reasoning": "Strong bullish bias with good entry zone",
    "timeHorizon": "short-term",
    "confidence": 88
  }
}
```

### Stats Response
```json
{
  "success": true,
  "stats": {
    "totalAnalyses": 42,
    "successfulTrades": 28,
    "winRate": "66.67%",
    "averageRiskReward": "2.5",
    "analysissByType": {
      "chart_image": 20,
      "technical_symbol": 15,
      "market_insight": 7
    }
  }
}
```

## 🐛 Troubleshooting

### Connection Refused (MongoDB)
```bash
# Start MongoDB
mongod

# Or with Docker
docker-compose up -d mongodb
```

### Invalid Token
```bash
# Check token hasn't expired (7 days)
# Re-login to get new token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"trader@example.com","password":"pass123"}'
```

### Port Already in Use
```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=3000 npm run dev
```

### OpenAI API Error
```bash
# Check .env file
grep OPENAI_API_KEY .env

# Ensure API key is valid and GPT-4 Vision is enabled
# https://platform.openai.com/account/api-keys
```

## 📚 More Info

- 📖 Full setup: See [SETUP.md](SETUP.md)
- 🔒 Security: See [SECURITY.md](SECURITY.md)
- 🤝 Contributing: See [CONTRIBUTING.md](CONTRIBUTING.md)
- 📋 API Docs: See [API_EXAMPLES.json](API_EXAMPLES.json)
- 📝 Changelog: See [CHANGELOG.md](CHANGELOG.md)
- 🎯 Project Summary: See [COMPLETION_SUMMARY.md](COMPLETION_SUMMARY.md)

## 🚀 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Configure .env with your API keys
3. ✅ Start MongoDB: `mongod`
4. ✅ Run server: `npm run dev`
5. ✅ Test endpoints with curl or Postman
6. ✅ Build your trading bot!

## 💡 Tips

- Use Postman for easier API testing
- Keep your JWT token saved in a variable
- Test with sample chart images first
- Monitor your OpenAI API usage
- Check logs for debugging: `npm run dev`

## 📞 Support

- 🐛 Issues: [GitHub Issues](https://github.com/ebbythabang123-cmd/chartsage/issues)
- 📧 Email: ebbythabang123@gmail.com
- 💬 Discussions: Coming soon!

---

**Happy Trading! 📈**
