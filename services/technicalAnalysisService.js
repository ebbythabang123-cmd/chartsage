const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const analyzeSymbol = async (symbol, timeframe = '1D') => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a professional technical analyst with 20+ years of trading experience. 
          Provide detailed technical analysis using real market concepts and realistic price levels.
          Always think about current market conditions as of 2026.`
        },
        {
          role: 'user',
          content: `Perform a comprehensive technical analysis for ${symbol} on ${timeframe} timeframe. 
          Provide response in JSON format:
          {
            "symbol": "${symbol}",
            "timeframe": "${timeframe}",
            "currentPrice": number,
            "trend": "uptrend/downtrend/sideways",
            "trendStrength": "strong/moderate/weak",
            "priceAction": "description of current price movement",
            "support": [number, number],
            "resistance": [number, number],
            "entryPoints": [
              {
                "price": number,
                "reasoning": "why this is a good entry"
              }
            ],
            "targets": [number, number, number],
            "stopLoss": number,
            "riskRewardRatio": "1:X",
            "technicalIndicators": {
              "rsi": number,
              "macd": "bullish/bearish/neutral",
              "bollingerBands": "description",
              "movingAverages": "description"
            },
            "momentum": "strong/moderate/weak",
            "volatility": "high/medium/low",
            "recommendation": "BUY/SELL/HOLD",
            "reasoning": "detailed explanation",
            "risks": ["potential risk 1", "potential risk 2"]
          }`
        }
      ]
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    return {
      success: true,
      analysis: JSON.parse(jsonMatch[0])
    };
  } catch (error) {
    console.error('Error in technical analysis:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const compareAssets = async (assets, timeframe = '1D') => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert portfolio analyst. Compare multiple assets and provide relative strength analysis.'
        },
        {
          role: 'user',
          content: `Compare these assets: ${assets.join(', ')} on ${timeframe} timeframe.
          Provide comparison in JSON format:
          {
            "timeframe": "${timeframe}",
            "comparison": [
              {
                "symbol": "asset name",
                "relativeStrength": 0-100,
                "trend": "uptrend/downtrend/sideways",
                "momentum": "strong/moderate/weak",
                "score": 0-100
              }
            ],
            "strongest": "symbol",
            "weakest": "symbol",
            "recommendations": ["recommendation 1", "recommendation 2"]
          }`
        }
      ]
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in comparison response');
    }

    return {
      success: true,
      comparison: JSON.parse(jsonMatch[0])
    };
  } catch (error) {
    console.error('Error comparing assets:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  analyzeSymbol,
  compareAssets
};
