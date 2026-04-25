const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getMarketInsights = async () => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a senior market analyst providing current market insights and trends as of April 2026.'
        },
        {
          role: 'user',
          content: `Provide current market insights in JSON format:
          {
            "marketSentiment": "bullish/bearish/neutral",
            "sentimentStrength": 0-100,
            "topPerformers": [
              {
                "asset": "symbol",
                "return": "percentage",
                "reason": "why it's performing well"
              }
            ],
            "topLosers": [
              {
                "asset": "symbol",
                "return": "percentage",
                "reason": "why it's declining"
              }
            ],
            "sectorAnalysis": {
              "sector": "description of sector performance"
            },
            "volatility": "high/medium/low",
            "keyLevels": {
              "support": "description",
              "resistance": "description"
            },
            "tradingOpportunities": [
              {
                "asset": "symbol",
                "opportunity": "description",
                "action": "BUY/SELL/WAIT"
              }
            ],
            "risks": ["risk 1", "risk 2", "risk 3"],
            "catalysts": ["upcoming catalyst 1", "upcoming catalyst 2"],
            "recommendations": ["recommendation 1", "recommendation 2"]
          }`
        }
      ]
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in insights response');
    }

    return {
      success: true,
      insights: JSON.parse(jsonMatch[0])
    };
  } catch (error) {
    console.error('Error getting market insights:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const analyzePatterns = async (patterns) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in chart patterns and technical analysis.'
        },
        {
          role: 'user',
          content: `Analyze these trading patterns: ${patterns.join(', ')}. 
          Provide analysis in JSON format:
          {
            "patterns": [
              {
                "name": "pattern name",
                "reliability": 0-100,
                "breakoutDirection": "up/down",
                "tradingStrategy": "description",
                "targets": [number, number],
                "stopLoss": number
              }
            ],
            "opportunities": ["opportunity 1", "opportunity 2"],
            "riskFactors": ["risk 1", "risk 2"]
          }`
        }
      ]
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in pattern analysis response');
    }

    return {
      success: true,
      analysis: JSON.parse(jsonMatch[0])
    };
  } catch (error) {
    console.error('Error analyzing patterns:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const getRiskManagement = async (capital, riskPercentage) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional risk management consultant for traders.'
        },
        {
          role: 'user',
          content: `Provide risk management advice for a trader with capital of ${capital} and risk tolerance of ${riskPercentage}% per trade.
          Provide advice in JSON format:
          {
            "capital": ${capital},
            "riskPercentage": ${riskPercentage},
            "maxRiskPerTrade": number,
            "positionSizing": "description",
            "stopLossRules": ["rule 1", "rule 2"],
            "profitTakingStrategy": "description",
            "portfolioAllocation": "description",
            "recommendations": ["rec 1", "rec 2"],
            "bestPractices": ["practice 1", "practice 2"]
          }`
        }
      ]
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in risk management response');
    }

    return {
      success: true,
      riskManagement: JSON.parse(jsonMatch[0])
    };
  } catch (error) {
    console.error('Error getting risk management advice:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  getMarketInsights,
  analyzePatterns,
  getRiskManagement
};
