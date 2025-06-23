// server/routes/commentRoutes.js

const express     = require('express');
const router      = express.Router({ mergeParams: true });
const commentCtrl = require('../controllers/commentController');

// GET  /api/spots/:spotId/comments
router.get('/:spotId/comments', commentCtrl.getComments);

// POST /api/spots/:spotId/comments
router.post('/:spotId/comments', commentCtrl.addComment);

module.exports = router;
