const express = require('express');
const auth = require('../middleware/auth');
const AnalysisResult = require('../models/AnalysisResult');
const { getMarketInsights, analyzePatterns, getRiskManagementAdvice } = require('../services/marketInsightsService');

const router = express.Router();

// Get market insights
router.get('/', auth, async (req, res) => {
  try {
    const insightsResult = await getMarketInsights();

    // Save to database
    const analysis = new AnalysisResult({
      userId: req.userId,
      analysisType: 'market_insight',
      analysis: insightsResult.insights
    });

    await analysis.save();

    res.json({
      success: true,
      analysisId: analysis._id,
      insights: insightsResult.insights
    });
  } catch (error) {
    console.error('Market insights error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Analyze patterns
router.post('/patterns', auth, async (req, res) => {
  try {
    const { patterns } = req.body;

    if (!patterns || !Array.isArray(patterns)) {
      return res.status(400).json({ error: 'Patterns array is required' });
    }

    const patternAnalysis = await analyzePatterns(patterns);

    // Save to database
    const analysis = new AnalysisResult({
      userId: req.userId,
      analysisType: 'market_insight',
      input: { patterns },
      analysis: patternAnalysis.analysis
    });

    await analysis.save();

    res.json({
      success: true,
      analysisId: analysis._id,
      analysis: patternAnalysis.analysis
    });
  } catch (error) {
    console.error('Pattern analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get risk management advice
router.post('/risk-management', auth, async (req, res) => {
  try {
    const { capital, riskPercentage } = req.body;

    if (!capital || !riskPercentage) {
      return res.status(400).json({ error: 'Capital and riskPercentage are required' });
    }

    const advice = await getRiskManagementAdvice(capital, riskPercentage);

    // Save to database
    const analysis = new AnalysisResult({
      userId: req.userId,
      analysisType: 'market_insight',
      input: { capital, riskPercentage },
      analysis: advice.advice
    });

    await analysis.save();

    res.json({
      success: true,
      analysisId: analysis._id,
      advice: advice.advice
    });
  } catch (error) {
    console.error('Risk management error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;