# 🤖 AI Trading Assistant - ChartSage

A comprehensive AI-powered trading assistant that provides technical analysis, market insights, and AI-driven chart image analysis with instant trading recommendations.

## 🌟 Features

### 1. **AI Chart Image Analysis (AI Entries)**
- Upload trading chart screenshots for instant analysis
- Extracts critical trading information:
  - **Bias**: BULLISH, BEARISH, or NEUTRAL (with strength score 0-100)
  - **Entry Zone**: Optimal entry prices with probability
  - **Targets**: Multiple profit targets ranked by importance
  - **Risk Levels**: Stop loss, trendline support, key support
  - **Risk/Reward Ratio**: Calculated ratio with profit potential
  - **Technical Indicators**: RSI, MACD, Bollinger Bands, Moving Averages
  - **Market Condition**: Trending, ranging, consolidating, or breakout
  - **Confidence Score**: Analysis confidence (0-100%)

### 2. **Technical Analysis**
- Analyze any trading symbol on multiple timeframes
- Real-time trend identification
- Support and resistance level detection
- Entry point recommendations
- Profit targets and stop loss calculations
- Compare multiple assets for relative strength

### 3. **Market Insights**
- Real-time market sentiment analysis
- Top performing and declining assets
- Sector-specific analysis
- Key support and resistance areas
- Trading opportunities identification
- Risk factor analysis
- Chart pattern analysis

### 4. **Risk Management**
- Position sizing recommendations
- Risk/Reward calculations
- Portfolio allocation advice
- Best practices for risk management

## 📋 Prerequisites

- Node.js (v14+)
- MongoDB
- OpenAI API Key (GPT-4 and Vision API access)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ebbythabang123-cmd/chartsage.git
   cd chartsage
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```
   OPENAI_API_KEY=your_openai_api_key
   MONGODB_URI=mongodb://localhost:27017/chartsage
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Linux
   sudo service mongod start
   ```

5. **Run the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

Server will run on http://localhost:5000

## 📚 API Endpoints

### Authentication

**Register User**
```
POST /api/auth/register
Body: { "username": "string", "email": "string", "password": "string" }
```

**Login**
```
POST /api/auth/login
Body: { "email": "string", "password": "string" }
Response: { "token": "jwt_token", "user": {...} }
```

**Get Current User**
```
GET /api/auth/me
Headers: { "Authorization": "Bearer {token}" }
```

**Update Profile**
```
PUT /api/auth/profile
Headers: { "Authorization": "Bearer {token}" }
Body: { 
  "experience": "beginner|intermediate|advanced",
  "riskTolerance": "low|medium|high",
  "preferredAssets": ["BTC", "ETH"],
  "preferredTimeframes": ["1H", "4H", "1D"]
}
```

### AI Chart Analysis (AI Entries)

**Upload & Analyze Chart**
```
POST /api/ai-entries/analyze
Headers: { "Authorization": "Bearer {token}" }
Body: FormData with file field "chart" (image file)

Response:
{
  "success": true,
  "analysisId": "string",
  "analysis": {
    "bias": { "direction": "BULLISH", "strength": 85 },
    "entryZone": { "minPrice": 45000, "maxPrice": 46000, "probability": 75 },
    "targets": [
      { "price": 48000, "importance": "high", "potentialReturn": "4.35%" },
      { "price": 50000, "importance": "medium", "potentialReturn": "8.7%" }
    ],
    "riskLevels": { "stopLoss": 43000, "riskPercentage": 2 },
    "riskRewardRatio": { "ratio": "1:2.5", "description": "Excellent", "profitPotential": "8.7%" },
    "technicalIndicators": { /* ... */ },
    "confidenceScore": 88
  },
  "tradingDecision": { "action": "BUY", "reasoning": "...", "timeHorizon": "short-term" }
}
```

**Get Analysis History**
```
GET /api/ai-entries/history
Headers: { "Authorization": "Bearer {token}" }
```

**Get Specific Analysis**
```
GET /api/ai-entries/:id
Headers: { "Authorization": "Bearer {token}" }
```

**Delete Analysis**
```
DELETE /api/ai-entries/:id
Headers: { "Authorization": "Bearer {token}" }
```

**Get Statistics**
```
GET /api/ai-entries/stats/summary
Headers: { "Authorization": "Bearer {token}" }
```

### Technical Analysis

**Analyze Symbol**
```
POST /api/technical-analysis/analyze
Headers: { "Authorization": "Bearer {token}" }
Body: { "symbol": "BTC", "timeframe": "1D" }

Response:
{
  "success": true,
  "analysis": {
    "symbol": "BTC",
    "currentPrice": 45500,
    "trend": "uptrend",
    "support": [44000, 43000],
    "resistance": [48000, 50000],
    "entryPoints": [...],
    "targets": [48000, 50000, 52000],
    "riskRewardRatio": "1:2.5",
    "recommendation": "BUY"
  }
}
```

**Compare Assets**
```
POST /api/technical-analysis/compare
Headers: { "Authorization": "Bearer {token}" }
Body: { "assets": ["BTC", "ETH", "SOL"], "timeframe": "1H" }
```

### Market Insights

**Get Market Insights**
```
GET /api/market-insights
Headers: { "Authorization": "Bearer {token}" }

Response:
{
  "success": true,
  "insights": {
    "marketSentiment": "bullish",
    "topPerformers": [...],
    "volatility": "medium",
    "tradingOpportunities": [...]
  }
}
```

**Analyze Patterns**
```
POST /api/market-insights/patterns
Headers: { "Authorization": "Bearer {token}" }
Body: { "patterns": ["Head and Shoulders", "Double Top"] }
```

**Get Risk Management Advice**
```
POST /api/market-insights/risk-management
Headers: { "Authorization": "Bearer {token}" }
Body: { "capital": 10000, "riskPercentage": 2 }
```

## 💾 Database Schema

### User
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  tradingProfile: {
    experience: "beginner|intermediate|advanced",
    riskTolerance: "low|medium|high",
    preferredAssets: [String],
    preferredTimeframes: [String]
  },
  analysisStats: {
    totalAnalyses: Number,
    successfulTrades: Number,
    winRate: Number,
    averageRiskReward: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### AnalysisResult
```javascript
{
  userId: ObjectId,
  analysisType: "chart_image|technical_symbol|market_insight",
  input: { symbol, timeframe, chartImageUrl },
  analysis: { /* analysis details */ },
  tradingDecision: { action, reasoning, timeHorizon },
  result: { successful, exitPrice, profitLoss },
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes with middleware
- Environment variable configuration
- File upload validation

## 📊 Example Usage

### Complete Flow: Upload Chart and Trade

1. **Register/Login**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username": "trader1", "email": "trader@example.com", "password": "securepass"}'
   ```

2. **Upload Chart for Analysis**
   ```bash
   curl -X POST http://localhost:5000/api/ai-entries/analyze \
     -H "Authorization: Bearer {token}" \
     -F "chart=@/path/to/chart.jpg"
   ```

3. **Execute Trade and Record Result**
   ```bash
   curl -X PUT http://localhost:5000/api/chart-analysis/{analysisId}/result \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     -d '{
       "exitPrice": 46500,
       "profitLoss": 1500,
       "successful": true,
       "resultNotes": "Traded perfectly"
     }'
   ```

## 🛠️ Development

### Project Structure
```
chartsage/
├── server.js                    # Main server file
├── package.json                # Dependencies
├── .env.example                # Environment template
├── models/
│   ├── User.js
│   └── AnalysisResult.js
├── services/
│   ├── aiAnalysisService.js
│   ├── technicalAnalysisService.js
│   └── marketInsightsService.js
├── routes/
│   ├── auth.js
│   ├── aiEntries.js
│   ├── technicalAnalysis.js
│   ├── marketInsights.js
│   └── chartAnalysis.js
├── middleware/
│   └── auth.js
└── uploads/                    # Uploaded chart images
```

### Testing

Use Postman or curl to test endpoints. Sample requests provided in API_EXAMPLES.js

## 🐛 Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env

**OpenAI API Error**
- Verify API key is correct and has GPT-4 Vision access
- Check API usage limits

**File Upload Issues**
- Ensure uploads directory exists and is writable
- Check MAX_FILE_SIZE setting

## 📄 License

MIT License

## 👤 Author

Ebby Thabang LEKGOTHOANE

## 🤝 Contributing

Contributions are welcome! Please fork and create a pull request.

## 📞 Support

For issues and questions, please create an issue on the GitHub repository.
