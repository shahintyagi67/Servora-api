// config/multer.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});


const upload = multer({ storage });

module.exports = upload;
