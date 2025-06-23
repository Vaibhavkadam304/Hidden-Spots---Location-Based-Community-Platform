// server/controllers/commentController.js

const Comment = require('../models/Comment');
const Spot    = require('../models/Spot');

async function getComments(req, res) {
  try {
    const comments = await Comment.find({ spot: req.params.spotId })
      .sort('-createdAt');
    return res.json(comments);
  } catch (err) {
    console.error('getComments error:', err);
    return res.status(500).json({ error: 'Failed to fetch comments' });
  }
}

async function addComment(req, res) {
  try {
    const author = req.body.author
      ? req.body.author
      : req.body.isAnonymous
        ? 'Anonymous'
        : 'Unknown';

    const comment = await Comment.create({
      spot:        req.params.spotId,
      author,
      text:        req.body.text,
      isAnonymous: !!req.body.isAnonymous
    });

    await Spot.findByIdAndUpdate(
      req.params.spotId,
      { $push: { comments: comment._id } }
    );

    return res.status(201).json(comment);
  } catch (err) {
    console.error('addComment error:', err);
    return res.status(500).json({ error: 'Failed to add comment' });
  }
}

module.exports = {
  getComments,
  addComment
};
