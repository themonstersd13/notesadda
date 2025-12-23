const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Clean up the filename
        const fileName = file.originalname.split('.')[0].replace(/\s+/g, '_') + '-' + Date.now();

        // CHECK IF PDF
        if (file.mimetype === 'application/pdf') {
            return {
                folder: 'notes-adda',
                resource_type: 'auto',
                format: 'pdf', // Force PDF format
                public_id: fileName, 
                access_mode: 'public'
            };
        } else {
            // IMAGES
            return {
                folder: 'notes-adda',
                resource_type: 'image',
                // Remove 'allowed_formats' to accept all common images (jpg, png, webp, etc.)
                public_id: fileName,
                access_mode: 'public'
            };
        }
    },
});

const upload = multer({ storage });

module.exports = { upload, cloudinary };