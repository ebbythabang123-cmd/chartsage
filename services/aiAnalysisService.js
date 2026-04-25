const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const analyzeChartImage = async (imagePath) => {
  try {
    // Read image file and convert to base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const imageMediaType = 'image/jpeg'; // or detect from file extension

    const message = await openai.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: imageMediaType,
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: `You are an expert technical analysis trader. Analyze this trading chart and provide a comprehensive analysis in JSON format with the following structure:

{
  "bias": {
    "direction": "BULLISH/BEARISH/NEUTRAL",
    "strength": 0-100
  },
  "entryZone": {
    "minPrice": number,
    "maxPrice": number,
    "probability": 0-100
  },
  "targets": [
    {
      "price": number,
      "importance": "high/medium/low",
      "potentialReturn": "percentage string"
    }
  ],
  "riskLevels": {
    "stopLoss": number,
    "trendlineSupport": number,
    "keySupport": number,
    "riskPercentage": number
  },
  "riskRewardRatio": {
    "ratio": "1:X format",
    "description": "Brief description",
    "profitPotential": "percentage"
  },
  "technicalIndicators": {
    "rsi": { "value": number, "status": "overbought/oversold/neutral" },
    "macd": { "value": number, "signal": "bullish/bearish" },
    "bollingerBands": { "upper": number, "lower": number, "middle": number },
    "movingAverages": { "ma20": number, "ma50": number, "ma200": number }
  },
  "marketCondition": "trending/ranging/consolidating/breakout",
  "confidenceScore": 0-100,
  "recommendations": ["array of actionable recommendations"],
  "keyLevels": {
    "resistance": [number, number],
    "support": [number, number]
  }
}

Provide only valid JSON, no additional text.`
            }
          ],
        }
      ],
    });

    // Extract JSON from response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    
    // Try to parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const analysis = JSON.parse(jsonMatch[0]);
    
    return {
      success: true,
      analysis,
      rawResponse: responseText
    };
  } catch (error) {
    console.error('Error analyzing chart:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const generateTradeDecision = async (analysis) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert trading advisor. Based on technical analysis, provide trading decisions.'
        },
        {
          role: 'user',
          content: `Based on this analysis: ${JSON.stringify(analysis)}, provide a trading decision in JSON format:
          {
            "action": "BUY/SELL/HOLD/WAIT",
            "reasoning": "brief explanation",
            "timeHorizon": "short-term/medium-term/long-term"
          }`
        }
      ]
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in decision response');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error generating trade decision:', error);
    return {
      action: 'WAIT',
      reasoning: 'Unable to generate decision',
      timeHorizon: 'unknown'
    };
  }
};

module.exports = {
  analyzeChartImage,
  generateTradeDecision
};
