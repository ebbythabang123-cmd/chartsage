const express = require('express');
const auth = require('../middleware/auth');
const AnalysisResult = require('../models/AnalysisResult');

const router = express.Router();

// Record trade result
router.put('/:analysisId/result', auth, async (req, res) => {
  try {
    const { exitPrice, profitLoss, resultNotes, successful } = req.body;

    const analysis = await AnalysisResult.findOneAndUpdate(
      {
        _id: req.params.analysisId,
        userId: req.userId
      },
      {
        result: {
          successful: successful || false,
          exitPrice,
          profitLoss,
          profitLossPercentage: profitLoss ? (profitLoss / analysis.analysis.entryZone.minPrice) * 100 : 0,
          resultNotes
        }
      },
      { new: true }
    );

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
