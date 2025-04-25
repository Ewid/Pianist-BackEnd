const express = require('express');
const UserController = require('../controllers/user.controller');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticateToken);

router.get('/profile', UserController.getProfile);

module.exports = router; 