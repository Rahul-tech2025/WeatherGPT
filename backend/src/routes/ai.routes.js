const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

// POST /api/ai/chat - Chat with WeatherGPT AI Assistant
router.post('/chat', aiController.chat);

module.exports = router;
