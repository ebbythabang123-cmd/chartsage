const express = require('express');
const auth = require('../middleware/auth');
const AnalysisResult = require('../models/AnalysisResult');
const { analyzeTechnicalSymbol, compareAssets } = require('../services/technicalAnalysisService');

const router = express.Router();

// Analyze symbol
router.post('/analyze', auth, async (req, res) => {
  try {
    const { symbol, timeframe } = req.body;

    if (!symbol || !timeframe) {
      return res.status(400).json({ error: 'Symbol and timeframe are required' });
    }

    const analysisResult = await analyzeTechnicalSymbol(symbol, timeframe);

    // Save to database
    const analysis = new AnalysisResult({
      userId: req.userId,
      analysisType: 'technical_symbol',
      input: { symbol, timeframe },
      analysis: analysisResult.analysis
    });

    await analysis.save();

    res.json({
      success: true,
      analysisId: analysis._id,
      analysis: analysisResult.analysis
    });
  } catch (error) {
    console.error('Technical analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Compare assets
router.post('/compare', auth, async (req, res) => {
  try {
    const { assets, timeframe } = req.body;

    if (!assets || !timeframe) {
      return res.status(400).json({ error: 'Assets and timeframe are required' });
    }

    const comparisonResult = await compareAssets(assets, timeframe);

    // Save to database
    const analysis = new AnalysisResult({
      userId: req.userId,
      analysisType: 'technical_symbol',
      input: { symbols: assets, timeframe },
      analysis: comparisonResult.comparison
    });

    await analysis.save();

    res.json({
      success: true,
      analysisId: analysis._id,
      comparison: comparisonResult.comparison
    });
  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;