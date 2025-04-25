const express = require('express');
const SongController = require('../controllers/song.controller');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticateToken);

router.get('/', SongController.getAccessibleSongs);

router.get('/:id', SongController.getSongById);





module.exports = router;