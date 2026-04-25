require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// Import routes
const chartAnalysisRoutes = require('./routes/chartAnalysis');
const technicalAnalysisRoutes = require('./routes/technicalAnalysis');
const marketInsightsRoutes = require('./routes/marketInsights');
const aiEntriesRoutes = require('./routes/aiEntries');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chartsage', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chart-analysis', chartAnalysisRoutes);
app.use('/api/technical-analysis', technicalAnalysisRoutes);
app.use('/api/market-insights', marketInsightsRoutes);
app.use('/api/ai-entries', aiEntriesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'AI Trading Assistant is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 AI Trading Assistant running on port ${PORT}`);
});
