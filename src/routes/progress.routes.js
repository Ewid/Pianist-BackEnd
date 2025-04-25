const express = require('express');
const ProgressController = require('../controllers/progress.controller');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticateToken);

router.get('/', ProgressController.getUserProgress);

router.get('/:songId', ProgressController.getSongProgress);

router.post('/:songId', ProgressController.updateSongProgress);

module.exports = router; 