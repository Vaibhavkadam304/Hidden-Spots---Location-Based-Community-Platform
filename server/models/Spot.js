const mongoose = require('mongoose');

const SpotSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  category:   { type: String, enum: ['Romantic','Serene','Creative'], required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    }
  },
  images:   [String],   // array of Cloudinary URLs
  ratings: {
    uniqueness: [Number],
    vibe:       [Number],
    safety:     [Number],
    crowd:      [Number]
  },
  stories: [{
    user: String,
    text: String,
    date: { type: Date, default: Date.now }
  }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

SpotSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Spot', SpotSchema);
