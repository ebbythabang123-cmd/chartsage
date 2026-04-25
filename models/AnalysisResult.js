const mongoose = require('mongoose');

const analysisResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  analysisType: {
    type: String,
    enum: ['chart_image', 'technical_symbol', 'market_insight'],
    required: true
  },
  input: {
    symbol: String,
    timeframe: String,
    chartImageUrl: String,
    imageBase64: String
  },
  analysis: {
    bias: {
      direction: { type: String, enum: ['BULLISH', 'BEARISH', 'NEUTRAL'] },
      strength: { type: Number, min: 0, max: 100 }
    },
    entryZone: {
      minPrice: Number,
      maxPrice: Number,
      probability: { type: Number, min: 0, max: 100 }
    },
    targets: [{
      price: Number,
      importance: { type: String, enum: ['high', 'medium', 'low'] },
      potentialReturn: String
    }],
    riskLevels: {
      stopLoss: Number,
      trendlineSupport: Number,
      keySupport: Number,
      riskPercentage: Number
    },
    riskRewardRatio: {
      ratio: String,
      description: String,
      profitPotential: String
    },
    technicalIndicators: {
      rsi: { value: Number, status: String },
      macd: { value: Number, signal: String },
      bollingerBands: { upper: Number, lower: Number, middle: Number },
      movingAverages: {
        ma20: Number,
        ma50: Number,
        ma200: Number
      }
    },
    marketCondition: {
      type: String,
      enum: ['trending', 'ranging', 'consolidating', 'breakout']
    },
    confidenceScore: { type: Number, min: 0, max: 100 },
    recommendations: [String],
    keyLevels: {
      resistance: [Number],
      support: [Number]
    }
  },
  tradingDecision: {
    action: { type: String, enum: ['BUY', 'SELL', 'HOLD', 'WAIT'] },
    reasoning: String,
    timeHorizon: String
  },
  result: {
    successful: Boolean,
    exitPrice: Number,
    profitLoss: Number,
    profitLossPercentage: Number,
    resultNotes: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AnalysisResult', analysisResultSchema);
