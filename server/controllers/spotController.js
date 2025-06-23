const Spot = require('../models/Spot');
const { upload, processImages } = require('../middleware/uploadMiddleware');
const { composite } = require('../utils/ratingUtils');

// GET /api/spots/nearby?lat=..&lng=..&radius=..
exports.getNearbySpots = async (req, res) => {
  const { lat, lng, radius=5 } = req.query;
  try {
    const spots = await Spot.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [ parseFloat(lng), parseFloat(lat) ] },
          $maxDistance: parseFloat(radius) * 1000
        }
      }
    });
    const enriched = spots.map(s => ({
      ...s.toObject(),
      compositeRating: composite(s.ratings)
    }));
    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch nearby spots' });
  }
};

// Within your addSpot handler in controllers/spotController.js
exports.addSpot = async (req, res) => {
  try {
    const { name, category, lat, lng, story } = req.body;
    const newSpot = new Spot({
      name,
      category,
      location: { type:'Point', coordinates:[ parseFloat(lng), parseFloat(lat) ] },
      images: req.imageUrls || [],   // ← now populated by processImage
      ratings: { uniqueness:[], vibe:[], safety:[], crowd:[] },
      stories: [{ user:'Anonymous', text: story || '' }]
    });
    const saved = await newSpot.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('addSpot error:', err);
    res.status(500).json({ error: 'Failed to create spot' });
  }
};


// GET /api/spots/:id
exports.getSpotById = async (req, res) => {
  try {
    const spot = await Spot.findById(req.params.id).populate('comments');
    if (!spot) return res.status(404).json({ error: 'Spot not found' });
    const obj = spot.toObject();
    obj.compositeRating = composite(spot.ratings);
    res.json(obj);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch spot' });
  }
};

// POST /api/spots/:id/rate
exports.rateSpot = async (req, res) => {
  try {
    const { uniqueness, vibe, safety, crowd } = req.body;
    const spot = await Spot.findById(req.params.id);
    if (!spot) return res.status(404).json({ error: 'Spot not found' });
    spot.ratings.uniqueness.push(+uniqueness);
    spot.ratings.vibe.push(+vibe);
    spot.ratings.safety.push(+safety);
    spot.ratings.crowd.push(+crowd);
    await spot.save();
    res.json({ compositeRating: composite(spot.ratings) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to rate spot' });
  }
};
