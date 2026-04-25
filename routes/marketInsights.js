const express = require('express');
const auth = require('../middleware/auth');
const { getMarketInsights, analyzePatterns, getRiskManagement } = require('../services/marketInsightsService');

const router = express.Router();

// Get market insights
router.get('/', auth, async (req, res) => {
  try {
    const insightsResult = await getMarketInsights();

    if (!insightsResult.success) {
      return res.status(400).json({ error: insightsResult.error });
    }

    res.json({
      success: true,
      insights: insightsResult.insights
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analyze patterns
router.post('/patterns', auth, async (req, res) => {
  try {
    const { patterns } = req.body;

    if (!patterns || !Array.isArray(patterns) || patterns.length === 0) {
      return res.status(400).json({ error: 'Patterns array required' });
    }

    const analysisResult = await analyzePatterns(patterns);

    if (!analysisResult.success) {
      return res.status(400).json({ error: analysisResult.error });
    }

    res.json({
      success: true,
      analysis: analysisResult.analysis
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get risk management advice
router.post('/risk-management', auth, async (req, res) => {
  try {
    const { capital, riskPercentage } = req.body;

    if (!capital || !riskPercentage) {
      return res.status(400).json({ error: 'Capital and riskPercentage required' });
    }

    const riskResult = await getRiskManagement(capital, riskPercentage);

    if (!riskResult.success) {
      return res.status(400).json({ error: riskResult.error });
    }

    res.json({
      success: true,
      riskManagement: riskResult.riskManagement
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
