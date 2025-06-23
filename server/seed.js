require('dotenv').config();
const mongoose = require('mongoose');
const Spot     = require('./models/Spot');

async function seedDB() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser:    true,
    useUnifiedTopology: true,
  });
  console.log('✅ MongoDB Connected for seeding');

  // IMPORTANT: match your Spot schema field names!
  const spots = [
    {
      name:     "Gwalior Fort Secret Garden",
      category: "Serene",
      // your schema calls this field `location` (not `coordinates`)
      location: {
        type:        "Point",
        coordinates: [78.1628, 26.2301]
      },
      images: [
        "https://res.cloudinary.com/…/imag1_uido7y.jpg"
      ],
      ratings: {
        uniqueness: [], vibe: [], safety: [], crowd: []
      },
      stories: [
        { user:"Ravi", text:"Sat here for an hour in silence. Beautiful energy." }
      ]
    },
    {
      name:     "Tighra Dam Hidden Trail",
      category: "Romantic",
      location: {
        type:        "Point",
        coordinates: [78.1039, 26.1552]
      },
      images: ["https://res.cloudinary.com/…/image2_poymjc.webp"],
      ratings: { uniqueness: [], vibe: [], safety: [], crowd: [] },
      stories: []
    },
    {
      name:     "Sunset View Behind Jai Vilas",
      category: "Creative",
      location: {
        type:        "Point",
        coordinates: [78.1592, 26.2129]
      },
      images: ["https://res.cloudinary.com/…/image3_nye2ur.jpg"],
      ratings: { uniqueness: [], vibe: [], safety: [], crowd: [] },
      stories: []
    },
    {
      name:     "Phoolbagh Rusty Café",
      category: "Romantic",
      location: {
        type:        "Point",
        coordinates: [78.1749, 26.2078]
      },
      images: ["https://res.cloudinary.com/…/image4_qhax9o.jpg"],
      ratings: { uniqueness: [], vibe: [], safety: [], crowd: [] },
      stories: []
    }
  ];

  // wipe & insert
  await Spot.deleteMany({});
  await Spot.insertMany(spots);
  console.log("🌱 Seeded Gwalior hidden spots successfully!");
  mongoose.connection.close();
}

seedDB().catch(err => {
  console.error("Seeding error:", err);
  process.exit(1);
});
