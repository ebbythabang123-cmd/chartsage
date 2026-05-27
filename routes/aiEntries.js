const express = require('express');
const fileupload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const AnalysisResult = require('../models/AnalysisResult');
const User = require('../models/User');
const { analyzeChartImage, generateTradingDecision } = require('../services/aiAnalysisService');

const router = express.Router();
router.use(fileupload());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Analyze chart image
router.post('/analyze', auth, async (req, res) => {
  try {
    if (!req.files || !req.files.chart) {
      return res.status(400).json({ error: 'No chart image provided' });
    }

    const chartFile = req.files.chart;
    const fileName = `${Date.now()}_${chartFile.name}`;
    const uploadPath = path.join(uploadsDir, fileName);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(chartFile.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type. Only images allowed' });
    }

    // Upload file
    await chartFile.mv(uploadPath);

    // Analyze chart
    const analysisResult = await analyzeChartImage(uploadPath);
    const tradingDecision = await generateTradingDecision(analysisResult.analysis);

    // Save to database
    const analysis = new AnalysisResult({
      userId: req.userId,
      analysisType: 'chart_image',
      input: {
        chartImageUrl: `/uploads/${fileName}`,
        fileName
      },
      analysis: analysisResult.analysis,
      tradingDecision
    });

    await analysis.save();

    // Update user stats
    const user = await User.findById(req.userId);
    user.analysisStats.totalAnalyses += 1;
    await user.save();

    res.json({
      success: true,
      analysisId: analysis._id,
      analysis: analysisResult.analysis,
      tradingDecision
    });
  } catch (error) {
    console.error('Chart analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get analysis history
router.get('/history', auth, async (req, res) => {
  try {
    const analyses = await AnalysisResult.find(
      { userId: req.userId, analysisType: 'chart_image' }
    ).sort({ createdAt: -1 });

    res.json({ success: true, analyses });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get specific analysis
router.get('/:id', auth, async (req, res) => {
  try {
    const analysis = await AnalysisResult.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    if (analysis.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json({ success: true, analysis });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete analysis
router.delete('/:id', auth, async (req, res) => {
  try {
    const analysis = await AnalysisResult.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    if (analysis.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Delete file if exists
    if (analysis.input.fileName) {
      const filePath = path.join(uploadsDir, analysis.input.fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await AnalysisResult.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Analysis deleted' });
  } catch (error) {
    console.error('Delete analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get statistics
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const analyses = await AnalysisResult.find({ userId: req.userId });

    const successfulTrades = analyses.filter(a => a.result?.successful).length;
    const totalAnalyses = analyses.length;
    const winRate = totalAnalyses > 0 ? (successfulTrades / totalAnalyses * 100).toFixed(2) : 0;

    const avgRiskReward = analyses.length > 0
      ? (analyses.reduce((sum, a) => sum + parseFloat(a.analysis?.riskRewardRatio?.ratio?.split(':')[1] || 0), 0) / analyses.length).toFixed(2)
      : 0;

    res.json({
      success: true,
      stats: {
        totalAnalyses,
        successfulTrades,
        winRate: `${winRate}%`,
        averageRiskReward: avgRiskReward,
        analysissByType: analyses.reduce((acc, a) => {
          acc[a.analysisType] = (acc[a.analysisType] || 0) + 1;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;