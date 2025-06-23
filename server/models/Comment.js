// server/models/Comment.js
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  spot:        { type: mongoose.Schema.Types.ObjectId, ref: 'Spot', required: true },
  author:      { type: String, default: 'Anonymous' },   // ← removed `required: true`, added default
  text:        { type: String, required: true },
  isAnonymous: { type: Boolean, default: false },
  reported:    { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Comment', CommentSchema);
