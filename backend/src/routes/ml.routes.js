const express = require('express');
const router = express.Router();
const mlController = require('../controllers/ml.controller');

// GET /api/ml/health - Microservice health status
router.get('/health', mlController.getHealth);

// GET /api/ml/metrics - Model accuracy, F1 score, MAE, algorithm comparison
router.get('/metrics', mlController.getMetrics);

// GET /api/ml/predict?lat=...&lon=...&city=... - Predict for location
router.get('/predict', mlController.predictForLocation);

// POST /api/ml/predict/daily - Custom history-based prediction
router.post('/predict/daily', mlController.predictDirect);

module.exports = router;
