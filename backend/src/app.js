const express = require('express');
const cors = require('cors');
require('dotenv').config();

const weatherRoutes = require('./routes/weather.routes');
const mlRoutes = require('./routes/ml.routes');
const aiRoutes = require('./routes/ai.routes');
const authRoutes = require('./routes/auth.routes');
const alertRoutes = require('./routes/alert.routes');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'WeatherGPT Backend Service is running smoothly 🌤️',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Weather API Routes
app.use('/api/weather', weatherRoutes);

// Machine Learning API Routes
app.use('/api/ml', mlRoutes);

// Gemini Conversational AI Routes
app.use('/api/ai', aiRoutes);

// User Authentication & Favorites Routes
app.use('/api/auth', authRoutes);

// Weather Alert Thresholds Routes
app.use('/api/alerts', alertRoutes);

// Central 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Endpoint ${req.originalUrl} not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
