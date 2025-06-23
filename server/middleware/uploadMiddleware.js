// server/middleware/uploadMiddleware.js
const multer = require('multer');
const sharp  = require('sharp');
const streamifier = require('streamifier');
const cloudinary  = require('../config/cloudinary');

const storage = multer.memoryStorage();
// expect a single file under field name "image"
const upload  = multer({ storage }).single('image');

async function processImage(req, res, next) {
  if (!req.file) {
    return next();
  }

  try {
    // resize & compress the single buffer
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 1024 })
      .jpeg({ quality: 80 })
      .toBuffer();

    // upload to Cloudinary via upload_stream
    const urls = [];
    await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'hidden_spots' },
        (err, result) => {
          if (err) return reject(err);
          urls.push(result.secure_url);
          resolve();
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    req.imageUrls = urls;  // array with one URL
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { upload, processImage };
