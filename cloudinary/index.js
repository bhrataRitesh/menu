const cloudinary = require('cloudinary').v2;
// const dotenv = require('dotenv');
// dotenv.config();
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
console.log(process.env.secret)
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Menu',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
})

module.exports = {
    cloudinary,
    storage
}