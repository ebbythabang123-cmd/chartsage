const express = require('express');
const auth = require('../middleware/auth');
const AnalysisResult = require('../models/AnalysisResult');
const { analyzeSymbol, compareAssets } = require('../services/technicalAnalysisService');

const router = express.Router();

// Analyze symbol
router.post('/analyze', auth, async (req, res) => {
  try {
    const { symbol, timeframe = '1D' } = req.body;

    if (!symbol) {
      return res.status(400).json({ error: 'Symbol required' });
    }

    const analysisResult = await analyzeSymbol(symbol, timeframe);

    if (!analysisResult.success) {
      return res.status(400).json({ error: analysisResult.error });
    }

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
    res.status(500).json({ error: error.message });
  }
});

// Compare assets
router.post('/compare', auth, async (req, res) => {
  try {
    const { assets, timeframe = '1D' } = req.body;

    if (!assets || !Array.isArray(assets) || assets.length < 2) {
      return res.status(400).json({ error: 'At least 2 assets required' });
    }

    const comparisonResult = await compareAssets(assets, timeframe);

    if (!comparisonResult.success) {
      return res.status(400).json({ error: comparisonResult.error });
    }

    res.json({
      success: true,
      comparison: comparisonResult.comparison
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get analysis history
router.get('/history', auth, async (req, res) => {
  try {
    const analyses = await AnalysisResult.find(
      { userId: req.userId, analysisType: 'technical_symbol' }
    ).sort({ createdAt: -1 }).limit(50);

    res.json({ success: true, analyses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
