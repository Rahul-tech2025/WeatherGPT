const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alert.controller');

// Create an alert
router.post('/', alertController.createAlert);

// Get all active alerts
router.get('/', alertController.getAlerts);

// Check if any alerts are currently triggered by live weather
router.get('/check', alertController.checkAlerts);

// Delete an alert by ID
router.delete('/:id', alertController.deleteAlert);

module.exports = router;
