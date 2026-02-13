const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Public endpoints
router.post('/login', authController.login);
router.post('/refresh', authController.refreshAccessToken);

// Protected endpoints
router.post('/logout', verifyToken, authController.logout);
router.get('/verify', verifyToken, authController.verifySession);

module.exports = router;
