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
        // Determine resource type based on file mimetype
        const isPdf = file.mimetype === 'application/pdf';
        
        return {
            folder: 'notes-adda',
            // CRITICAL FIX: explicit public access
            access_mode: 'public', 
            // PDFs usually work better as 'raw' or 'image' depending on use case. 
            // 'auto' is safest, but sometimes defaults to private.
            resource_type: 'auto', 
            allowed_formats: ['pdf'],
            // Use original filename or unique ID
            public_id: file.originalname.split('.')[0] + '-' + Date.now()
        };
    },
});

const upload = multer({ storage });

module.exports = { upload, cloudinary };