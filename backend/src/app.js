const express = require('express');
const cors = require('cors');
require('dotenv').config();

const {
  securityHeaders,
  injectionSanitizer,
  standardLimiter,
  aiChatLimiter,
  authLimiter,
} = require('./middleware/security.middleware');

const weatherRoutes = require('./routes/weather.routes');
const mlRoutes = require('./routes/ml.routes');
const aiRoutes = require('./routes/ai.routes');
const authRoutes = require('./routes/auth.routes');
const alertRoutes = require('./routes/alert.routes');

const app = express();

// Disable Express fingerprint
app.disable('x-powered-by');

// Enterprise Security Headers
app.use(securityHeaders);

// CORS Whitelist Protection
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. server-to-server or curl), whitelisted origins, or vercel/render domains
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.onrender.com')
    ) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not permitted by WeatherGPT CORS policy`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body Parser with strict payload size limits (prevents payload DOS attacks)
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Anti-NoSQL & Parameter Injection Sanitization
app.use(injectionSanitizer);

// Global Sliding Window Rate Limiting
app.use(standardLimiter);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    service: 'WeatherGPT Meteorological Intelligence Gateway',
    version: '2.4.0',
    security: 'enforced',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Weather API Routes
app.use('/api/weather', weatherRoutes);

// Machine Learning API Routes
app.use('/api/ml', mlRoutes);

// Gemini Conversational AI Routes (Protected by AI rate limiter)
app.use('/api/ai', aiChatLimiter, aiRoutes);

// User Authentication & Favorites Routes (Protected by brute-force rate limiter)
app.use('/api/auth', authLimiter, authRoutes);

// Weather Alert Thresholds Routes
app.use('/api/alerts', alertRoutes);

// Central 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Endpoint ${req.originalUrl} not found`
  });
});

// Centralized Secure Error Handler
app.use((err, req, res, next) => {
  // Prevent stack leak in production responses
  const statusCode = err.status || 500;
  const isDev = process.env.NODE_ENV === 'development';

  console.error('[WeatherGPT Security Gateway Error]:', err.message, err.stack);

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Processing Error',
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;
