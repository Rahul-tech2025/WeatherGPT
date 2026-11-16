const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weather.controller');

// City Search / Geocoding
router.get('/search', weatherController.search);

// Current Weather
router.get('/current', weatherController.getCurrent);

// 7-day & Hourly Forecast
router.get('/forecast', weatherController.getForecast);

// Historical Weather Trends
router.get('/history', weatherController.getHistory);

module.exports = router;
