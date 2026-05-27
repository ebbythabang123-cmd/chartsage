const express = require('express');
const auth = require('../middleware/auth');
const AnalysisResult = require('../models/AnalysisResult');

const router = express.Router();

// Update analysis result
router.put('/:id/result', auth, async (req, res) => {
  try {
    const { exitPrice, profitLoss, successful, resultNotes } = req.body;
    const analysis = await AnalysisResult.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    if (analysis.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    analysis.result = {
      exitPrice,
      profitLoss,
      successful,
      resultNotes,
      profitLossPercentage: analysis.input.symbol 
        ? ((profitLoss / exitPrice) * 100).toFixed(2)
        : 0
    };

    analysis.updatedAt = Date.now();
    await analysis.save();

    res.json({ success: true, analysis });
  } catch (error) {
    console.error('Update result error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all analyses by type
router.get('/by-type/:type', auth, async (req, res) => {
  try {
    const validTypes = ['chart_image', 'technical_symbol', 'market_insight'];
    if (!validTypes.includes(req.params.type)) {
      return res.status(400).json({ error: 'Invalid analysis type' });
    }

    const analyses = await AnalysisResult.find({
      userId: req.userId,
      analysisType: req.params.type
    }).sort({ createdAt: -1 });

    res.json({ success: true, analyses });
  } catch (error) {
    console.error('Get analyses error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;