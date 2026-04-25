const express = require('express');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const AnalysisResult = require('../models/AnalysisResult');
const { analyzeChartImage, generateTradeDecision } = require('../services/aiAnalysisService');
const User = require('../models/User');

const router = express.Router();
const upload = require('express-fileupload');

router.use(upload());

const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Upload and analyze chart
router.post('/analyze', auth, async (req, res) => {
  try {
    if (!req.files || !req.files.chart) {
      return res.status(400).json({ error: 'No chart image provided' });
    }

    const chart = req.files.chart;
    const filename = `${Date.now()}-${chart.name}`;
    const filepath = path.join(uploadDir, filename);

    await chart.mv(filepath);

    // Analyze chart
    const analysisResult = await analyzeChartImage(filepath);

    if (!analysisResult.success) {
      fs.unlinkSync(filepath);
      return res.status(400).json({ error: analysisResult.error });
    }

    // Generate trade decision
    const tradeDecision = await generateTradeDecision(analysisResult.analysis);

    // Save to database
    const analysis = new AnalysisResult({
      userId: req.userId,
      analysisType: 'chart_image',
      input: {
        chartImageUrl: `/uploads/${filename}`
      },
      analysis: analysisResult.analysis,
      tradingDecision: tradeDecision
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
      tradingDecision: tradeDecision,
      chartImageUrl: `/uploads/${filename}`
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get analysis history
router.get('/history', auth, async (req, res) => {
  try {
    const analyses = await AnalysisResult.find(
      { userId: req.userId, analysisType: 'chart_image' }
    ).sort({ createdAt: -1 }).limit(50);

    res.json({ success: true, analyses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific analysis
router.get('/:id', auth, async (req, res) => {
  try {
    const analysis = await AnalysisResult.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete analysis
router.delete('/:id', auth, async (req, res) => {
  try {
    const analysis = await AnalysisResult.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    // Delete chart image if exists
    if (analysis.input.chartImageUrl) {
      const filepath = path.join(__dirname, '..', analysis.input.chartImageUrl);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }

    res.json({ success: true, message: 'Analysis deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get statistics
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const totalAnalyses = await AnalysisResult.countDocuments({
      userId: req.userId,
      analysisType: 'chart_image'
    });

    const successfulAnalyses = await AnalysisResult.countDocuments({
      userId: req.userId,
      analysisType: 'chart_image',
      'result.successful': true
    });

    res.json({
      success: true,
      stats: {
        totalAnalyses,
        successfulAnalyses,
        successRate: totalAnalyses > 0 ? ((successfulAnalyses / totalAnalyses) * 100).toFixed(2) + '%' : '0%',
        ...user.analysisStats
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
