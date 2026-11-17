const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', authenticateToken, authController.getMe);
router.post('/favorites', authenticateToken, authController.addFavorite);
router.delete('/favorites/:cityName', authenticateToken, authController.removeFavorite);

module.exports = router;
