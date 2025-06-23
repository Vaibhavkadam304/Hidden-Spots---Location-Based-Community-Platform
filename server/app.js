require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

const spotRoutes    = require('./routes/spotRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// mount routes
app.use('/api/spots', spotRoutes);
// commentRoutes uses mergeParams to pick up :spotId
app.use('/api/spots', commentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
