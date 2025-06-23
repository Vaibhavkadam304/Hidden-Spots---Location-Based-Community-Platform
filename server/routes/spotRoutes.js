// server/routes/spotRoutes.js

const express                = require('express');
const router                 = express.Router();
const spotCtrl               = require('../controllers/spotController');
const { upload, processImage } = require('../middleware/uploadMiddleware');

// GET /api/spots/nearby
router.get('/nearby', spotCtrl.getNearbySpots);

// POST /api/spots
// 1) upload the single "image" field
// 2) resize & upload via processImage
// 3) then call your addSpot controller
router.post('/', upload, processImage, spotCtrl.addSpot);

// GET /api/spots/:id
router.get('/:id', spotCtrl.getSpotById);

// POST /api/spots/:id/rate
router.post('/:id/rate', spotCtrl.rateSpot);

module.exports = router;
